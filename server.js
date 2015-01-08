'use strict';

// require

var http = require('http');
var express = require('express');
var mongoose = require('mongoose');

// initialize app

var app = express();
app.use(express.static(__dirname + '/build'));

// connect to database

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/coop-db');

// configure server

var server = http.createServer(app);
app.set('port', process.env.PORT || 3000);
exports.port = app.get('port');

// configure routes

require('./routes/transaction-routes')(app);
require('./routes/member-routes')(app);

// start server

server.listen(app.get('port'), function () {
  console.log('Sever started on ' + app.get('port'));
});