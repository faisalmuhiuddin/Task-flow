import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateTaskDialog = ({ open, onClose, onTaskCreated, projectId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/tasks', {
        ...formData,
        project: projectId,
      });
      onTaskCreated(response.data.task);
      setFormData({ title: '', description: '', status: 'todo', priority: 'medium' });
      onClose();
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Task</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Task Title"
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
          label="Priority"
          value={formData.priority}
          onChange={(e) => setFormData({...formData, priority: e.target.value})}
          margin="normal"
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Creating...' : 'Create Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTaskDialog;
