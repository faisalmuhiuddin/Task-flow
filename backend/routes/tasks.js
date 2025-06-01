const express = require('express');
const { check } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const router = express.Router();

router
  .route('/')
  .get(getTasks)
  .post([
    check('title', 'Task title is required').not().isEmpty(),
    check('project', 'Project ID is required').not().isEmpty()
  ], createTask);

router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;