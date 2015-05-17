var assert = require('assert');
var seneca = require('seneca')();
var async = require('async');

exports.setUp = function (done) {
  seneca.use('..', {
    loginUrl: process.env.url,
    username: process.env.username,
    password: process.env.password
  });

  seneca.ready(done);
};


exports.it_should_list_all_leads = function (done) {
  var lead = seneca.make$('Lead');
  lead.list$(done);
};


exports.it_should_CRUD_lead = function (done) {
  var UPDATED_COMPANY = 'Test Company updated company name!';
  var UPDATED_LASTNAME = 'test Name updated last name';

  function createLead (cb) {
    var lead = seneca.make$('Lead');
    lead.Company = 'Test Company';
    lead.LastName = 'Test Name';
    lead.save$(function (err, data) {
      if (err) return cb(err);
      console.log('data', data);
      return cb(null, data.id$);
    });
  }

  function loadAndUpdateLead (id, cb) {
    seneca.make$('Lead').load$(id, function (err, entity) {
      assert.ok(!err, err);
      console.log('entity', entity);
      assert.equal(entity.id$, id, 'Entity id not ok: ', entity.$id, entity.CompanyName, entity.LastName);
      entity.Company = UPDATED_COMPANY;
      entity.LastName = UPDATED_LASTNAME;
      entity.save$(function (err) {
        if (err) return cb(err);
        return cb(null, id);
      });
    });
  }

  function findLead(id, cb) {
    var lead = seneca.make$('Lead');
    lead.list$({Company: UPDATED_COMPANY, LastName: UPDATED_LASTNAME}, function(err, data) {
      assert.ok(!err, err);
      assert.equal(data.totalSize, 1, 'Expected 1 recored returned, got: ' + data.totalSize);
      cb(null, id);
    });
  };

  function removeLead (id, cb) {
    seneca.make$('Lead').remove$(id, cb);
  }

  async.waterfall([
    createLead,
    loadAndUpdateLead,
    findLead,
    removeLead
  ], function (err) {
       assert.ok(!err);
       done();
     });
};