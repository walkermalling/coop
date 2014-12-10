'use strict';

/**
 *  Generate Recs
 */

var appRoot = require('app-root-path');
var mongoose = require('mongoose');

var Promise = require('bluebird');
var _ = require('lodash');
var TransactionModel = require(appRoot + '/models/transaction-model');
var MemberModel = require(appRoot + '/models/member-model');

mongoose.connect('mongodb://localhost/coop-db');

// infer ratings

MemberModel.find({}, function (err, members) {

  if (err) return err;

  members.forEach(function (member) {

    TransactionModel.find({'sittingReceiverId' : member.memberId},
      function (err, trxs) {

        // get an array of frequency counts per provider

        var providerCounts = _.countBy(trxs, function (trx) {
          return trx.sittingProviderId;
        });


        // calculate percent frequency for each provider 
        
        var providerFrequencies = {};
        for (var key in providerCounts) {
          providerFrequencies[key] = Math.round( providerCounts[key] / trxs.length * 1000 ) / 10;
        }

        // calculate 5 star rating with the max frequency as 5 stars
        
        var providerRatings = {};
        var maxFreq = _.max(providerFrequencies);
        for (var key in providerFrequencies) {
          providerRatings[key] = Math.round( providerFrequencies[key] / maxFreq * 50 ) / 10;
        }

        // save a sorted array of ratings

        console.log(providerRatings)
        // member.ratings = providerRatings;
        
        console.log('\n');

      }
    );

  });

  



});

