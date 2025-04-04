import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  CircularProgress, 
  Alert,
  IconButton,
  Divider,
  Chip,
  Snackbar,
  Tab,
  Tabs,
  Card,
  CardContent,
  Stack,
  useTheme as useMuiTheme
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Camera as CameraIcon, 
  Close as CloseIcon,
  Photo as PhotoIcon,
  Person as PersonIcon,
  Check as CheckIcon,
  CameraAlt as CameraAltIcon
} from '@mui/icons-material';
import Button from '../ui/Button';
import { useAuth } from '../../core/context/AuthContext';
import { useTheme } from '../../core/context/ThemeContext';
import { UserService } from '../../core/services/api';
import { MockUserService } from '../../core/mocks/mockApi';
import { UserModel } from '../../core/models/User';
import MobileLayout from '../layout/MobileLayout';
import AvatarUpload from './AvatarUpload';
import AnimatedContainer from '../ui/AnimatedContainer';
import LoadingIndicator from '../ui/LoadingIndicator';
import EditProfileModal from './EditProfileModal';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 1 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const USE_MOCK_API = process.env.REACT_APP_API_URL === undefined || process.env.REACT_APP_USE_MOCK_API === 'true';

const ProfilePage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [openEditModal, setOpenEditModal] = useState(false);
  
  const isDarkMode = mode === 'dark';

  const userService = USE_MOCK_API ? 
    new MockUserService() : new UserService();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (authLoading || !user) {
    return <LoadingIndicator text="Загрузка профиля..." fullScreen />;
  }

  const handleSubmit = async (userData: Partial<UserModel>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await userService.updateProfile(user.id, userData);
      setOpenEditModal(false);
      setSuccessMessage('Профиль успешно обновлен');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 
                      typeof err === 'object' && err && 'response' in err ? 
                      (err.response as any)?.data?.message : 'Не удалось обновить профиль';
      setError(errorMsg as string);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await userService.updateAvatar(user.id, file);
      setSuccessMessage('Аватар успешно обновлен');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 
                      typeof err === 'object' && err && 'response' in err ? 
                      (err.response as any)?.data?.message : 'Не удалось обновить аватар';
      setError(errorMsg as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileLayout 
      title="Профиль"
      showBackButton={false}
      showLogoutButton={true}
      transparent={false}
    >
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
        action={
          <IconButton size="small" color="inherit" onClick={() => setSuccessMessage(null)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <AnimatedContainer>
        {/* Telegram-style profile header */}
        <Card elevation={0} sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
          mb: 2
        }}>
          {/* Профиль и аватар */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            pt: 3,
            pb: 2,
            px: 3,
            background: isDarkMode 
              ? 'linear-gradient(180deg, rgba(55, 65, 160, 0.7) 0%, rgba(49, 50, 74, 0.0) 100%)'
              : 'linear-gradient(180deg, rgba(81, 98, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
          }}>
            <Box sx={{ position: 'relative', mb: 1.5 }}>
              <AvatarUpload
                currentAvatar={user.avatar}
                username={user.username}
                onAvatarChange={handleAvatarChange}
                size={100}
              />
            </Box>
            
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              textAlign: 'center',
              fontSize: '1.25rem',
              mb: 0.5 
            }}>
              {user.fullName}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1 
            }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontWeight: 500, 
                  mr: 1,
                  fontSize: '0.875rem'
                }}
              >
                @{user.username}
              </Typography>
              
              <Chip 
                label="Активный"
                size="small" 
                color="primary"
                sx={{ 
                  height: 20, 
                  fontSize: '0.7rem',
                  '& .MuiChip-label': { px: 1 }
                }}
              />
            </Box>
          </Box>
          
          {/* Tabs */}
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': {
                fontSize: '0.9rem',
                fontWeight: 600,
                py: 1.5,
                minHeight: 'unset',
                color: isDarkMode ? 'text.secondary' : 'text.primary',
                '&.Mui-selected': {
                  color: 'primary.main',
                }
              }
            }}
            TabIndicatorProps={{
              sx: {
                height: 3,
                borderRadius: '3px 3px 0 0',
                backgroundColor: muiTheme.palette.primary.main
              }
            }}
          >
            <Tab 
              icon={<PersonIcon sx={{ fontSize: '1.25rem' }} />} 
              label="Информация" 
              sx={{ color: tabValue === 0 ? 'primary.main' : 'text.secondary' }}
            />
            <Tab 
              icon={<PhotoIcon sx={{ fontSize: '1.25rem' }} />} 
              label="Фото" 
              sx={{ color: tabValue === 1 ? 'primary.main' : 'text.secondary' }}
            />
          </Tabs>
          
          {/* Tab Content */}
          <TabPanel value={tabValue} index={0}>
            <CardContent sx={{ p: 0 }}>
              {/* Статистика профиля */}
              <Box 
                sx={{
                  px: 3,
                  py: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  bgcolor: isDarkMode ? 'rgba(81, 98, 255, 0.08)' : 'rgba(81, 98, 255, 0.04)'
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: isDarkMode ? 'primary.main' : 'primary.dark' }}>
                  Статистика профиля
                </Typography>
              </Box>
              
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }
                    }}>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mb: 0.5 }}>
                        156
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Публикаций
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }
                    }}>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mb: 0.5 }}>
                        1.2K
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Подписчиков
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }
                    }}>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mb: 0.5 }}>
                        284
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Подписок
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 2.5 }} />
                
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                  Достижения
                </Typography>
                
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Chip 
                    label="Ранний пользователь" 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ 
                      borderRadius: 1,
                      '& .MuiChip-label': { px: 1 },
                      fontSize: '0.7rem'
                    }}
                  />
                  <Chip 
                    label="Активный автор" 
                    size="small" 
                    color="success" 
                    variant="outlined"
                    sx={{ 
                      borderRadius: 1,
                      '& .MuiChip-label': { px: 1 },
                      fontSize: '0.7rem'
                    }}
                  />
                  <Chip 
                    label="Популярный контент" 
                    size="small" 
                    color="secondary" 
                    variant="outlined"
                    sx={{ 
                      borderRadius: 1,
                      '& .MuiChip-label': { px: 1 },
                      fontSize: '0.7rem'
                    }}
                  />
                  <Chip 
                    label="100+ лайков" 
                    size="small" 
                    sx={{ 
                      borderRadius: 1,
                      bgcolor: isDarkMode ? 'rgba(255, 152, 0, 0.15)' : 'rgba(255, 152, 0, 0.1)',
                      color: 'warning.main',
                      border: '1px solid',
                      borderColor: 'warning.main',
                      '& .MuiChip-label': { px: 1 },
                      fontSize: '0.7rem'
                    }}
                  />
                </Stack>
                
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  bgcolor: isDarkMode ? 'rgba(81, 98, 255, 0.08)' : 'rgba(81, 98, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Premium статус
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', maxWidth: '220px' }}>
                      Получите больше возможностей с Premium подпиской
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    color="primary"
                    size="small"
                    sx={{ 
                      borderRadius: 6,
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      py: 0.5,
                      px: 2,
                      fontWeight: 500,
                      boxShadow: '0 2px 8px rgba(81, 98, 255, 0.3)'
                    }}
                  >
                    Активировать
                  </Button>
                </Box>
              </Box>
              
              {/* Персональная информация */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 3,
                pt: 2,
                pb: 1,
                mt: 1,
                bgcolor: isDarkMode ? 'rgba(81, 98, 255, 0.05)' : 'rgba(81, 98, 255, 0.02)'
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: '1rem',
                    color: 'text.primary'
                  }}>
                  Личная информация
                </Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => setOpenEditModal(true)}
                  size="small"
                  sx={{
                    borderRadius: 6,
                    px: 2,
                    py: 0.75,
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    boxShadow: '0 2px 5px rgba(81, 98, 255, 0.2)',
                  }}
                >
                  Изменить
                </Button>
              </Box>
              
              <Divider />
              
              <Box sx={{ px: 3, py: 2.5 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        Имя
                      </Typography>
                      <Typography variant="body1">
                        {user.firstName || 'Не указано'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        Фамилия
                      </Typography>
                      <Typography variant="body1">
                        {user.lastName || 'Не указано'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {user.email}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        Биография
                      </Typography>
                      <Typography variant="body1" sx={{ fontStyle: user.bio ? 'normal' : 'italic', color: user.bio ? 'text.primary' : 'text.secondary' }}>
                        {user.bio || 'Не указано'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Stack 
                direction="column" 
                spacing={2} 
                alignItems="center" 
                sx={{ py: 2 }}
              >
                <Box sx={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
                }}>
                  <CameraAltIcon sx={{ fontSize: 32, color: 'text.secondary', opacity: 0.7 }} />
                </Box>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary', 
                    fontWeight: 500,
                    mt: 1
                  }}
                >
                  У вас пока нет фотографий
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary', 
                    opacity: 0.7,
                    maxWidth: '280px',
                    mb: 1
                  }}
                >
                  Добавьте фотографии, чтобы сделать ваш профиль более интересным
                </Typography>
                
                <Button 
                  variant="outlined" 
                  color="primary"
                  startIcon={<CameraIcon />}
                  size="medium"
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    py: 1, 
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Добавить фото
                </Button>
              </Stack>
            </CardContent>
          </TabPanel>
        </Card>
      </AnimatedContainer>

      <EditProfileModal 
        open={openEditModal} 
        onClose={() => setOpenEditModal(false)} 
        onSave={handleSubmit} 
        user={user} 
        isLoading={isLoading}
      />
    </MobileLayout>
  );
};

export default ProfilePage;
