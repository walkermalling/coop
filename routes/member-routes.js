'use strict';

var MemberModel = require('../models/member-model');

module.exports = function(app) {

  /**
   * Get All Members
   */
  
  app.get('/members', function (req,res){
    MemberModel.find({}, function (err, members) {
      if (err) return res.status(500).json(err);
      else res.status(200).send(members);
    });
  });

  /**
   * Get One Member by ID
   */
  app.get('/members/:id', function (req,res){
    MemberModel.findOne({'_id' : req.params.id}, function (err, member) {
      if (err) return res.status(500).json(err);
      else res.status(200).send(member);
    });
  });

};
