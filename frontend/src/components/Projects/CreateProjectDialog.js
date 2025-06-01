import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  Autocomplete,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateProjectDialog = ({ open, onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not-started',
    priority: 'medium',
    dueDate: null,
    members: [],
  });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: 'not-started', label: 'Not Started' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'on-hold', label: 'On Hold' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  useEffect(() => {
    if (open) {
      loadUsers();
      resetForm();
    }
  }, [open]);

  const loadUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load team members');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'not-started',
      priority: 'medium',
      dueDate: null,
      members: [],
    });
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Project title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Project description must be at least 10 characters';
    }

    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const projectData = {
        ...formData,
        members: formData.members.map(member => member._id),
      };

      const response = await axios.post('/api/projects', projectData);
      onProjectCreated(response.data.project);
      handleClose();
      toast.success('Project created successfully!');
    } catch (error) {
      console.error('Create project error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create project';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            Create New Project
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            {/* Project Title */}
            <TextField
              fullWidth
              label="Project Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              placeholder="Enter project title"
              required
            />

            {/* Project Description */}
            <TextField
              fullWidth
              label="Project Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="Describe your project"
              multiline
              rows={3}
              required
            />

            {/* Status and Priority */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Due Date */}
            <DatePicker
              label="Due Date"
              value={formData.dueDate}
              onChange={(date) => handleInputChange('dueDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.dueDate}
                  helperText={errors.dueDate}
                />
              )}
              minDate={new Date()}
            />

            {/* Team Members */}
            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option) => option.name}
              value={formData.members}
              onChange={(event, newValue) => handleInputChange('members', newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.name}
                    {...getTagProps({ index })}
                    key={option._id}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Team Members"
                  placeholder="Select team members"
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body2">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.email} • {option.role}
                    </Typography>
                  </Box>
                </Box>
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleClose}
            disabled={loading}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default CreateProjectDialog;