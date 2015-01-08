'use strict';

var MemberModel = require('../models/member-model');
var TransactionModel = require('../models/transaction-model');

module.exports = function (app) {

  /**
   * Get All Members
   */
  
  app.get('/members', function (req,res) {
    MemberModel.find({}, function (err, members) {
      if (err) return res.status(500).json(err);
      else res.status(200).send(members);
    });
  });

  /**
   * Get One Member by memberId
   */
  
  app.get('/members/:id', function (req,res) {
    MemberModel.findOne({
        'memberId' : req.params.id
      }, function (err, member) {
        if (err) return res.status(500).json(err);

        TransactionModel.find({
          'sittingReceiverId' : req.params.id
          }, function (err, trxs) {
            if (err) return res.status(500).json(err);

            res.status(200).send({
              'member' : member,
              'receiverTransactions' : trxs
            });
          }
        );
        
      }
    );
  });

};
