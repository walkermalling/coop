'use strict';

var appRoot = require('app-root-path');
var Promise = require('bluebird');
var _ = require('lodash');
var TransactionModel = require(appRoot + '/models/transaction-model');
var MemberModel = require(appRoot + '/models/member-model');

module.exports = function(){

  function distinct (field){
    return new Promise(function (resolve,reject) {
      TransactionModel.distinct(field, function (err, result) {
        if (err) reject(err);
        resolve(result);
      })
    });
  }

  return {
    populate : function (){
      
      console.dir('populating member collection ...');

      return new Promise( function (resolve, reject) {

        distinct('sittingProviderId')
          .then(function (providers) {
            distinct('sittingReceiverId')
              .then(function (receivers) {
                var ids = _.uniq(providers.concat(receivers));
                var promises = _.map(ids, function (id) {
                  return new Promise(function (resolve, reject) {
                    var newMember = new MemberModel();
                    newMember.memberId = id;
                    newMember.stats.points = 5;
                    newMember.save(function (err, response){
                      if (err) reject(err);
                      resolve(response);
                    });
                  });
                });

                resolve(promises);
              });
          });

      });
    },
    infer : function () {

      console.dir('infering member data ...');

      return new Promise(function (resolve, reject) {

        TransactionModel.find({}, function (err, trxs) {
          if (err) reject(err);
          
          var promises = _.map(trxs, function (trx){
            return new Promise(function (resolve, reject) {
              // provider
              MemberModel.findOneAndUpdate(
                { memberId : trx.sittingProviderId },
                {  
                  memberId : trx.sittingProviderId,
                  $inc : { 
                    "stats.points" : trx.pointValue(),
                    "stats.providerInstances" : 1
                  },
                  updatedAt: new Date()
                },
                { upsert : true }, 
                function (err, doc, affected) {
                  if (err) reject(err);
                  else resolve(doc);
                } 
              );
              // receiver
              MemberModel.findOneAndUpdate(
                { memberId : trx.sittingReceiverId },
                {  
                  memberId : trx.sittingReceiverId,
                  $inc : { 
                    "stats.points" : -trx.pointValue(),
                    "stats.receiverInstances" : 1
                  },
                  updatedAt: new Date()
                },
                { upsert : true }, 
                function (err, doc, affected){
                  if (err) reject(err);
                  else resolve(doc);
                }
              );
            });
          }); // end map

          resolve(promises);

        }); 

      });

    }
  };

};

