var debug = require('debug')('seneca-salesforce-store');
var _ = require('lodash');
var jsforce = require('jsforce');

module.exports = function salesforce (seneca, opts) {
  var conn = new jsforce.Connection(opts);

  function _connect (cb) {
    conn.identity(function (err, id) {
      if (err) return conn.login(opts.username, opts.password, cb);
      else return cb();
    });
  };

  // salesforce sql doesn't support 'select *' so instead
  // we build up the select statement from metadata
  function _readTable (table, cb) {
    conn.sobject(table).describe(function (err, meta) {
      if (err) return cb(err);

      var wanted = _.filter(meta.fields, function (f) {
        if (f.createable === true && f.updateable === true) {
          return f.name;
        }
      });

      var names = _.pluck(wanted, 'name');
      var q = 'SELECT ' + names.join(', ') + ' from ' + table;
      conn.query(q, cb);
    });
  };

  // load$ returns a full SF object, containing fields which
  // are not updateable (SF throws an error if you attempt to persist them).
  // This function checks the object fields against the table metadata
  // and remove any fields which are not updateable.
  function _removeUnUpdateableFields (obj, table, cb) {
    conn.sobject(table).describe(function (err, meta) {
      if (err) return cb(err);

      // Note: 'Id' field is not in the table metadata
      var obj2 = {
        'Id': obj['Id']
      };

      _.each(_.keys(obj), function (k) {
        var mf = _.findWhere(meta.fields, {name: k, updateable: true});
        if (mf) obj2[k] = obj[k];
      });

      return cb(null, obj2);
    });
  };

  function list (args, cb) {
    debug('list', args);
    _connect(function (err) {
      if (err) return cb(err);
      return _readTable(args.name, cb);
    });
  };

  // TODO - is there a way of doing this in seneca already?
  function unwrapEnt (ent) {
    var obj = {};
    _.each(ent.fields$(), function (f) {
      obj[f] = ent[f];
    });
    return obj;
  };

  function save (args, cb) {
    debug('save', args);
    var ent = args.ent;
    var obj = unwrapEnt(ent);

    // TODO - again, is there a more seneca way of doing this?
    if (ent.id$ && !obj.Id) obj.Id = ent.id$;

    _connect(function (err) {
      if (err) return cb(err);

      var name = ent.name ? ent.name : args.name;
      var isUpdate = ent.id$ ? true : false;

      if (isUpdate === true) {
        _removeUnUpdateableFields(obj, name, function (err, obj) {
          if (err) return cb(err);
          conn.sobject(name).update(obj, function (err, res) {
            if (err || !res.success) return cb(err || res);
            return cb(null, ent);
          });
        });
      } else {
        conn.sobject(name).update(obj, function (err, res) {
          if (err || !res.success) return cb(err || res);
          ent.id$ = res.id;
          return cb(null, ent);
        });
      }
    });
  };

  function load (args, cb) {
    debug('load', args, args.q, args.q.id);
    if (!args.q || !args.q.id) return cb('"id" field required');

    _connect(function (err) {
      if (err) return cb(err);
      conn.sobject(args.name).retrieve(args.q.id, function (err, obj) {
        if (err) return cb(err);

        debug('loaded entity: ', obj.Id);
        var ent = seneca.make$(args.name, obj);
        ent.id$ = obj.Id;
        return cb(null, ent);
      });
    });
  };

  return {
    list: list,
    save: save,
    load: load
  };
};
