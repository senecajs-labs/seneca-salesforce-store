var assert = require('assert');

exports.it_should_work = function(done) {
  var seneca = require('seneca')()
  seneca.use('..', {
    loginUrl : 'https://test.salesforce.com',
    username: process.env.username,
    password: process.env.password
  });


  seneca.ready(function(){
    var leads = seneca.make$('Leads');
    leads.list$({}, function(err, data) {
      assert.ok(!err, err);
      console.log("data", data);
      done();
    });
  });
}