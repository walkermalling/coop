// 'use strict';

// var appRoot = require('app-root-path');
// var mongoose = require('mongoose');

// var Promise = require('bluebird');
// var _ = require('lodash');
// var TransactionModel = require(appRoot + '/models/transaction-model');
// var MemberModel = require(appRoot + '/models/member-model');


// module.exports = function (){
//   return {
//     infer: function () {

//       console.dir('infering ratings from provider frequency ...');

//       return new Promise(function (resolve, reject) {

//         console.dir('promising');

//         MemberModel.find({}, function (err, members) {
//           if (err) reject(err);

//           var promises = [];

//           members.forEach(function (member) {
//             var newPromise = new Promise(function (resolve, reject) {
//               TransactionModel.find(
//                 {
//                   'sittingReceiverId' : member.memberId
//                 },
//                 function (err, trxs) {
//                   if (err) reject(err);
//                   console.dir('calculating ratings for ' + member.membderId);
//                   var ratings = calculateRatings(trxs);
//                   member.update(
//                     {
//                       "stats.providerRatings" : ratings 
//                     }, 
//                     null,
//                     function (err, response) {
//                       if (err) reject(err);
//                       resolve(response);
//                     }
//                   );
//                 }
//               );

//             promises.push(newPromise);

//             });

//           });

//           resolve(promises);
         
//         });

//       });
//     }
//   }
// };

// function calculateRatings (trxs) {

//   // get an array of frequency counts per provider

//   var providerCounts = _.countBy(trxs, function (trx) {
//     return trx.sittingProviderId;
//   });

//   // calculate percent frequency for each provider 

//   var providerFrequencies = {};
//   for (var key in providerCounts) {
//     providerFrequencies[key] = Math.round( providerCounts[key] / trxs.length * 1000 ) / 10;
//   }

//   // calculate 5 star rating with the max frequency as 5 stars

//   var providerRatings = {};
//   var maxFreq = _.max(providerFrequencies);
//   for (var key in providerFrequencies) {
//     providerRatings[key] = Math.round( providerFrequencies[key] / maxFreq * 50 ) / 10;
//   }

//   return providerRatings;
// }