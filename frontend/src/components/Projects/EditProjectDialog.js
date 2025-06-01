import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditProjectDialog = ({ open, onClose, project, onProjectUpdated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not-started',
    priority: 'medium',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        status: project.status || 'not-started',
        priority: project.priority || 'medium',
      });
    }
  }, [project]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/projects/${project._id}`, formData);
      onProjectUpdated(response.data.project);
      onClose();
    } catch (error) {
      toast.error('Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Project</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          multiline
          rows={3}
          margin="normal"
        />
        <TextField
          fullWidth
          select
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
          margin="normal"
        >
          <MenuItem value="not-started">Not Started</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="on-hold">On Hold</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProjectDialog;
