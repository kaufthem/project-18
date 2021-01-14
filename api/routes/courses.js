'use strict'
const express = require('express'), router = express.Router();
const {Course, User} = require('../models');
const { userAuthentication } = require('./auth');

function asyncHelper(callback) {
  return async(req, res, next) => {
    try {
      await callback(req,res,next);
    } catch(err) {
      res.send(err);
    }
  }
}

/* GET /api/courses 200 - Get Courses */
router.get('/courses', asyncHelper(async (req, res) => {
  const courses = await Course.findAll({attributes: {exclude: ['createdAt', 'updatedAt']}, include: User});
  res.status(200).json(courses);
}));

/* GET /api/courses/:id 200 - Get Course */
router.get('/courses/:id', asyncHelper(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {attributes: {exclude: ['createdAt', 'updatedAt']}, include: User});
  res.status(200).json(course);
}));

/* POST /api/courses 201 - Create Course */
router.post('/courses', userAuthentication, asyncHelper(async (req, res, next) => {
  let course;
  const errors = [];
  if (!req.body.title) {
    errors.push('Enter a valid title.');
  }
  if (!req.body.description) {
    errors.push('Enter a vaild description.');
  }
  if (errors.length > 0) {
    res.status(400).json({message: 'An error has occured.', errors: errors});
  } else {
    try {
      course = await Course.create(req.body);
      res.status(201).location(`/courses/${course.id}`).end();
    } catch (err) {
      next(err);
    }
  }
}));

/* PUT /api/courses/:id 204 - Update Course */
router.put('/courses/:id', userAuthentication, asyncHelper( async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  const errors = [];
  if (course.userId === req.currentUser.id) {
    if (!req.body.title) {
      errors.push('Enter a valid title.');
    }
    if (!req.body.description) {
      errors.push('Enter a vaild description.');
    }
    if (errors.length > 0) {
      res.status(400).json({message: 'An error has occured.', errors: errors});
    } else {
      try {
        await Course.update(req.body, {where: {id: req.params.id}});
        res.status(204).end();
      } catch (err) {
        next(err);
      }
    }
  } else {
    res.status(403).json({
      message: 'An error has occured.',
      error: 'You do not have permission to update this course.'});
  }
}));

/* DELETE /api/courses/:id 204 - Delete Course */
router.delete('/courses/:id', userAuthentication, asyncHelper(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (course.userId === req.currentUser.id) {
    await Course.destroy({
      where: {
        id: req.params.id
      }
    });
    res.status(204).end();
  } else {
    res.status(403).json({message: 'You do not have permission to delete this course.'});
  }
}));

module.exports = router;