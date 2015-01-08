'use strict';

/**
 *  Generate Recommendations based on Current Ratings
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

  members.forEach(function (m) {
    ratings[m.memberId] = m.stats.ratings;
  });

  for (var member in ratings) {
    console.log('\n............................');

    recs[member] = getRecs(member, ratings);

    console.log('Recs vs Freq for ' + member);
    for (var key in recs[member]) {
      console.log(key + '\t' + recs[member][key] + '\t' + ratings[member][key]);
    }
  }

  // save recs to member documents
  return new Promise(function (resolve) {
    var promises = [];

    for (var m in recs) {
      promises.push(
        new Promise(function (resolve, reject) {
          console.dir('updating model for ' + m);
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


// Routines

/**
 * Get a hash of predicted ratings for the current member
 * @return {Object}
 */

function getRecs (currentMemberId, ratings) {
  var recs = {};
  var rating = 0;
  var rounded = 0;

  for (var provider in Object.keys(ratings)) {
    if (provider === currentMemberId) continue;

    rating = getRecFor(provider, currentMemberId, ratings);
    rounded = Math.round(rating * 10) / 10;
    recs[provider] = rounded;
  }

  return recs;
}

/**
 * For each possible vector, predict current member's rating
 * and return the avg
 * @return {Float}
 */
function getRecFor (providerId, currentMemberId, ratings) {
  var to = providerId;
  var perVectorRatings = [];
  var from;
  var newRating;

  for (var key in Object.keys(ratings[currentMemberId])) {
    if (!ratings[currentMemberId][key]) continue;
    from = key;

    newRating = getAvgOffset(ratings, from, to, currentMemberId) + 
      ratings[currentMemberId][from];

    if (isNaN(newRating)) console.log('rating of ' + from + 'undefined');
    else perVectorRatings.push(newRating);
  }

  return getAvg(perVectorRatings);
}

/**
 * Given a vector (from --> to) get the avg rating offset
 * across all members
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
