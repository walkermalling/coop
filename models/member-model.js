'use strict';

var mongoose = require('mongoose');

var MemberSchema = mongoose.Schema({
  memberId: String,
  name: {type:String, default: 'M.'},
  stats: {
    points: {type:Number, default:5},
    providerInstances: {type:Number, default:0},
    receiverInstances: {type:Number, default:0},
    ratings: {type:mongoose.Schema.Types.Mixed, default:''},
    recommendations: {type:mongoose.Schema.Types.Mixed, default:''}
  },
  updatedAt: {type:Date, default:Date.now},
  createdAt: {type:Date, default:Date.now}
});

MemberSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Member', MemberSchema);