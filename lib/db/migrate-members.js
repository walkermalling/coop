'use strict';

var appRoot = require('app-root-path');
var Promise = require('bluebird');
var _ = require('lodash');
var TransactionModel = require(appRoot + '/models/transaction-model');
var MemberModel = require(appRoot + '/models/member-model');

module.exports = function(){

  var nameMap = {
    '0' : {'name' : false,      'numeral' : 'Zero'},
    '1' : {'name' : 'Oneida',   'numeral' : 'One'},
    '2' : {'name' : 'Twombly',  'numeral' : 'Two'},
    '3' : {'name' : 'Guthree',  'numeral' : 'Three'},
    '4' : {'name' : 'Telfour',  'numeral' : 'Four'},
    '5' : {'name' : false,      'numeral' : 'Five'},
    '6' : {'name' : 'Sixtus',   'numeral' : 'Six'},
    '7' : {'name' : 'Septimus', 'numeral' : 'Seven'},
    '8' : {'name' : 'Octavia',  'numeral' : 'Eight'},
    '9' : {'name' : 'Nanina',   'numeral' : 'Nine'}
  };

  function distinct (field){
    return new Promise(function (resolve,reject) {
      TransactionModel.distinct(field, function (err, result) {
        if (err) reject(err);
        resolve(result);
      });
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
                    newMember.name = nameMap[id].name || _.map(id, function (c) {
                      return nameMap[c].numeral}
                    ).join();
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

