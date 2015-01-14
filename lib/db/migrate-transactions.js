'use strict';

var appRoot = require('app-root-path');
var fs = require('fs');
var xml2js = require('xml2js');
var Promise = require('bluebird');
var _ = require('lodash');
var TransactionModel = require(appRoot + '/models/transaction-model');

module.exports = function(){

  var parser = new xml2js.Parser();
  var transactions = fs.readFileSync(appRoot + '/logs/transactions.xml');

  return {

    migrate: function () {

      console.dir('migrating transactions ...');

      // return a promise that will resolve when all transactions have migrated

      return new Promise(function (resolve,reject) {

        // parse the xml file
        
        parser.parseString(transactions, function (err, result) {
        
          if (err) reject(err);

          var trxArr = result.ArrayOfBabySittingTransaction.BabySittingTransaction;

          // for each transaction in the array
          // return a promise to resolve when it is saved in the database

          var promises = _.map(trxArr, function (trx) {

            return new Promise(function (resolve,reject) {

              var newTransaction = new TransactionModel();

              newTransaction.childrenWatched = trx.ChildrenWatched[0];
              newTransaction.duration = parseInt(trx.Duration[0].match(/\d+/)[0]);
              newTransaction.sittingProviderId = trx.SittingProviderId[0];
              newTransaction.sittingReceiverId = trx.SittingReceiverId[0];
              newTransaction.startedAt = trx.StartedAtUtc[0]['a:DateTime'][0];
              newTransaction.offsetMinutes = parseInt(trx.StartedAtUtc[0]['a:OffsetMinutes'][0]);

              newTransaction.save(function (err, result) {
                if (err) reject(err);
                resolve(result);
              });

            }); // end return

          }); // end map promises

          // resolve the array of promises
          resolve(promises);

        }); // end parseString

      }); 

    } // end migrate

  };
};