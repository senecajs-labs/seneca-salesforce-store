var util = require('util');
var proxyquire = require('proxyquire');
var assert = require('assert');
var _ = require('lodash');

var mockForce = {
  Connection: function(opts) {
    return {
      identity: function(cb) {
            return cb();
      },
      sobject: function(table) {
        return {
          describe: function(cb) {
            return cb(null, {
              fields: []
            });
          },
          create: function(obj, cb) {
            return cb(null, {id: 123, success: true});
          },
          update: function(obj, cb) {
            return cb(null, {id: 123, success: true});
          },
          retrieve: function(id, cb) {
            return cb(null, {Id: 123});
          },
          destroy: function(id, cb) {
            return cb();
          }
        }
      },
      query: function(q, cb) { return cb(); }
    };
  }
};

var mockSeneca = {
  make$: function(a, b) { return {};}
};

exports.test_list = function(done) {
  var sf = proxyquire('../salesforce.js', {jsforce: mockForce})(mockSeneca, {});
  sf.list({}, function(err) {
    assert.ok(!err, err);
    done();
  });
};

exports.test_save = function(done) {
  var sf = proxyquire('../salesforce.js', {jsforce: mockForce})(mockSeneca, {});

  var args = {
    ent: {
      fields$: function() { return [];}
    }
  };
  sf.save(args, function(err) {
    assert.ok(!err, util.inspect(err));

    // now update..
    args.ent.id$ = 'abc';
    sf.save(args, function(err) {
      assert.ok(!err, util.inspect(err));
      done();
    });
  });
};

exports.test_load = function(done) {
  var sf = proxyquire('../salesforce.js', {jsforce: mockForce})(mockSeneca, {});
  sf.load({q: {id: 123}}, function(err) {
    assert.ok(!err, util.inspect(err));
    done();
  });
};

exports.test_remove = function(done) {
  var sf = proxyquire('../salesforce.js', {jsforce: mockForce})(mockSeneca, {});
  sf.remove({q: {id: 123}}, function(err) {
    assert.ok(!err, util.inspect(err));
    done();
  });
};