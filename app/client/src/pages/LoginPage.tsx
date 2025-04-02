import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <MobileLayout title="123" showBackButton={false}>
      <LoginForm />
    </MobileLayout>
  );
};

export default LoginPage;
