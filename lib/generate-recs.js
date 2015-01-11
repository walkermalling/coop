'use strict';

/**
 *  Generate Recommendations based on Current Ratings
 *
 *  This script uses the previously generated ratings to generate 
 *  recommendations.  It adapts the Slope One recommendation engine to this 
 *  purpose.
 *
 *  
 * 
 */

var appRoot = require('app-root-path');
var mongoose = require('mongoose');
var Promise = require('bluebird'); /* jshint ignore:line */
var _ = require('lodash');
var MemberModel = require(appRoot + '/models/member-model');

mongoose.connect('mongodb://localhost/coop-db');

(function () {
  // fetch all members
  return new Promise(function (resolve) {
    MemberModel.find({}, function (err, members) {
      resolve(members);
    });
  });

}()).then(function (allMembers) {
  // generate recommendation ratings
  var members = allMembers;
  var ratings = {};
  var recs = {};

  // create a recommendation collection, indexed by member id
  // for each member, we now have an array of their ratings for each provider
  members.forEach(function (m) {
    ratings[m.memberId] = m.stats.ratings;
  });

  // for each member, generate an array of recommendations for each provider
  for (var member in ratings) {
    recs[member] = getRecs(member, ratings);
    // log results to console
    reportRecommendationResults(member, recs, ratings);
  }

  // save recs to member documents
  return new Promise(function (resolve) {
    var promises = [];
    for (var m in recs) {
      promises.push(
        new Promise(function (resolve, reject) {
          MemberModel.update(
            { 'memberId' : m },
            { 'stats.recommendations' : recs[m] },
            function (err, response) {
              if (err) reject(err);
              else resolve(response);
            }
          );
        })
      );
    }
    resolve(promises);
  });

}).then(function () {
  console.dir('done');
  process.exit(0);
});


// Sub Routines

/**
 * For the current member as the receiver, get a rating for each other
 * member as provider, indexed by id
 * @return {Object}
 */

function getRecs (currentMemberId, ratings) {
  var recs = {};
  var rating = 0;
  var rounded = 0;

  // for each member as provider, get the predicted rating for 
  // a the current member as the receiver
  for (var provider in Object.keys(ratings)) {
    // if provider is current member, don't be incestuous
    if (provider === currentMemberId) continue;
    // get the rating, and add the rounded vale to the results
    rating = getRecFor(provider, currentMemberId, ratings);
    rounded = Math.round(rating * 10) / 10;
    recs[provider] = rounded;
  }
  // with id as the key, return a hash of ratings
  return recs;
}

/**
 * Predict a recommended rating for the current member as receiver
 * @return {Float}
 */
function getRecFor (providerId, currentMemberId, ratings) {
  var to = providerId;
  var perVectorRatings = [];
  var from;
  var newRating;

  // generate an array of predicted ratings based on each other member's ratigngs
  for (var id in Object.keys(ratings[currentMemberId])) {
    if (!ratings[currentMemberId][id]) continue;
    else from = id;
    // generate a rating based on this member's rating's similarity (average 
    // offset) to the ratings of the member whom we're providing a recommendation
    newRating = getAvgOffset(ratings, from, to, currentMemberId) + 
      ratings[currentMemberId][from];

    if (isNaN(newRating)) console.log('rating of ' + from + 'undefined');
    else perVectorRatings.push(newRating);
  }
  // average the ratings to produce a single recommendation rating
  return getAvg(perVectorRatings);
}

/**
 * Given a vector (from --> to) get the avg rating offset;
 * 
 * Explanation: we want find a relationship between ratings for one provider
 * and another provider; specifically we want an over/under number, so that we 
 * can say "you've rated X this, so we predict you'll rate Y this offset of X".
 *
 * getAvgOffest calculates this difference for each member who has rated both 
 * X and Y ('from' and 'to'), and returns the average offset.
 *
 * An additional constraint is applied to make the eventual recommendation more 
 * accurate, namely, if a given member's rating deviates by more than a point 
 * from the current memebr, we do not include that offest
 * 
 * @return {Float}
 */
function getAvgOffset (ratings, from, to, currentMemberId) {
  var offsets = [];
  var newOffset = 0;

  for (var member in ratings) {
    // make sure the necessary records exist
    if (!ratings[member][from] || !ratings[member][to] ) 
      continue; 
    // do not rate the member whom the recommendation is for
    if (member === currentMemberId || member === to) 
      continue;    
    // exclude sources whose rating of the current vector 
    // differs significantly from the current member
    if (Math.abs(ratings[member][from] - ratings[currentMemberId][from]) > 1 ) 
      continue;

    newOffset = ratings[member][to] - ratings[member][from];
    offsets.push(newOffset);
  }
  return getAvg(offsets);
}

/**
 * Average the items in the given Array
 */
function getAvg (arr) {
  if (arr.length === 0) return 0;
  var sum = _.reduce(arr, function (sum, num) {
    return sum + num;
  });
  return sum / arr.length;
}

/**
 *  Log results to the console
 */
function reportRecommendationResults (memberId, recs, ratings) {
  console.log('\n............................');
  console.log('Recs vs Freq for ' + memberId);
  for (var key in recs[memberId]) {
    console.log(key + '\t' + recs[memberId][key] + '\t' + ratings[memberId][key]);
  }
}
