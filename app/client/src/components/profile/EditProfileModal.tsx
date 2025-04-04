import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid,
  CircularProgress,
  Typography,
  Box
} from '@mui/material';
import { Close as CloseIcon, Save as SaveIcon } from '@mui/icons-material';
import TextField from '../ui/TextField';
import Button from '../ui/Button';
import { UserModel } from '../../core/models/User';
import { useTheme } from '../../core/context/ThemeContext';

interface EditProfileModalProps {
  open: boolean;
  user: UserModel;
  isLoading: boolean;
  onClose: () => void;
  onSave: (userData: Partial<UserModel>) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  user,
  isLoading,
  onClose,
  onSave
}) => {
  const { mode } = useTheme();
  const [editedUser, setEditedUser] = useState<Partial<UserModel>>({});
  const isDarkMode = mode === 'dark';

  useEffect(() => {
    if (user) {
      setEditedUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    }
  }, [user, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedUser);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          Редактирование профиля
        </Typography>
        <IconButton edge="end" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Имя"
                name="firstName"
                value={editedUser.firstName || ''}
                onChange={handleChange}
                disabled={isLoading}
                fullWidth
                placeholder="Введите ваше имя"
                size="small"
                margin="dense"
                required
                InputProps={{
                  sx: {
                    borderRadius: 1.5,
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Фамилия"
                name="lastName"
                value={editedUser.lastName || ''}
                onChange={handleChange}
                disabled={isLoading}
                fullWidth
                placeholder="Введите вашу фамилию"
                size="small"
                margin="dense"
                required
                InputProps={{
                  sx: {
                    borderRadius: 1.5,
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={editedUser.email || ''}
                onChange={handleChange}
                disabled={isLoading}
                fullWidth
                placeholder="Введите email"
                size="small"
                margin="dense"
                required
                InputProps={{
                  sx: {
                    borderRadius: 1.5,
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 2, 
                bgcolor: isDarkMode ? 'rgba(81, 98, 255, 0.08)' : 'rgba(81, 98, 255, 0.04)',
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Дополнительная информация
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                  Эта информация будет видна другим пользователям в вашем профиле
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="О себе"
                name="bio"
                value={editedUser.bio || ''}
                onChange={handleChange}
                disabled={isLoading}
                fullWidth
                placeholder="Расскажите немного о себе"
                size="small"
                margin="dense"
                multiline
                minRows={3}
                maxRows={5}
                InputProps={{
                  sx: {
                    borderRadius: 1.5,
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ 
          px: 3, 
          py: 2, 
          borderTop: '1px solid', 
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <Button 
            variant="outlined" 
            onClick={onClose} 
            color="secondary"
            size="medium"
            sx={{
              borderRadius: 6,
              px: 3,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} /> : <SaveIcon />}
            size="medium"
            sx={{ 
              borderRadius: 6,
              px: 3,
              textTransform: 'none',
              fontWeight: 500 
            }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProfileModal;
