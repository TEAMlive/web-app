import React, { useState } from 'react';
import { Box, Typography, Paper, Link, CircularProgress, Alert } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import TextField from '../ui/TextField';
import Button from '../ui/Button';
import { useAuth } from '../../core/context/AuthContext';
import { UserCredentials } from '../../core/models/User';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<UserCredentials>({
    username: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/profile');
    } catch (err) {
    }
  };

  return (
    <Paper elevation={0} sx={{ 
      maxWidth: 450, 
      mx: 'auto', 
      p: 4, 
      borderRadius: 2,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3, fontWeight: 700 }}>
        Вход в аккаунт
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Имя пользователя"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          autoComplete="username"
          autoFocus
        />

        <TextField
          label="Пароль"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          fullWidth
          sx={{ mt: 2, py: 1.5 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Войти'}
        </Button>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            Нет аккаунта?{' '}
            <Link component={RouterLink} to="/register" underline="hover">
              Зарегистрироваться
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default LoginForm;
