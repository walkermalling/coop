'use strict';

/**
 *  Generate Recs
 *    - for each member, generate approximate ratings for each other provider
 *      based on frequency of this members use of that provider
 */

var appRoot = require('app-root-path');
var mongoose = require('mongoose');
var Promise = require('bluebird'); /* jshint ignore:line */
var _ = require('lodash');
var TransactionModel = require(appRoot + '/models/transaction-model');
var MemberModel = require(appRoot + '/models/member-model');

mongoose.connect('mongodb://localhost/coop-db');

// execute:

(function () {
  // retrieve all members
  return new Promise(function (resolve, reject) {
    MemberModel.find({}, function (err, members) {
      if (err) reject(err);
      else resolve(members);
    });
  });
}())
.then(function (members) {
  // retrieve all transactions
  // return both members and transactions
  return new Promise(function (resolve, reject) {
    TransactionModel.find({}, function (err, trxs) {
      if (err) reject(err);
      else resolve({
        'members': members,
        'transactions': trxs
      });
    });
  });
})
.then(function (data) {
  // for each member, generate approximate ratings and update member model
  return new Promise(function (resolve) {
    var promises = _.map(data.members, function (member) {
      return new Promise(function (resolve, reject) {
        var ratings = calculateRatings(data.transactions, member.memberId);
        member.update({'stats.ratings' : ratings },
          function (err, response) {
            if (err) reject(err);
            else resolve(response);
          }
        );
      });
    });
    resolve(promises);
  });
})
.then(function (updates) {
  // exit process
  console.log('done');
  process.exit(0);
});


// routines

function calculateRatings (allTransactions, memberId) {

  // filter for transactions where current member is the receiver

  var trxs = _.filter(allTransactions, function (trx) {
    return trx.sittingReceiverId === memberId;
  });

  // get an array of frequency counts per provider

  var providerCounts = _.countBy(trxs, function (trx) {
    return trx.sittingProviderId;
  });

  // calculate percent frequency for each provider, based on total transactions

  var providerFrequencies = {};
  for (var provider in providerCounts) {
    providerFrequencies[provider] = Math.round( providerCounts[provider] / trxs.length * 1000 ) / 10;
  }

  // calculate 5 star rating with the max frequency as 5 stars

  var providerRatings = {};
  var maxFreq = _.max(providerFrequencies);
  for (var key in providerFrequencies) {
    providerRatings[key] = Math.round( providerFrequencies[key] / maxFreq * 50 ) / 10;
  }

  return providerRatings;
}
