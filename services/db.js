'use strict';

const config = require('config');
const r = require('rethinkdb');
require('rethinkdb-init')(r);

// create tables
r.init(config.get('rethinkdb'), [
  {
    name: 'users'
  },
  {
    name: 'lists'
  },
  {
    name: 'items'
  }
]).then(function (conn) {
  r.conn = conn;
  r.conn.use(config.get('rethinkdb').db);
});

module.exports = r;