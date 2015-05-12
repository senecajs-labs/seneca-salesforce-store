var util = require('util');
var debug = require('debug')('seneca-salesforce-store');
var name = 'salesforce-store';

module.exports = function (opts) {
  debug(opts);

  var seneca = this;
  var store = {
    name: name,
    list: function (args, cb) {
      debug('list', args);
      return cb(null, [1, 2]);
    },
    save: function (args, cb) {
      debug('save', args);
      return cb();
    },
    load: function (args, cb) {
      debug('load', args);
      return cb();
    },
    remove: function (args, cb) {
      debug('remove', args);
      return cb();
    },
    close: function (args, cb) {
      return cb();
    },
    native: function (args, cb) {
      debug('native', args);
      return cb();
    }
  };

  var storedesc = seneca.store.init(seneca, opts, store);
  debug('storedesc: ' + util.inspect(storedesc));
  var tag = storedesc.tag;

  seneca.add({ init: store.name, tag: tag }, function (args, done) {
    debug('in init! args: ', args);
    done();
  });

  return {
    name: store.name,
    tag: tag
  };
};
