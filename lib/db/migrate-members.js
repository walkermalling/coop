'use strict';

var appRoot = require('app-root-path');
var Promise = require('bluebird');
var _ = require('lodash');
var TransactionModel = require(appRoot + '/models/transaction-model');
var MemberModel = require(appRoot + '/models/member-model');

module.exports = function () {

  // define a map of names to numbers 
  // to allow better readability on the front end

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

  // wrap mongo's Distinct utility so that it will return a promise
  // when complete

  function distinct (field) {
    return new Promise(function (resolve,reject) {
      TransactionModel.distinct(field, function (err, result) {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  return {

    // create a starter record (no transaction info) for each member 

    populate: function () {
      
      console.dir('populating member collection ...');

      return new Promise( function (resolve, reject) {

        // get a lsit of unique providers
        // then a list of unique receivers

        distinct('sittingProviderId')
          .then(function (providers) {
            distinct('sittingReceiverId')
              .then(function (receivers) {

                // combine the lsits to one list of unique members
                
                var ids = _.uniq(providers.concat(receivers));

                // for each member, create a new record
                
                var promises = _.map(ids, function (id) {

                  return new Promise(function (resolve, reject) {

                    var newMember = new MemberModel();
                    newMember.memberId = id;
                    newMember.name = nameMap[id].name || _.map(id, function (c) {
                      return nameMap[c].numeral}
                    ).join();

                    // start the member with 5 points
                    newMember.stats.points = 5;
                    // save 
                    newMember.save(function (err, response) {
                      if (err) reject(err);
                      resolve(response);
                    });
                  });
                });

                // resolve the array of promises
                resolve(promises);

              });
          });

      });
    },

    // for each transaction, update the records 
    // for both the provider and the receiver

    infer: function () {

      console.dir('infering member data ...');

      return new Promise(function (resolve, reject) {

        TransactionModel.find({}, function (err, trxs) {
          if (err) reject(err);
          
          var promises = _.map(trxs, function (trx) {

            return new Promise(function (resolve, reject) {

              // update the provider
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

              // update the receiver
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
                function (err, doc, affected) {
                  if (err) reject(err);
                  else resolve(doc);
                }
              );
            });
          }); // end map

          // resolve the array of promises
          resolve(promises);

        }); 

      });

    }
  };

};