'use strict'
const express = require('express'), router = express.Router();
const bcryptjs = require('bcryptjs');
const { userAuthentication } = require('./auth');
const User = require('../models').User;

function asyncHelper(callback) {
  return async(req, res, next) => {
    try {
      await callback(req,res,next);
    } catch(err) {
      next(err);
    }
  }
}

/* GET /api/users 200 - Get Users */
router.get('/users', userAuthentication, asyncHelper(async (req, res) => {
  const user = await User.findByPk(req.currentUser.id, {attributes: { exclude: ['password', 'createdAt', 'updatedAt']}});
  res.status(200).json(user);
}));

/* POST /api/users 201 - Create Users */
router.post('/users', asyncHelper(async (req, res, next) => {
  const errors = [];
  if (!req.body.firstName) {
    errors.push('Enter a valid first name.');
  }
  if (!req.body.lastName) {
    errors.push('Enter a valid last name.');
  }
  if (!req.body.emailAddress) {
    errors.push('Enter a valid email address.');
  }
  if (!req.body.password) {
    errors.push('Enter a valid password.');
  }
  if (errors.length > 0) {
    res.status(400).json({message: 'An error has occured.', errors: errors});
  } else {
    try {
      const user = await req.body;
      if (user.password) {
        user.password = bcryptjs.hashSync(user.password);
      }
      await User.create(user);
      res.status(201).location('/').end();
    } catch (err) {
      if (err.name === 'SequelizeValidationError') {
        err.status = 400;   
      }
      next(err);
    }
  }
}));

module.exports = router;
