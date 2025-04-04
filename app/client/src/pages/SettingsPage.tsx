import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
  Chip,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Translate as TranslateIcon,
  Info as InfoIcon,
  ExitToApp as LogoutIcon,
  ArrowForwardIos as ArrowIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/context/AuthContext';
import { useTheme } from '../core/context/ThemeContext';
import Button from '../components/ui/Button';
import MobileLayout from '../components/layout/MobileLayout';
import AnimatedContainer from '../components/ui/AnimatedContainer';

const SettingsPage: React.FC = () => {
  const { logout, user } = useAuth();
  const { mode, toggleThemeMode } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const isDarkMode = mode === 'dark';

  const handleDarkModeToggle = () => {
    toggleThemeMode();
    setSnackbarMessage(isDarkMode 
      ? 'Светлая тема включена'
      : 'Тёмная тема включена');
    setSnackbarOpen(true);
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
    setSnackbarMessage(!notifications 
      ? 'Уведомления включены'
      : 'Уведомления отключены');
    setSnackbarOpen(true);
  };

  const handleLogout = async () => {
    setLogoutDialogOpen(false);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const showInfoMessage = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  return (
    <MobileLayout 
      title="Настройки" 
      showBackButton={false}
      showLogoutButton={false}
    >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />

      {user && (
        <AnimatedContainer>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              mb: 3,
              p: 2.5,
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <Avatar 
              src={user.avatar || undefined} 
              alt={user.username} 
              sx={{ 
                width: 50, 
                height: 50, 
                bgcolor: 'primary.main',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              {user.firstName?.charAt(0) || user.username?.charAt(0)}
            </Avatar>
            <Box sx={{ ml: 2, flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {user.fullName || user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => navigate('/profile')}
              sx={{ minWidth: 'auto', borderRadius: 2, px: 1.5 }}
            >
              Профиль
            </Button>
          </Paper>
        </AnimatedContainer>
      )}

      <AnimatedContainer delay={0.1}>
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            mb: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <Typography 
            variant="subtitle1" 
            sx={{ px: 3, py: 2, bgcolor: 'background.default', fontWeight: 600 }}
          >
            Основные настройки
          </Typography>
          <List disablePadding>
            <ListItem>
              <ListItemIcon>
                {isDarkMode ? 
                  <LightModeIcon sx={{ color: '#FFB74D' }} /> : 
                  <DarkModeIcon sx={{ color: '#5162FF' }} />
                }
              </ListItemIcon>
              <ListItemText 
                primary={isDarkMode ? "Светлая тема" : "Тёмная тема"} 
                secondary={isDarkMode ? "Переключиться на светлую тему" : "Переключиться на тёмную тему"}
              />
              <Switch
                edge="end"
                checked={isDarkMode}
                onChange={handleDarkModeToggle}
                color="primary"
              />
            </ListItem>
            <Divider component="li" variant="middle" />
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon color={notifications ? "primary" : "disabled"} />
              </ListItemIcon>
              <ListItemText 
                primary="Уведомления" 
                secondary="Получать уведомления о важных событиях"
              />
              <Switch
                edge="end"
                checked={notifications}
                onChange={handleNotificationsToggle}
                color="primary"
              />
            </ListItem>
            <Divider component="li" variant="middle" />
            <ListItem button onClick={() => {
              showInfoMessage('Языковые настройки будут доступны в следующем обновлении');
            }}>
              <ListItemIcon>
                <TranslateIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Язык" secondary="Русский" />
              <Chip size="small" label="Скоро" variant="outlined" sx={{ mr: 1 }} />
              <ArrowIcon fontSize="small" sx={{ color: 'text.disabled', opacity: 0.5 }} />
            </ListItem>
          </List>
        </Paper>
      </AnimatedContainer>

      <AnimatedContainer delay={0.2}>
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            mb: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <Typography 
            variant="subtitle1" 
            sx={{ px: 3, py: 2, bgcolor: 'background.default', fontWeight: 600 }}
          >
            Безопасность и конфиденциальность
          </Typography>
          <List disablePadding>
            <ListItem button onClick={() => {
              showInfoMessage('Настройки безопасности будут доступны в следующем обновлении');
            }}>
              <ListItemIcon>
                <SecurityIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Безопасность" secondary="Пароль и двухфакторная аутентификация" />
              <Chip size="small" label="Скоро" variant="outlined" sx={{ mr: 1 }} />
              <ArrowIcon fontSize="small" sx={{ color: 'text.disabled', opacity: 0.5 }} />
            </ListItem>
          </List>
        </Paper>
      </AnimatedContainer>

      <AnimatedContainer delay={0.3}>
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            mb: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <Typography 
            variant="subtitle1" 
            sx={{ px: 3, py: 2, bgcolor: 'background.default', fontWeight: 600 }}
          >
            О приложении
          </Typography>
          <List disablePadding>
            <ListItem button onClick={() => {
              showInfoMessage('Версия приложения: 1.0.0');
            }}>
              <ListItemIcon>
                <InfoIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Версия" secondary="1.0.0" />
              <ArrowIcon fontSize="small" sx={{ color: 'text.disabled', opacity: 0.5 }} />
            </ListItem>
          </List>
        </Paper>
      </AnimatedContainer>

      <AnimatedContainer delay={0.4}>
        <Box sx={{ mt: 'auto', py: 2 }}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={() => setLogoutDialogOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Выйти из аккаунта
          </Button>
        </Box>
      </AnimatedContainer>

      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        aria-labelledby="logout-dialog-title"
      >
        <DialogTitle id="logout-dialog-title">
          Выход из аккаунта
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите выйти из аккаунта?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)} color="primary">
            Отмена
          </Button>
          <Button onClick={handleLogout} color="error">
            Выйти
          </Button>
        </DialogActions>
      </Dialog>
    </MobileLayout>
  );
};

export default SettingsPage;
