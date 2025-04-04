import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Link, CircularProgress, Alert, InputAdornment, IconButton } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import TextField from '../ui/TextField';
import Button from '../ui/Button';
import { useAuth } from '../../core/context/AuthContext';
import { UserCredentials } from '../../core/models/User';

interface FormErrors {
  username?: string;
  password?: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<UserCredentials>({
    username: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [formTouched, setFormTouched] = useState({
    username: false,
    password: false
  });

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      errors.username = 'Имя пользователя обязательно';
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
    if (formTouched.username || formTouched.password) {
      validateForm();
    }
  }, [formData, formTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setFormTouched({
      username: true,
      password: true
    });
    
    if (validateForm()) {
      try {
        await login(formData);
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
          onBlur={handleBlur}
          required
          autoComplete="username"
          autoFocus
          error={!!formErrors.username && formTouched.username}
          helperText={formTouched.username ? formErrors.username : ''}
        />

        <TextField
          label="Пароль"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          autoComplete="current-password"
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
