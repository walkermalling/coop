'use strict';

var mongoose = require('mongoose');

var MemberSchema = mongoose.Schema({
  memberId: Number,
  stats: {
    points: {type:Number, default:5},
    providerInstances: {type:Number, default:0},
    receiverInstances: {type:Number, default:0}
  },
  updatedAt: {type:Date, default:Date.now},
  createdAt: {type:Date, default:Date.now}
});

MemberSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Member', MemberSchema);