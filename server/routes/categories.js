/* Route Prefix: /categories */
var express = require('express');
var router = express.Router();

// Require database connection
var knex = require('../db/knex');
var util = require('../util');

// GET all categories
router.get('/', function(req, res, next) {
  knex('category').select()
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No categories found');
      }
    })
    .catch(err => { return next(err) });
});

// Add a single category
router.post('/', function(req, res, next) {
  if (!req.body.name) {
    util.throwError(400, 'Category name must not be null');
  }
  
  values = { name: req.body.name };
  knex('category').insert(values)
    .then(result => {
      res.send(util.message('Successfully inserted new category: ' + req.body.name));
    })
    .catch(err => { return next(err) });
});

// Update a single category
router.put('/:category_id', function(req, res, next) {
  values = { name: req.body.name };
  knex('category').update(values).where({ id: req.params.category_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully updated category: ' + req.params.category_id));
      } else {
        util.throwError(404, 'No category found to update');
      }
    })
    .catch(err => { return next(err) });
});

// Delete a single major
router.delete('/:category_id', function(req, res, next) {
  knex('category').del().where({ id: req.params.category_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully deleted category: ' + req.params.category_id));
      } else {
        util.throwError(404, 'No category found to delete');
      }
    })
    .catch(err => { return next(err) });
});

module.exports = router;
