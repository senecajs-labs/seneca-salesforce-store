var debug = require('debug')('seneca-salesforce-store');
var name = 'salesforce-store';

module.exports = function (opts) {
  debug(opts);
  var seneca = this;
  var salesforce = require('./salesforce.js')(this, opts);
  var store = {
    name: name,
    list: salesforce.list,
    save: salesforce.save,
    load: salesforce.load,
    remove: salesforce.remove,
    close: function (args, cb) {
      return cb();
    },
    native: function (args, cb) {
      debug('native', args);
      return cb();
    }
  };

  var storedesc = seneca.store.init(seneca, opts, store);
  var tag = storedesc.tag;

  seneca.add({ init: store.name, tag: tag }, function (args, done) {
    done();
  });

  return {
    name: store.name,
    tag: tag
  };
};
