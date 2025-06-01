// TaskFlow Application JavaScript

class TaskFlowApp {
    constructor() {
        this.currentUser = null;
        this.currentProject = null;
        this.authToken = null;
        this.data = {
            users: [
                {
                    id: "1",
                    name: "John Doe",
                    email: "john@taskflow.com",
                    avatar: "https://i.pravatar.cc/150?img=1",
                    role: "Product Manager",
                    online: true
                },
                {
                    id: "2", 
                    name: "Sarah Smith",
                    email: "sarah@taskflow.com",
                    avatar: "https://i.pravatar.cc/150?img=2",
                    role: "Developer",
                    online: true
                },
                {
                    id: "3",
                    name: "Mike Johnson", 
                    email: "mike@taskflow.com",
                    avatar: "https://i.pravatar.cc/150?img=3",
                    role: "Designer",
                    online: false
                },
                {
                    id: "4",
                    name: "Emily Davis",
                    email: "emily@taskflow.com", 
                    avatar: "https://i.pravatar.cc/150?img=4",
                    role: "QA Engineer",
                    online: true
                }
            ],
            projects: [
                {
                    id: "1",
                    name: "TaskFlow Mobile App",
                    description: "Develop mobile version of TaskFlow for iOS and Android",
                    status: "active",
                    createdAt: "2024-03-01",
                    teamMembers: ["1", "2", "3"],
                    progress: 65
                },
                {
                    id: "2", 
                    name: "Website Redesign",
                    description: "Complete redesign of company website with new branding",
                    status: "active",
                    createdAt: "2024-02-15",
                    teamMembers: ["1", "3", "4"],
                    progress: 40
                },
                {
                    id: "3",
                    name: "API Documentation",
                    description: "Create comprehensive API documentation for developers",
                    status: "completed",
                    createdAt: "2024-01-10", 
                    teamMembers: ["2", "4"],
                    progress: 100
                }
            ],
            tasks: [
                {
                    id: "1",
                    title: "Design login screen mockups",
                    description: "Create high-fidelity mockups for mobile login screen with new branding guidelines",
                    projectId: "1",
                    assignee: "3",
                    status: "todo",
                    priority: "high",
                    dueDate: "2024-06-10",
                    createdAt: "2024-06-01"
                },
                {
                    id: "2",
                    title: "Implement user authentication API",
                    description: "Build JWT-based authentication system with refresh tokens",
                    projectId: "1", 
                    assignee: "2",
                    status: "inprogress",
                    priority: "high",
                    dueDate: "2024-06-08",
                    createdAt: "2024-05-28"
                },
                {
                    id: "3",
                    title: "Set up CI/CD pipeline",
                    description: "Configure automated testing and deployment pipeline for mobile app",
                    projectId: "1",
                    assignee: "2", 
                    status: "done",
                    priority: "medium",
                    dueDate: "2024-06-05",
                    createdAt: "2024-05-25"
                },
                {
                    id: "4",
                    title: "Create homepage wireframes",
                    description: "Design wireframes for new homepage layout with improved UX flow",
                    projectId: "2",
                    assignee: "3",
                    status: "inprogress",
                    priority: "medium", 
                    dueDate: "2024-06-12",
                    createdAt: "2024-06-02"
                },
                {
                    id: "5",
                    title: "Test mobile responsiveness",
                    description: "Ensure website works properly on all mobile devices and screen sizes",
                    projectId: "2",
                    assignee: "4",
                    status: "todo",
                    priority: "low",
                    dueDate: "2024-06-15",
                    createdAt: "2024-06-03"
                },
                {
                    id: "6",
                    title: "Write API endpoint documentation", 
                    description: "Document all REST API endpoints with examples and response schemas",
                    projectId: "3",
                    assignee: "2",
                    status: "done",
                    priority: "high",
                    dueDate: "2024-05-30",
                    createdAt: "2024-05-20"
                }
            ]
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showLoginScreen();
    }

    setupEventListeners() {
        // Auth tabs
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchAuthTab(tab);
            });
        });

        // Auth forms
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const view = e.target.closest('.nav-link').dataset.view;
                if (view) this.showView(view);
            });
        });

        // Sidebar toggle
        document.querySelector('.menu-button').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });

        // User menu
        document.getElementById('userAvatar').addEventListener('click', () => {
            document.querySelector('.user-menu').classList.toggle('active');
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Project creation
        document.getElementById('createProjectBtn').addEventListener('click', () => {
            this.showProjectModal();
        });

        document.getElementById('projectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createProject(e);
        });

        // Task creation
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-task-btn')) {
                const status = e.target.closest('.add-task-btn').dataset.status;
                this.showTaskModal(null, status);
            }
        });

        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTask(e);
        });

        document.getElementById('deleteTaskBtn').addEventListener('click', () => {
            this.deleteCurrentTask();
        });

        // Modal handling
        document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) this.hideModal(modal.id);
            });
        });

        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) this.hideModal(modal.id);
            });
        });

        // Breadcrumb navigation
        document.querySelector('.breadcrumb-link').addEventListener('click', () => {
            this.showView('dashboard');
        });

        // Project selector
        document.getElementById('projectSelect').addEventListener('change', (e) => {
            if (e.target.value) {
                this.viewProject(e.target.value);
            } else {
                this.showView('dashboard');
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                document.querySelector('.user-menu').classList.remove('active');
            }
        });
    }

    switchAuthTab(tab) {
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}Form`).classList.add('active');
    }

    async handleLogin(e) {
        const btn = e.target.querySelector('button[type="submit"]');
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        this.setButtonLoading(btn, true);

        try {
            // Simulate API call
            await this.delay(1000);
            
            // Find user by email (in real app, this would be server-side)
            const user = this.data.users.find(u => u.email === email);
            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Simulate JWT token
            this.authToken = `jwt_token_${Date.now()}_${user.id}`;
            this.currentUser = user;
            
            this.showToast('Welcome back! Logging you in...', 'success');
            await this.delay(500);
            this.showMainApp();
        } catch (error) {
            this.showToast(error.message || 'Login failed', 'error');
        } finally {
            this.setButtonLoading(btn, false);
        }
    }

    async handleRegister(e) {
        const btn = e.target.querySelector('button[type="submit"]');
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const role = document.getElementById('registerRole').value;

        this.setButtonLoading(btn, true);

        try {
            await this.delay(1000);
            
            // Check if email already exists
            if (this.data.users.find(u => u.email === email)) {
                throw new Error('Email already exists');
            }

            // Create new user
            const newUser = {
                id: String(this.data.users.length + 1),
                name,
                email,
                role,
                avatar: `https://i.pravatar.cc/150?img=${this.data.users.length + 1}`,
                online: true
            };

            this.data.users.push(newUser);
            this.authToken = `jwt_token_${Date.now()}_${newUser.id}`;
            this.currentUser = newUser;
            
            this.showToast('Account created successfully! Welcome to TaskFlow!', 'success');
            await this.delay(500);
            this.showMainApp();
        } catch (error) {
            this.showToast(error.message || 'Registration failed', 'error');
        } finally {
            this.setButtonLoading(btn, false);
        }
    }

    showLoginScreen() {
        document.getElementById('loginScreen').classList.add('active');
        document.getElementById('mainApp').classList.remove('active');
    }

    showMainApp() {
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('mainApp').classList.add('active');
        this.updateUserInfo();
        this.populateProjectSelector();
        this.showView('dashboard');
        this.updateSidebarProjects();
    }

    logout() {
        this.currentUser = null;
        this.authToken = null;
        this.currentProject = null;
        document.querySelector('.user-menu').classList.remove('active');
        this.showToast('Logged out successfully', 'info');
        setTimeout(() => this.showLoginScreen(), 500);
    }

    updateUserInfo() {
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
            document.getElementById('userEmail').textContent = this.currentUser.email;
            document.querySelector('#userAvatar img').src = this.currentUser.avatar;
        }
    }

    populateProjectSelector() {
        const select = document.getElementById('projectSelect');
        select.innerHTML = '<option value="">All Projects</option>';
        
        this.data.projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            select.appendChild(option);
        });
    }

    updateSidebarProjects() {
        const container = document.getElementById('recentProjects');
        container.innerHTML = '';
        
        this.data.projects.slice(0, 3).forEach(project => {
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.innerHTML = `
                <button class="nav-link" onclick="app.viewProject('${project.id}')">
                    <span class="material-icons">folder</span>
                    ${project.name}
                </button>
            `;
            container.appendChild(li);
        });
    }

    showView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelector(`[data-view="${viewName}"]`)?.closest('.nav-item')?.classList.add('active');
        
        // Show view
        document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
        document.getElementById(`${viewName}View`).classList.add('active');
        
        if (viewName === 'dashboard') {
            this.renderDashboard();
            document.getElementById('projectSelect').value = '';
        }
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('active');
        }
    }

    renderDashboard() {
        this.updateStats();
        this.renderProjectsGrid();
    }

    updateStats() {
        const totalProjects = this.data.projects.length;
        const totalTasks = this.data.tasks.length;
        const totalMembers = this.data.users.length;
        
        document.getElementById('totalProjects').textContent = totalProjects;
        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('totalMembers').textContent = totalMembers;
    }

    renderProjectsGrid() {
        const grid = document.getElementById('projectsGrid');
        grid.innerHTML = '';
        
        this.data.projects.forEach(project => {
            const projectTasks = this.data.tasks.filter(task => task.projectId === project.id);
            const completedTasks = projectTasks.filter(task => task.status === 'done').length;
            
            const card = document.createElement('div');
            card.className = 'project-card';
            card.onclick = () => this.viewProject(project.id);
            
            const teamAvatars = project.teamMembers.map(memberId => {
                const member = this.data.users.find(u => u.id === memberId);
                return member ? `
                    <div class="avatar">
                        <img src="${member.avatar}" alt="${member.name}">
                    </div>
                ` : '';
            }).join('');
            
            card.innerHTML = `
                <div class="project-header">
                    <div>
                        <h3 class="project-title">${project.name}</h3>
                        <span class="status status--${project.status === 'active' ? 'info' : 'success'}">
                            ${project.status}
                        </span>
                    </div>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-progress">
                    <div class="progress-label">
                        <span>Progress</span>
                        <span>${project.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.progress}%"></div>
                    </div>
                </div>
                <div class="project-footer">
                    <div class="team-avatars">
                        ${teamAvatars}
                    </div>
                    <div class="task-info">
                        ${completedTasks}/${projectTasks.length} tasks
                    </div>
                </div>
            `;
            
            grid.appendChild(card);
        });
    }

    viewProject(projectId) {
        this.currentProject = this.data.projects.find(p => p.id === projectId);
        if (!this.currentProject) return;
        
        document.getElementById('currentProjectName').textContent = this.currentProject.name;
        document.getElementById('projectSelect').value = projectId;
        this.showView('kanban');
        this.renderKanbanBoard();
        this.updateOnlineUsers();
    }

    renderKanbanBoard() {
        if (!this.currentProject) return;
        
        const projectTasks = this.data.tasks.filter(task => task.projectId === this.currentProject.id);
        
        // Clear columns
        ['todo', 'inprogress', 'done'].forEach(status => {
            const column = document.getElementById(`${status}Column`);
            column.innerHTML = '';
            
            // Update task counts
            const count = projectTasks.filter(task => task.status === status).length;
            document.getElementById(`${status}Count`).textContent = count;
        });
        
        // Render tasks
        projectTasks.forEach(task => {
            this.renderTaskCard(task);
        });
        
        // Setup drag and drop
        this.setupDragAndDrop();
    }

    renderTaskCard(task) {
        const assignee = this.data.users.find(u => u.id === task.assignee);
        const column = document.getElementById(`${task.status}Column`);
        
        const card = document.createElement('div');
        card.className = 'task-card';
        card.draggable = true;
        card.dataset.taskId = task.id;
        card.onclick = () => this.showTaskModal(task.id);
        
        const dueDate = new Date(task.dueDate).toLocaleDateString();
        
        card.innerHTML = `
            <div class="task-title">${task.title}</div>
            <div class="task-description">${task.description}</div>
            <div class="task-meta">
                <div class="task-assignee">
                    <div class="avatar">
                        <img src="${assignee?.avatar || 'https://i.pravatar.cc/150?img=1'}" alt="${assignee?.name || 'Unknown'}">
                    </div>
                    <span>${assignee?.name || 'Unassigned'}</span>
                </div>
                <div class="priority-badge priority-${task.priority}">
                    ${task.priority}
                </div>
            </div>
            <div style="font-size: 10px; color: var(--color-text-secondary); margin-top: 8px;">
                Due: ${dueDate}
            </div>
        `;
        
        column.appendChild(card);
    }

    setupDragAndDrop() {
        const cards = document.querySelectorAll('.task-card');
        const columns = document.querySelectorAll('.column-content');
        
        cards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', card.dataset.taskId);
                card.classList.add('dragging');
            });
            
            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
            });
        });
        
        columns.forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                column.classList.add('drag-over');
            });
            
            column.addEventListener('dragleave', () => {
                column.classList.remove('drag-over');
            });
            
            column.addEventListener('drop', (e) => {
                e.preventDefault();
                column.classList.remove('drag-over');
                
                const taskId = e.dataTransfer.getData('text/plain');
                const newStatus = column.id.replace('Column', '');
                this.moveTask(taskId, newStatus);
            });
        });
    }

    moveTask(taskId, newStatus) {
        const task = this.data.tasks.find(t => t.id === taskId);
        if (!task || task.status === newStatus) return;
        
        const oldStatus = task.status;
        task.status = newStatus;
        
        // Simulate real-time update
        this.showToast(`Task "${task.title}" moved to ${this.getStatusLabel(newStatus)}`, 'success');
        
        // Re-render the board
        this.renderKanbanBoard();
        
        // Simulate activity logging
        console.log(`Task ${taskId} moved from ${oldStatus} to ${newStatus} by ${this.currentUser.name}`);
    }

    getStatusLabel(status) {
        const labels = {
            todo: 'To Do',
            inprogress: 'In Progress',
            done: 'Done'
        };
        return labels[status] || status;
    }

    updateOnlineUsers() {
        const onlineCount = this.data.users.filter(u => u.online).length;
        document.getElementById('onlineUsers').innerHTML = `
            <span class="online-indicator"></span>
            <span class="online-count">${onlineCount} online</span>
        `;
    }

    showProjectModal() {
        // Populate team members checkboxes
        const container = document.getElementById('teamMembersCheckbox');
        container.innerHTML = '';
        
        this.data.users.forEach(user => {
            const div = document.createElement('div');
            div.className = 'checkbox-item';
            div.innerHTML = `
                <input type="checkbox" id="member_${user.id}" value="${user.id}">
                <label for="member_${user.id}">${user.name}</label>
            `;
            container.appendChild(div);
        });
        
        this.showModal('projectModal');
    }

    showTaskModal(taskId = null, defaultStatus = 'todo') {
        const modal = document.getElementById('taskModal');
        const title = document.getElementById('taskModalTitle');
        const deleteBtn = document.getElementById('deleteTaskBtn');
        const saveBtn = document.getElementById('saveTaskBtn');
        
        // Populate assignee dropdown
        const assigneeSelect = document.getElementById('taskAssignee');
        assigneeSelect.innerHTML = '<option value="" disabled selected></option>';
        
        if (this.currentProject) {
            this.currentProject.teamMembers.forEach(memberId => {
                const member = this.data.users.find(u => u.id === memberId);
                if (member) {
                    const option = document.createElement('option');
                    option.value = member.id;
                    option.textContent = member.name;
                    assigneeSelect.appendChild(option);
                }
            });
        }
        
        if (taskId) {
            // Edit mode
            const task = this.data.tasks.find(t => t.id === taskId);
            if (task) {
                title.textContent = 'Edit Task';
                deleteBtn.style.display = 'block';
                saveBtn.textContent = 'Update Task';
                
                // Fill form
                document.getElementById('taskTitle').value = task.title;
                document.getElementById('taskDescription').value = task.description;
                document.getElementById('taskAssignee').value = task.assignee;
                document.getElementById('taskPriority').value = task.priority;
                document.getElementById('taskDueDate').value = task.dueDate;
                
                modal.dataset.taskId = taskId;
            }
        } else {
            // Create mode
            title.textContent = 'Create New Task';
            deleteBtn.style.display = 'none';
            saveBtn.textContent = 'Create Task';
            
            // Reset form
            document.getElementById('taskForm').reset();
            modal.dataset.taskId = '';
            modal.dataset.defaultStatus = defaultStatus;
        }
        
        this.showModal('taskModal');
    }

    async createProject(e) {
        const btn = e.target.querySelector('button[type="submit"]');
        this.setButtonLoading(btn, true);
        
        try {
            await this.delay(800);
            
            const formData = new FormData(e.target);
            const selectedMembers = Array.from(document.querySelectorAll('#teamMembersCheckbox input:checked')).map(cb => cb.value);
            
            const newProject = {
                id: String(this.data.projects.length + 1),
                name: document.getElementById('projectName').value,
                description: document.getElementById('projectDescription').value,
                status: 'active',
                createdAt: new Date().toISOString().split('T')[0],
                teamMembers: selectedMembers.length ? selectedMembers : [this.currentUser.id],
                progress: 0
            };
            
            this.data.projects.push(newProject);
            this.populateProjectSelector();
            this.updateSidebarProjects();
            this.renderDashboard();
            
            this.hideModal('projectModal');
            this.showToast(`Project "${newProject.name}" created successfully!`, 'success');
        } catch (error) {
            this.showToast('Failed to create project', 'error');
        } finally {
            this.setButtonLoading(btn, false);
        }
    }

    async saveTask(e) {
        const btn = e.target.querySelector('button[type="submit"]');
        this.setButtonLoading(btn, true);
        
        try {
            await this.delay(600);
            
            const modal = document.getElementById('taskModal');
            const taskId = modal.dataset.taskId;
            const isEdit = !!taskId;
            
            const taskData = {
                title: document.getElementById('taskTitle').value,
                description: document.getElementById('taskDescription').value,
                assignee: document.getElementById('taskAssignee').value,
                priority: document.getElementById('taskPriority').value,
                dueDate: document.getElementById('taskDueDate').value,
            };
            
            if (isEdit) {
                // Update existing task
                const task = this.data.tasks.find(t => t.id === taskId);
                if (task) {
                    Object.assign(task, taskData);
                    this.showToast(`Task "${task.title}" updated successfully!`, 'success');
                }
            } else {
                // Create new task
                const newTask = {
                    id: String(this.data.tasks.length + 1),
                    ...taskData,
                    projectId: this.currentProject.id,
                    status: modal.dataset.defaultStatus || 'todo',
                    createdAt: new Date().toISOString().split('T')[0]
                };
                
                this.data.tasks.push(newTask);
                this.showToast(`Task "${newTask.title}" created successfully!`, 'success');
            }
            
            this.hideModal('taskModal');
            if (this.currentProject) {
                this.renderKanbanBoard();
            }
            this.renderDashboard();
        } catch (error) {
            this.showToast('Failed to save task', 'error');
        } finally {
            this.setButtonLoading(btn, false);
        }
    }

    deleteCurrentTask() {
        const modal = document.getElementById('taskModal');
        const taskId = modal.dataset.taskId;
        
        if (taskId && confirm('Are you sure you want to delete this task?')) {
            const taskIndex = this.data.tasks.findIndex(t => t.id === taskId);
            if (taskIndex > -1) {
                const task = this.data.tasks[taskIndex];
                this.data.tasks.splice(taskIndex, 1);
                
                this.hideModal('taskModal');
                this.showToast(`Task "${task.title}" deleted successfully!`, 'success');
                
                if (this.currentProject) {
                    this.renderKanbanBoard();
                }
                this.renderDashboard();
            }
        }
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset forms
        const modal = document.getElementById(modalId);
        const form = modal.querySelector('form');
        if (form) form.reset();
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = {
            success: 'check_circle',
            error: 'error',
            warning: 'warning',
            info: 'info'
        }[type] || 'info';
        
        toast.innerHTML = `
            <span class="material-icons">${icon}</span>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 4000);
    }

    setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application
const app = new TaskFlowApp();

// Expose some functions globally for onclick handlers
window.app = app;