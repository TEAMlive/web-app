import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import RegisterForm from '../components/auth/RegisterForm';
import { Box, Paper } from '@mui/material';

const RegisterPage: React.FC = () => {
  return (
    <MobileLayout title="Регистрация" showBackButton={true}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 150px)'
      }}>
        <Paper 
          elevation={0} 
          sx={{
            maxWidth: 450,
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <RegisterForm />
        </Paper>
      </Box>
    </MobileLayout>
  );
};

export default RegisterPage;
