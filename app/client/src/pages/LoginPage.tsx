import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import LoginForm from '../components/auth/LoginForm';
import { Box, Paper } from '@mui/material';

const LoginPage: React.FC = () => {
  return (
    <MobileLayout title="Вход" showBackButton={false}>
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
          <LoginForm />
        </Paper>
      </Box>
    </MobileLayout>
  );
};

export default LoginPage;
