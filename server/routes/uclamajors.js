/* Route Prefix: /uclamajors */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
const db = require('../db')

// Require database connection
var knex = require('../db/knex');

// GET all UCLA majors
router.get('/', function(req, res, next) {
  knex('ucla_major').select()
    .then(result => {
      if (result.length) {
        res.json(result)
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => { return next(err) })
});

// TODO: Add a single UCLA major
router.get('/uclamajors', function(req, res, next) {
  db.query('', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// INSERT INTO ucla_major (code, major, abbreviation, department, department_abbreviation, school, division) 
// VALUES (<code>, <major>, <abbreviation>, <department>, <department_abbreviation>, <school>, <division>)

// TODO: Update a single UCLA major
router.get('/uclamajors/:major_id', function(req, res, next) {
  db.query('', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// UPDATE ucla_major
// SET code = <code>,
// major = <major>,
// …
// division = <division>
// WHERE id = <major_id>

// TODO: Delete a single UCLA major
router.get('/uclamajors/:major_id', function(req, res, next) {
  db.query('', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// DELETE FROM ucla_major
// WHERE id = <major_id>

module.exports = router;
