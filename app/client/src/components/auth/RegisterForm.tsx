import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Link, CircularProgress, Alert, InputAdornment, IconButton } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import TextField from '../ui/TextField';
import Button from '../ui/Button';
import { useAuth } from '../../core/context/AuthContext';
import { UserRegistration } from '../../core/models/User';

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

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
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [formTouched, setFormTouched] = useState({
    username: false,
    email: false,
    password: false,
    firstName: false,
    lastName: false
  });

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      errors.username = 'Имя пользователя обязательно';
      isValid = false;
    } else if (formData.username.length < 3) {
      errors.username = 'Имя пользователя должно быть не менее 3 символов';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email обязателен';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Неверный формат email';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Пароль обязателен';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    setFormTouched(prev => ({ ...prev, [name]: true }));
    
    if (error) clearError();
  };

  // Validate on blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setFormTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  };

  // Validate if form is touched and values change
  useEffect(() => {
    if (Object.values(formTouched).some(touched => touched)) {
      validateForm();
    }
  }, [formData, formTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setFormTouched({
      username: true,
      email: true,
      password: true,
      firstName: true,
      lastName: true
    });
    
    if (validateForm()) {
      try {
        await register(formData);
        navigate('/');
      } catch (err) {
        // Error is handled by AuthContext
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          onBlur={handleBlur}
          required
          autoComplete="username"
          autoFocus
          error={!!formErrors.username && formTouched.username}
          helperText={formTouched.username ? formErrors.username : ''}
        />

        <TextField
          label="Электронная почта"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          autoComplete="email"
          error={!!formErrors.email && formTouched.email}
          helperText={formTouched.email ? formErrors.email : ''}
        />

        <TextField
          label="Имя"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="given-name"
          error={!!formErrors.firstName && formTouched.firstName}
          helperText={formTouched.firstName ? formErrors.firstName : ''}
        />

        <TextField
          label="Фамилия"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="family-name"
          error={!!formErrors.lastName && formTouched.lastName}
          helperText={formTouched.lastName ? formErrors.lastName : ''}
        />

        <TextField
          label="Пароль"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          autoComplete="new-password"
          error={!!formErrors.password && formTouched.password}
          helperText={formTouched.password ? formErrors.password : ''}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
