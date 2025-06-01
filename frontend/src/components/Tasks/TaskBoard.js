import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material';

const TaskBoard = ({ tasks, onTaskUpdate, onTaskDelete, projectId }) => {
  const columns = [
    { id: 'todo', title: 'To Do', color: 'default' },
    { id: 'in-progress', title: 'In Progress', color: 'warning' },
    { id: 'completed', title: 'Completed', color: 'success' },
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Task Board</Typography>
      <Grid container spacing={3}>
        {columns.map((column) => (
          <Grid item xs={12} md={4} key={column.id}>
            <Card sx={{ minHeight: 400 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {column.title} ({getTasksByStatus(column.id).length})
                </Typography>
                {getTasksByStatus(column.id).map((task) => (
                  <Card key={task._id} sx={{ mb: 2, p: 2 }}>
                    <Typography variant="subtitle2">{task.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{task.description}</Typography>
                    <Box mt={1}>
                      <Chip label={task.priority} size="small" color={column.color} />
                    </Box>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TaskBoard;
