import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
  IconButton,
  CircularProgress,
  Avatar,
  TextField as MuiTextField
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import MessageBubble from './MessageBubble';
import { Message } from '../../core/models/Message';
import { UserModel } from '../../core/models/User';
import { useTheme } from '../../core/context/ThemeContext';
import TextField from '../ui/TextField';

interface ChatDialogProps {
  chatId: number;
  messages: Message[];
  currentUser: UserModel;
  chatParticipant: any;
  onBack: () => void;
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const ChatDialog: React.FC<ChatDialogProps> = ({
  chatId,
  messages,
  currentUser,
  chatParticipant,
  onBack,
  onSendMessage,
  isLoading
}) => {
  const { mode } = useTheme();
  const isDarkMode = mode === 'dark';
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Прокрутка к последнему сообщению при загрузке или при добавлении нового
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Функция для определения, нужно ли показывать дату для сообщения
  const shouldShowDate = (message: Message, index: number) => {
    if (index === 0) return true;
    
    const currentDate = new Date(message.timestamp).toDateString();
    const prevDate = new Date(messages[index - 1].timestamp).toDateString();
    
    return currentDate !== prevDate;
  };
  
  // Функция для определения, нужно ли показывать аватар для сообщения
  const shouldShowAvatar = (message: Message, index: number) => {
    // Показываем аватар, если это первое сообщение или если предыдущее сообщение от другого отправителя
    if (index === 0) return true;
    
    const prevMessage = messages[index - 1];
    return prevMessage.sender !== message.sender;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Заголовок чата */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: isDarkMode ? 'background.paper' : 'background.default'
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="back"
          onClick={onBack}
          sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>

        {chatParticipant ? (
          <>
            <Avatar
              src={chatParticipant.avatar}
              alt={chatParticipant.username}
              sx={{ 
                width: 40, 
                height: 40, 
                mr: 2,
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            />
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {chatParticipant.firstName} {chatParticipant.lastName}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ display: 'block', mt: -0.3 }}
              >
                {chatParticipant.isOnline ? 'В сети' : 'Не в сети'}
              </Typography>
            </Box>
          </>
        ) : (
          <Box sx={{ flexGrow: 1 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Box>

      {/* Область сообщений */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: isDarkMode ? 'background.default' : '#f5f8fb',
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={40} />
          </Box>
        ) : messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography variant="body1" color="text.secondary" align="center">
              Нет сообщений. Напишите первое!
            </Typography>
          </Box>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.sender === currentUser.id;
            
            return (
              <MessageBubble
                key={index}
                message={message}
                isCurrentUser={isCurrentUser}
                showAvatar={!isCurrentUser && shouldShowAvatar(message, index)}
                otherUserAvatar={chatParticipant?.avatar}
                showDate={shouldShowDate(message, index)}
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Область ввода сообщений */}
      <Box
        component="form"
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: isDarkMode ? 'background.paper' : 'background.default'
        }}
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <TextField
          fullWidth
          placeholder="Введите сообщение..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          multiline
          maxRows={4}
          InputProps={{
            sx: {
              borderRadius: 3,
              bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
            }
          }}
        />

        <IconButton
          color="primary"
          aria-label="send message"
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          sx={{
            ml: 1,
            bgcolor: newMessage.trim() ? 'primary.main' : 'transparent',
            color: newMessage.trim() ? 'white' : 'primary.light',
            '&:hover': {
              bgcolor: newMessage.trim() ? 'primary.dark' : 'transparent',
            },
            width: 40,
            height: 40,
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatDialog;
