/* Route Prefix: /occupations */
var express = require('express');
var router = express.Router();

// Require database connection
var knex = require('../db/knex');
var util = require('../util');

// GET all occupations
router.get('/', function(req, res, next) {
  knex('occupation').select()
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No occupations found');
      }
    })
    .catch(err => { return next(err) });
});

// Add a single occupation
router.post('/', function(req, res, next) {
  if (!req.body.oid) {
    util.throwError(400, 'Occupation ID cannot be null');
  }
  if (!req.body.name) {
    util.throwError(400, 'Occupation name cannot be null');
  }

  let values = { id: req.body.oid, name: req.body.name };
  knex('occupation').insert(values)
    .then(result => {
      res.send(util.message('Successfully added a single occupation'));
    })
    .catch(err => { return next(err) });
});

// Update a single occupation
router.put('/:oid', function(req, res, next) {
  knex('occupation').update({ name: req.body.name }).where({ id: req.params.oid })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully updated occupation: ' + req.params.oid));
      } else {
        util.throwError(404, 'No occupation found to update');
      }
    })
    .catch(err => { return next(err) });
});

// Delete a single occupation
router.delete('/:oid', function(req, res, next) {
  knex('occupation').del().where({ id: req.params.oid })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully deleted occupation: ' + req.params.oid));
      } else {
        util.throwError(404, 'No occupation found to delete');
      }
    })
    .catch(err => { return next(err) });
});

module.exports = router;
