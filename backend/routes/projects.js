const express = require('express');
const { check } = require('express-validator');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

const router = express.Router();

router
  .route('/')
  .get(getProjects)
  .post([
    check('name', 'Project name is required').not().isEmpty(),
    check('description', 'Project description is required').not().isEmpty(),
    check('dueDate', 'Due date is required').not().isEmpty()
  ], createProject);

router
  .route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;