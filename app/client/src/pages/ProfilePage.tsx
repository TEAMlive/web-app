import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import ProfileComponent from '../components/profile/ProfilePage';

const ProfilePage: React.FC = () => {
  return (
    <MobileLayout 
      title="Личный кабинет" 
      showBackButton={false} 
      showLogoutButton={true}
    >
      <ProfileComponent />
    </MobileLayout>
  );
};

export default ProfilePage;
