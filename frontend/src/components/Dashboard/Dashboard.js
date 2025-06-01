import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Chip,
  IconButton,
  Dialog,
  Fab,
} from '@mui/material';
import {
  Add,
  Assignment,
  People,
  Schedule,
  CheckCircle,
  MoreVert,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import CreateProjectDialog from '../Projects/CreateProjectDialog';
import ProjectCard from '../Projects/ProjectCard';
import { useSocket } from '../../contexts/SocketContext';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const navigate = useNavigate();
  const { socket } = useSocket();

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    if (socket) {
      socket.on('projectUpdated', handleProjectUpdate);
      socket.on('projectDeleted', handleProjectDelete);
      socket.on('taskUpdated', loadDashboardData);

      return () => {
        socket.off('projectUpdated', handleProjectUpdate);
        socket.off('projectDeleted', handleProjectDelete);
        socket.off('taskUpdated', loadDashboardData);
      };
    }
  }, [socket]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load projects
      const projectsResponse = await axios.get('/api/projects');
      setProjects(projectsResponse.data.projects || []);

      // Load dashboard stats
      const statsResponse = await axios.get('/api/projects/stats');
      setStats(statsResponse.data.stats || stats);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectUpdate = (updatedProject) => {
    setProjects(prev => 
      prev.map(project => 
        project._id === updatedProject._id ? updatedProject : project
      )
    );
  };

  const handleProjectDelete = (projectId) => {
    setProjects(prev => prev.filter(project => project._id !== projectId));
    loadDashboardData(); // Refresh stats
  };

  const handleCreateProject = () => {
    setCreateDialogOpen(true);
  };

  const handleProjectCreated = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
    setCreateDialogOpen(false);
    loadDashboardData(); // Refresh stats
    toast.success('Project created successfully!');
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

  const calculateProgress = (project) => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateProject}
          size="large"
        >
          New Project
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assignment sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h5" component="div">
                    {stats.totalProjects}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Projects
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircle sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h5" component="div">
                    {stats.completedProjects}
                  </Typography>
                  <Typography color="text.secondary">
                    Completed Projects
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Schedule sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h5" component="div">
                    {stats.totalTasks}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Tasks
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h5" component="div">
                    {stats.completedTasks}
                  </Typography>
                  <Typography color="text.secondary">
                    Completed Tasks
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Projects Section */}
      <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
        Recent Projects
      </Typography>

      {projects.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <Assignment sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No projects yet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Create your first project to get started with TaskFlow
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateProject}
              >
                Create Project
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <ProjectCard 
                project={project} 
                onUpdate={handleProjectUpdate}
                onDelete={handleProjectDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add project"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={handleCreateProject}
      >
        <Add />
      </Fab>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </Container>
  );
};

export default Dashboard;