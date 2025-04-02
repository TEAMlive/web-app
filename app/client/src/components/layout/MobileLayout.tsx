import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Container, CssBaseline } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon, ExitToApp as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../../core/context/AuthContext';
import BottomNavigation from './BottomNavigation';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  showLogoutButton?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  title = 'Мобильное приложение',
  showBackButton = false,
  showLogoutButton = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleBack = () => {
    if (location.pathname === '/profile' && user) {
      return;
    }
    navigate(-1);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar>
          {showBackButton && (
            <IconButton edge="start" color="inherit" onClick={handleBack} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {title}
          </Typography>
          {showLogoutButton && user && (
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 4, display: 'flex', flexDirection: 'column', mb: 7 }}>
        {children}
      </Container>
      
      {user && <BottomNavigation />}
    </Box>
  );
};

export default MobileLayout;
