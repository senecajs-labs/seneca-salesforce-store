var assert = require('assert');
var seneca = require('seneca')();

exports.setUp = function (done) {
  seneca.use('..', {
    loginUrl : 'https://test.salesforce.com',
    username: process.env.username,
    password: process.env.password
  });

  seneca.ready(done);
}
/*
exports.it_should_list_leads = function(done) {
  var lead = seneca.make$('Lead');
  lead.list$({}, function(err, data) {
    assert.ok(!err, err);
    console.log("data", data);
    done();
  });
}
*/
/*
exports.it_should_create_lead = function(done) {
  var lead = seneca.make$('Lead');
  lead.Company = 'DB Test Dojo';
  lead.LastName = 'DB Test Champion';

  lead.save$(function(err, entity) {
    assert.ok(!err, err);
    console.log("data", entity);
    done();
  });
}
*/

exports.it_should_load_lead = function(done) {
  var id = '00Q11000005bKHvEAM';
  seneca.make$('Lead').load$(id, function (err, entity) {
    assert.ok(!err, err);
    console.log("data", entity.id$);
    assert.equal(entity.id$, id, 'Entity id not ok: ', entity.$id, entity.CompanyName, entity.LastName);

    entity.Company = 'DB updated company name!';
    entity.LastName = 'DB Updated last name';
    entity.save$(function(err, entity) {
      assert.ok(!err, err, 'Unexpected error: ' + err);
      done();
    });
  });
}
