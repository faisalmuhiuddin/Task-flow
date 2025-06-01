import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  IconButton,
  Fab,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Add,
  Assignment,
  Group,
  CalendarToday,
} from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import TaskBoard from '../Tasks/TaskBoard';
import CreateTaskDialog from '../Tasks/CreateTaskDialog';
import EditProjectDialog from './EditProjectDialog';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);

  useEffect(() => {
    loadProject();
    loadTasks();
  }, [id]);

  const loadProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`);
      setProject(response.data.project);
    } catch (error) {
      console.error('Failed to load project:', error);
      toast.error('Failed to load project');
      navigate('/dashboard');
    }
  };

  const loadTasks = async () => {
    try {
      const response = await axios.get(`/api/tasks?project=${id}`);
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [...prev, newTask]);
    setCreateTaskDialogOpen(false);
    toast.success('Task created successfully!');
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => 
      prev.map(task => 
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(task => task._id !== taskId));
  };

  const handleProjectUpdated = (updatedProject) => {
    setProject(updatedProject);
    setEditProjectDialogOpen(false);
    toast.success('Project updated successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'on-hold':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (!project) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h6">Project not found</Typography>
      </Container>
    );
  }

  const progress = calculateProgress();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {project.title}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Edit />}
          onClick={() => setEditProjectDialogOpen(true)}
          sx={{ mr: 2 }}
        >
          Edit Project
        </Button>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateTaskDialogOpen(true)}
        >
          Add Task
        </Button>
      </Box>

      {/* Project Info Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Description
              </Typography>
              <Typography variant="body1" paragraph>
                {project.description || 'No description provided'}
              </Typography>
              
              <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
                <Chip
                  label={project.status?.replace('-', ' ') || 'Not Started'}
                  color={getStatusColor(project.status)}
                />
                <Chip
                  label={`${project.priority || 'Medium'} Priority`}
                  color={getPriorityColor(project.priority)}
                  variant="outlined"
                />
              </Box>

              {project.dueDate && (
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Due: {format(new Date(project.dueDate), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
              )}

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Overall Progress: {progress}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Stats
              </Typography>
              
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Assignment sx={{ fontSize: 20, color: 'primary.main' }} />
                  <Typography variant="body2">Total Tasks</Typography>
                </Box>
                <Typography variant="h6">{tasks.length}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Assignment sx={{ fontSize: 20, color: 'success.main' }} />
                  <Typography variant="body2">Completed</Typography>
                </Box>
                <Typography variant="h6">
                  {tasks.filter(task => task.status === 'completed').length}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Group sx={{ fontSize: 20, color: 'info.main' }} />
                  <Typography variant="body2">Team Members</Typography>
                </Box>
                <Typography variant="h6">{project.members?.length || 0}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Task Board */}
      <TaskBoard
        tasks={tasks}
        onTaskUpdate={handleTaskUpdated}
        onTaskDelete={handleTaskDeleted}
        projectId={id}
      />

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add task"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setCreateTaskDialogOpen(true)}
      >
        <Add />
      </Fab>

      {/* Dialogs */}
      <CreateTaskDialog
        open={createTaskDialogOpen}
        onClose={() => setCreateTaskDialogOpen(false)}
        onTaskCreated={handleTaskCreated}
        projectId={id}
      />

      <EditProjectDialog
        open={editProjectDialogOpen}
        onClose={() => setEditProjectDialogOpen(false)}
        project={project}
        onProjectUpdated={handleProjectUpdated}
      />
    </Container>
  );
};

export default ProjectDetail;