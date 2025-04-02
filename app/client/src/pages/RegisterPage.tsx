import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <MobileLayout title="123" showBackButton={true}>
      <RegisterForm />
    </MobileLayout>
  );
};

export default RegisterPage;
