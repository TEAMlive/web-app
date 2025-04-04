import React from 'react';
import { Paper, BottomNavigation as MuiBottomNavigation, BottomNavigationAction, Badge } from '@mui/material';
import { 
  Home as HomeIcon, 
  Person as PersonIcon, 
  Settings as SettingsIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { MockMessagesService } from '../../core/services/MessagesService';
import { useAuth } from '../../core/context/AuthContext';
import { useState, useEffect } from 'react';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [value, setValue] = React.useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  // Проверяем наличие непрочитанных сообщений
  useEffect(() => {
    if (!user) return;

    const messagesService = new MockMessagesService();
    
    const checkUnreadMessages = async () => {
      try {
        const chats = await messagesService.getChats(user.id);
        const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);
        setUnreadMessagesCount(totalUnread);
      } catch (error) {
        console.error('Ошибка при проверке непрочитанных сообщений:', error);
      }
    };
    
    checkUnreadMessages();
    
    // Периодически проверяем новые сообщения
    const interval = setInterval(checkUnreadMessages, 30000); // Каждые 30 секунд
    
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setValue(0);
    } else if (path === '/profile') {
      setValue(1);
    } else if (path === '/messages') {
      setValue(2);
    } else if (path === '/settings') {
      setValue(3);
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
          if (newValue === 2) navigate('/messages');
          if (newValue === 3) navigate('/settings');
        }}
      >
        <BottomNavigationAction label="Главная" icon={<HomeIcon />} />
        <BottomNavigationAction label="Профиль" icon={<PersonIcon />} />
        <BottomNavigationAction 
          label="Сообщения" 
          icon={
            <Badge badgeContent={unreadMessagesCount} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem' } }}>
              <MessageIcon />
            </Badge>
          } 
        />
        <BottomNavigationAction label="Настройки" icon={<SettingsIcon />} />
      </MuiBottomNavigation>
    </Paper>
  );
};

export default BottomNavigation;
