'use strict';

/**
 *  Derive Members from a Transaction Collection
 */

var mongoose = require('mongoose');
var TransactionModel = require('../models/transaction-model');
var MemberModel = require('../models/member-model');

mongoose.connect('mongodb://localhost/coop-db');

// Fetch Transactions

TransactionModel.find({}, function (err, trxs) {
  if (err) console.log(err);

  // console.dir(typeof trxs[0].sittingProviderId);
  // console.dir(trxs[0].childrenWatched);
  // console.dir(trxs[0].duration);
  // console.dir(trxs[0].pointValue());

  MemberModel.remove({});
  
  trxs.forEach(function (trx) {

    console.dir('searching for memberId ' + trx.sittingProviderId);
    
    

    // update provider
    
    MemberModel.findOne(
      {  
        memberId : trx.sittingProviderId
      },
      function (err, member) {

        var provider;

        if (err) {
          return err;
        }
        else if (!member) {
          provider = new MemberModel();
          provider.memberId = trx.sittingProviderId;
        } else {
          provider = member;
        }
        
        provider.stats.points += trx.pointValue();
        provider.stats.providerInstances += 1;

        provider.save(function (err, doc, numberAffected) {
          if (err) console.dir(err);
        });
      }
    );

    // update receiver
    
    MemberModel.findOne(
      {  
        memberId : trx.sittingReceiverId
      },
      function (err, member) {

        var receiver;

        if (err) {
          return err;
        }
        else if (!member) {
          receiver = new MemberModel();
          receiver.memberId = trx.sittingReceiverId;
        } else {
          receiver = member;
        }
        
        receiver.stats.points -= trx.pointValue();
        receiver.stats.receiverInstances += 1;

        receiver.save(function (err, doc, numberAffected) {
          if (err) console.dir(err);
          if (doc) console.dir('updated ' + doc._id);
          if (numberAffected) console.dir('updated ' + numberAffected);
        });
      }
    );

  });

});
