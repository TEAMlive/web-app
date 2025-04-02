import React, { useState } from 'react';
import { Box, Typography, Paper, Link, CircularProgress, Alert } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import TextField from '../ui/TextField';
import Button from '../ui/Button';
import { useAuth } from '../../core/context/AuthContext';
import { UserRegistration } from '../../core/models/User';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<UserRegistration>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
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
        Регистрация
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
          label="Электронная почта"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />

        <TextField
          label="Имя"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          autoComplete="given-name"
        />

        <TextField
          label="Фамилия"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          autoComplete="family-name"
        />

        <TextField
          label="Пароль"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          fullWidth
          sx={{ mt: 2, py: 1.5 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Зарегистрироваться'}
        </Button>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            Уже есть аккаунт?{' '}
            <Link component={RouterLink} to="/login" underline="hover">
              Войти
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default RegisterForm;
