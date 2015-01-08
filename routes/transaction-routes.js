'use strict';

var TransactionModel = require('../models/transaction-model');

module.exports = function (app) {

  /**
   * Get All Transactions
   */
  
  app.get('/transactions', function (req,res) {
    TransactionModel.find({}, function (err, trxs) {
      if (err) return res.status(500).json(err);
      else res.status(200).send(trxs);
    });
  });

  /**
   * Get One Transaction by ID
   */
  app.get('/transactions/:id', function (req,res) {
    TransactionModel.findOne({'_id' : req.params.id}, function (err, trx) {
      if (err) return res.status(500).json(err);
      else res.status(200).send(trx);
    });
  });

};
