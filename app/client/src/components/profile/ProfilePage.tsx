import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Grid, 
  CircularProgress, 
  Alert,
  IconButton,
  Divider
} from '@mui/material';
import { Edit as EditIcon, Camera as CameraIcon } from '@mui/icons-material';
import TextField from '../ui/TextField';
import Button from '../ui/Button';
import { useAuth } from '../../core/context/AuthContext';
import { UserService } from '../../core/services/api';
import { MockUserService } from '../../core/mocks/mockApi';
import { UserModel } from '../../core/models/User';

const USE_MOCK_API = process.env.REACT_APP_API_URL === undefined || process.env.REACT_APP_USE_MOCK_API === 'true';

const ProfilePage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<UserModel>>(
    user ? {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    } : {}
  );

  const userService = USE_MOCK_API ? 
    new MockUserService() : new UserService();

  if (authLoading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev: Partial<UserModel>) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await userService.updateProfile(user.id, editedUser);
      setIsEditing(false);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 
                      typeof err === 'object' && err && 'response' in err ? 
                      (err.response as any)?.data?.message : 'Не удалось обновить профиль';
      setError(errorMsg as string);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsLoading(true);
      setError(null);
      
      try {
        await userService.updateAvatar(user.id, file);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 
                        typeof err === 'object' && err && 'response' in err ? 
                        (err.response as any)?.data?.message : 'Не удалось обновить аватар';
        setError(errorMsg as string);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Paper elevation={0} sx={{ 
      maxWidth: 800, 
      mx: 'auto', 
      p: 4, 
      borderRadius: 2,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
          Личный кабинет
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<EditIcon />}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Отменить' : 'Редактировать'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar 
                src={user.avatar} 
                alt={user.fullName}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <IconButton 
                sx={{ 
                  position: 'absolute', 
                  bottom: 10, 
                  right: -10,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': { backgroundColor: 'primary.dark' }
                }}
                component="label"
                disabled={isLoading}
              >
                <CameraIcon fontSize="small" />
                <input 
                  type="file" 
                  hidden 
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </IconButton>
            </Box>
            <Typography variant="h6" sx={{ mt: 1 }}>
              {user.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Имя"
                  name="firstName"
                  value={isEditing ? editedUser.firstName || '' : user.firstName || ''}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Фамилия"
                  name="lastName"
                  value={isEditing ? editedUser.lastName || '' : user.lastName || ''}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  value={isEditing ? editedUser.email || '' : user.email}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  fullWidth
                />
              </Grid>
            </Grid>

            {isEditing && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  sx={{ minWidth: 120 }}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Сохранить'}
                </Button>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom>
            Дополнительная информация
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Здесь может быть дополнительная информация о пользователе или другие разделы профиля.
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProfilePage;
