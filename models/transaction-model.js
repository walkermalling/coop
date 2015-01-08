'use strict';

var mongoose = require('mongoose');

var TransactionSchema = mongoose.Schema({
  childrenWatched: Number,
  duration: Number,
  sittingProviderId: String,
  sittingReceiverId: String,
  startedAt: Date,
  offsetMinutes: Number,
  createdAt: {type:Date, default:Date.now}
});

TransactionSchema.methods.pointValue = function () {
  return this.childrenWatched * this.duration;
};

TransactionSchema.howLongAgo = function () {
  var now = new Date();
  return now - this.startedAt;
};

module.exports = mongoose.model('Transaction', TransactionSchema);