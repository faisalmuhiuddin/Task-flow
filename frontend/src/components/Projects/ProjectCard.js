import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  AvatarGroup,
  Tooltip,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Assignment,
  Group,
  CalendarToday,
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';
import toast from 'react-hot-toast';
import EditProjectDialog from './EditProjectDialog';
import DeleteConfirmDialog from '../Common/DeleteConfirmDialog';

const ProjectCard = ({ project, onUpdate, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewProject = () => {
    navigate(`/project/${project._id}`);
  };

  const handleEditProject = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteProject = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/projects/${project._id}`);
      onDelete(project._id);
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Delete project error:', error);
      toast.error('Failed to delete project');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleProjectUpdate = (updatedProject) => {
    onUpdate(updatedProject);
    setEditDialogOpen(false);
    toast.success('Project updated successfully');
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
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const formatDate = (date) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const progress = calculateProgress();
  const isOverdue = project.dueDate && new Date(project.dueDate) < new Date() && project.status !== 'completed';

  return (
    <>
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4,
          },
          border: isOverdue ? '2px solid #f44336' : 'none',
        }}
        onClick={handleViewProject}
      >
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ flex: 1, mr: 1 }}>
              {project.title}
            </Typography>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ mt: -1 }}
            >
              <MoreVert />
            </IconButton>
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '2.5em',
            }}
          >
            {project.description || 'No description provided'}
          </Typography>

          {/* Status and Priority */}
          <Box display="flex" gap={1} mb={2}>
            <Chip
              label={project.status?.replace('-', ' ') || 'Not Started'}
              color={getStatusColor(project.status)}
              size="small"
            />
            <Chip
              label={`${project.priority || 'Medium'} Priority`}
              color={getPriorityColor(project.priority)}
              variant="outlined"
              size="small"
            />
          </Box>

          {/* Progress */}
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'grey.200',
              }}
            />
          </Box>

          {/* Stats */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Assignment sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {project.tasks?.length || 0} tasks
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Group sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {project.members?.length || 0} members
              </Typography>
            </Box>
          </Box>

          {/* Due Date */}
          {project.dueDate && (
            <Box display="flex" alignItems="center" gap={0.5} mb={2}>
              <CalendarToday sx={{ fontSize: 16, color: isOverdue ? 'error.main' : 'text.secondary' }} />
              <Typography 
                variant="caption" 
                color={isOverdue ? 'error.main' : 'text.secondary'}
                fontWeight={isOverdue ? 600 : 400}
              >
                Due: {formatDate(project.dueDate)}
                {isOverdue && ' (Overdue)'}
              </Typography>
            </Box>
          )}

          {/* Team Members */}
          {project.members && project.members.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                Team Members
              </Typography>
              <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
                {project.members.map((member) => (
                  <Tooltip key={member._id} title={member.name}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: '0.75rem',
                        backgroundColor: 'primary.main',
                      }}
                    >
                      {getInitials(member.name)}
                    </Avatar>
                  </Tooltip>
                ))}
              </AvatarGroup>
            </Box>
          )}
        </CardContent>

        {/* Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleViewProject}>
            <Visibility sx={{ mr: 2 }} />
            View Project
          </MenuItem>
          <MenuItem onClick={handleEditProject}>
            <Edit sx={{ mr: 2 }} />
            Edit Project
          </MenuItem>
          <MenuItem onClick={handleDeleteProject} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 2 }} />
            Delete Project
          </MenuItem>
        </Menu>
      </Card>

      {/* Edit Dialog */}
      <EditProjectDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        project={project}
        onProjectUpdated={handleProjectUpdate}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.title}"? This action cannot be undone.`}
        loading={loading}
      />
    </>
  );
};

export default ProjectCard;