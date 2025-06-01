const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// @desc    Get all tasks for a project
// @route   GET /api/tasks?project=:projectId
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const { project } = req.query;

    if (project) {
      // Verify user has access to the project
      const projectDoc = await Project.findById(project);
      if (!projectDoc) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      if (projectDoc.owner.toString() !== req.user.id && 
          !projectDoc.members.includes(req.user.id)) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to access this project'
        });
      }
    }

    const filter = project ? { project } : {};
    
    const tasks = await Task.find(filter)
      .populate('project', 'name')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project._id);
    if (project.owner.toString() !== req.user.id && 
        !project.members.includes(req.user.id)) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this task'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status, priority, project, assignedTo, dueDate } = req.body;

    // Verify project exists and user has access
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (projectDoc.owner.toString() !== req.user.id && 
        !projectDoc.members.includes(req.user.id)) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to create tasks in this project'
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      project,
      assignedTo,
      dueDate,
      createdBy: req.user.id
    });

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    res.status(201).json({
      success: true,
      data: populatedTask
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project);
    if (project.owner.toString() !== req.user.id && 
        !project.members.includes(req.user.id)) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('project', 'name')
     .populate('assignedTo', 'name email avatar')
     .populate('createdBy', 'name email avatar');

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project);
    if (project.owner.toString() !== req.user.id && 
        !project.members.includes(req.user.id)) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    await task.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
