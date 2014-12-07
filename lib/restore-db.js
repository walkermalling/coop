'use strict';

/**
 *  Restore Coop Database from Transactions Log
 */

var fs = require('fs');
var xml2js = require('xml2js');
var mongoose = require('mongoose');
var TransactionModel = require('../models/transaction-model');
var appRoot = require('app-root-path');

mongoose.connect('mongodb://localhost/coop-db');

var parser = new xml2js.Parser();

var transactions = fs.readFileSync(appRoot + '/logs/transactions.xml');

parser.parseString(transactions, function (err, result) {
  
  if (err) return false;

  var trxArr = result.ArrayOfBabySittingTransaction.BabySittingTransaction;

  trxArr.forEach(function (trx)  {

    var newTransaction = new TransactionModel();

    newTransaction.childrenWatched = trx.ChildrenWatched[0];
    newTransaction.duration = parseInt(trx.Duration[0].match(/\d+/)[0]);
    newTransaction.sittingProviderId = trx.SittingProviderId[0];
    newTransaction.sittingReceiverId = trx.SittingReceiverId[0];
    newTransaction.startedAt = trx.StartedAtUtc[0]['a:DateTime'][0];
    newTransaction.offsetMinutes = parseInt(trx.StartedAtUtc[0]['a:OffsetMinutes'][0]);

    newTransaction.save(function (err, result) {
      if (err) return err;
      console.dir(result);
    });

  });

});

