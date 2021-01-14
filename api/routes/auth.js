'use strict'
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const basicauth = require('basic-auth');
const User = require('../models').User;

const userAuthentication = async (req, res, next) => {
  let failed = false;
  const users = await User.findAll();
  const authResult = basicauth(req);
  if (authResult) {
    const user = users.find(u => u.emailAddress === authResult.name);
    if (user) {
      if (bcryptjs.compareSync(authResult.pass, user.password)) {
        req.currentUser = user;
      }
    }
  } else {
    failed = true;
  }
  if (failed) {
    console.warn('Authentication failed');
    res.status(401).json({ msg: 'Authentication failed'});
  } else {
    next();
  }
};

module.exports = { userAuthentication };
