'use strict';

const express = require('express');
const router = express.Router();
const r = require('../services/db');

/* GET users listing. */
router.get('/', (req, res, next) => {
  r.table('users').run(r.conn, (err, cursor) => {
    if (err) {
      console.error(`error listing users: $err`);
      next();
    } else {
      cursor.toArray((err, result) => {
        if (err) {
          console.error(`error accessing user cursor $err`);
        } else {
          res.send(JSON.stringify(result));
        }
      });
    }
  });
});

module.exports = router;
