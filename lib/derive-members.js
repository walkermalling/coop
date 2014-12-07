'use strict';

/**
 *  Derive Members from a Transaction Collection
 */

var fs = require('fs');
var mongoose = require('mongoose');
var TransactionModel = require('../models/transaction-model');
// var MemberModel = require('../models/member-model');

mongoose.connect('mongodb://localhost/coop-db');

// Fetch Transactions

TransactionModel.find({}, function (err, trxs) {
  if (err) console.log(err);
  console.log(trxs.length);
});
