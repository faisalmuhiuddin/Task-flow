module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join project room
    socket.on('join-project', (projectId) => {
      socket.join(`project-${projectId}`);
      console.log(`Socket ${socket.id} joined project ${projectId}`);
    });

    // Leave project room
    socket.on('leave-project', (projectId) => {
      socket.leave(`project-${projectId}`);
      console.log(`Socket ${socket.id} left project ${projectId}`);
    });

    // Handle task updates
    socket.on('task-updated', (data) => {
      socket.to(`project-${data.projectId}`).emit('task-updated', data);
    });

    // Handle project updates
    socket.on('project-updated', (data) => {
      socket.to(`project-${data.projectId}`).emit('project-updated', data);
    });

    // Handle new task creation
    socket.on('task-created', (data) => {
      socket.to(`project-${data.projectId}`).emit('task-created', data);
    });

    // Handle task deletion
    socket.on('task-deleted', (data) => {
      socket.to(`project-${data.projectId}`).emit('task-deleted', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
