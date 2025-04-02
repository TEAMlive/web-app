import React from 'react';
import { Paper, BottomNavigation as MuiBottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home as HomeIcon, Person as PersonIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setValue(0);
    } else if (path === '/profile') {
      setValue(1);
    } else if (path === '/settings') {
      setValue(2);
    }
  }, [location.pathname]);

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)'
      }} 
      elevation={3}
    >
      <MuiBottomNavigation
        showLabels
        value={value}
        onChange={(event: React.SyntheticEvent, newValue: number) => {
          setValue(newValue);
          if (newValue === 0) navigate('/');
          if (newValue === 1) navigate('/profile');
          if (newValue === 2) navigate('/settings');
        }}
      >
        <BottomNavigationAction label="123" icon={<HomeIcon />} />
        <BottomNavigationAction label="123" icon={<PersonIcon />} />
        <BottomNavigationAction label="123" icon={<SettingsIcon />} />
      </MuiBottomNavigation>
    </Paper>
  );
};

export default BottomNavigation;
