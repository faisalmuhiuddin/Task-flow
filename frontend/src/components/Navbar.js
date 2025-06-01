import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Button,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  AccountCircle,
  Notifications,
  Dashboard,
  ExitToApp,
  Settings,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isProfileMenuOpen = Boolean(anchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);

  return (
    <AppBar 
      position="sticky" 
      elevation={1}
      sx={{ 
        backgroundColor: 'white',
        color: 'text.primary',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Toolbar>
        {/* Logo and Title */}
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 0,
            fontWeight: 700,
            color: 'primary.main',
            cursor: 'pointer',
            mr: 4,
          }}
          onClick={() => handleNavigation('/dashboard')}
        >
          TaskFlow
        </Typography>

        {/* Navigation Buttons */}
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          <Button
            startIcon={<Dashboard />}
            onClick={() => handleNavigation('/dashboard')}
            sx={{
              color: location.pathname === '/dashboard' ? 'primary.main' : 'text.secondary',
              fontWeight: location.pathname === '/dashboard' ? 600 : 400,
            }}
          >
            Dashboard
          </Button>
        </Box>

        {/* Right side - Notifications and Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* User Info */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', mr: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Welcome,
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {user?.name}
            </Typography>
          </Box>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              size="large"
              aria-label="show notifications"
              color="inherit"
              onClick={handleNotificationMenuOpen}
            >
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile Menu */}
          <Tooltip title="Account settings">
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar
                sx={{ 
                  width: 32, 
                  height: 32,
                  backgroundColor: 'primary.main',
                  fontSize: '0.875rem',
                }}
              >
                {user?.name ? getInitials(user.name) : <AccountCircle />}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          id="primary-search-account-menu"
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isProfileMenuOpen}
          onClose={handleProfileMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
            },
          }}
        >
          <MenuItem onClick={handleProfileMenuClose} disabled>
            <Box>
              <Typography variant="subtitle2">{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>
            <Settings sx={{ mr: 2 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ExitToApp sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isNotificationMenuOpen}
          onClose={handleNotificationMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 320,
              maxHeight: 400,
            },
          }}
        >
          <MenuItem disabled>
            <Typography variant="subtitle2" color="text.primary">
              Notifications
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleNotificationMenuClose}>
            <Box>
              <Typography variant="body2">New task assigned to you</Typography>
              <Typography variant="caption" color="text.secondary">
                2 minutes ago
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotificationMenuClose}>
            <Box>
              <Typography variant="body2">Project deadline approaching</Typography>
              <Typography variant="caption" color="text.secondary">
                1 hour ago
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotificationMenuClose}>
            <Box>
              <Typography variant="body2">Team member completed task</Typography>
              <Typography variant="caption" color="text.secondary">
                3 hours ago
              </Typography>
            </Box>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;