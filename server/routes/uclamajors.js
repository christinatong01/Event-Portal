/* Route Prefix: /uclamajors */
var express = require('express');
var router = express.Router();

// Require database connection
var knex = require('../db/knex');
var util = require('../util');

// GET all UCLA majors
router.get('/', function(req, res, next) {
  knex('ucla_major').select()
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        res.status(404).json('No UCLA majors found');
      }
    })
    .catch(err => { return next(err) });
});

// Add a single UCLA major. Can add duplicates due to unstrict checks.
router.post('/', function(req, res, next) {
  if (!req.body.major) {
    util.throwError(400, 'UCLA major name must not be null');
  }

  values = { 
    code: req.body.code,
    major: req.body.major,
    abbreviation: req.body.abbreviation,
    department: req.body.department,
    department_abbreviation: req.body.department_abbreviation,
    school: req.body.school,
    division: req.body.division
  };
  knex('ucla_major').insert(values)
    .then(result => {
      res.send(util.message('Successfully inserted new UCLA major: ' + req.body.major));
    })
    .catch(err => { return next(err) });
});

// Update a single UCLA major
router.put('/:major_id', function(req, res, next) {
  values = { 
    code: req.body.code,
    major: req.body.major,
    abbreviation: req.body.abbreviation,
    department: req.body.department,
    department_abbreviation: req.body.department_abbreviation,
    school: req.body.school,
    division: req.body.division
  };
  knex('ucla_major').update(values).where({ id: req.params.major_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully updated UCLA major: ' + req.params.major_id));
      } else {
        util.throwError(404, 'No UCLA major found to update');
      }
    })
    .catch(err => { return next(err) });
});

// Delete a single UCLA major
router.delete('/:major_id', function(req, res, next) {
  knex('ucla_major').del().where({ id: req.params.major_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully deleted UCLA major: ' + req.params.major_id));
      } else {
        util.throwError(404, 'No UCLA major found to delete');
      }
    })
    .catch(err => { return next(err) });
});

module.exports = router;
