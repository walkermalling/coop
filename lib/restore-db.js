'use strict';

/**
 *  Restore Coop Database
 */

var appRoot = require('app-root-path');
var mongoose = require('mongoose');
var migrateTransactions = require(appRoot + '/lib/db/migrate-transactions')();
var migrateMembers = require(appRoot + '/lib/db/migrate-members')();

mongoose.connect('mongodb://localhost/coop-db');

migrateTransactions.migrate()
.then(function (){
  return migrateMembers.populate();
}).then(function (){
  return migrateMembers.infer();
}).then(function () {
  console.log('done');
  process.exit(0);
});

