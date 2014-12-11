'use strict';

/**
 *  Generate Recs
 */

var appRoot = require('app-root-path');
var mongoose = require('mongoose');

var _ = require('lodash');
var TransactionModel = require(appRoot + '/models/transaction-model');
var MemberModel = require(appRoot + '/models/member-model');

mongoose.connect('mongodb://localhost/coop-db');

// infer ratings

MemberModel.find({}, function (err, members) {
  if (err) return err;

  members.forEach(function (member) {

    TransactionModel.find({'sittingReceiverId':member.memberId}, 
      function (err, trxs) {

        var ratings = calculateRatings(trxs);
        
        member.update({'stats.ratings' : ratings },
          function (err, response) {
            if (err) console.log(err);
            else console.log(response);
          }
        );
        
      }
    );

  });

});


// routines

function calculateRatings (trxs) {

  console.log('calculating');

  // get an array of frequency counts per provider

  var providerCounts = _.countBy(trxs, function (trx) {
    return trx.sittingProviderId;
  });

  // calculate percent frequency for each provider 

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
