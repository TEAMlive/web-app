import React from 'react';
import { Box, Typography, Avatar, Paper, Tooltip } from '@mui/material';
import { Message } from '../../core/models/Message';
import { formatMessageTime, formatMessageDate } from '../../core/utils/formatters';
import { useTheme } from '../../core/context/ThemeContext';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { alpha } from '@mui/material/styles';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar: boolean;
  otherUserAvatar?: string;
  showDate: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
  showAvatar,
  otherUserAvatar,
  showDate
}) => {
  const { mode } = useTheme();
  const isDarkMode = mode === 'dark';
  const primaryColor = '#5162FF';
  
  // Определяем цвета для пузырьков сообщений в зависимости от темы и отправителя
  const bubbleBgColor = isCurrentUser
    ? isDarkMode 
      ? alpha(primaryColor, 0.8)
      : primaryColor
    : isDarkMode 
      ? alpha('#ffffff', 0.08)
      : alpha('#f5f5f5', 0.9);
      
  const messageTextColor = isCurrentUser
    ? '#ffffff'
    : isDarkMode 
      ? '#ffffff' 
      : 'text.primary';
    
  const timeColor = isCurrentUser
    ? alpha('#ffffff', 0.7)
    : isDarkMode 
      ? alpha('#ffffff', 0.5)
      : alpha('#000000', 0.5);
  
  return (
    <Box sx={{ width: '100%', mb: 1.5 }}>
      {/* Показываем дату над сообщениями, если это новый день */}
      {showDate && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              zIndex: 1,
            }
          }}
        >
          <Typography
            variant="caption"
            sx={{
              backgroundColor: isDarkMode ? 'background.paper' : 'background.default',
              px: 2,
              py: 0.5,
              borderRadius: 10,
              color: 'text.secondary',
              position: 'relative',
              zIndex: 2,
              fontSize: '0.75rem',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            }}
          >
            {formatMessageDate(message.timestamp)}
          </Typography>
        </Box>
      )}

      {/* Контейнер сообщения с аватаром */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
          alignItems: 'flex-end',
          position: 'relative',
          pl: !isCurrentUser && showAvatar ? 5 : 0,
          pr: isCurrentUser ? 0 : 5,
          mt: 1
        }}
      >
        {/* Аватар отображается только для сообщений собеседника */}
        {!isCurrentUser && showAvatar && (
          <Avatar
            src={otherUserAvatar}
            alt="User Avatar"
            sx={{
              width: 28,
              height: 28,
              position: 'absolute',
              bottom: 0,
              left: 0,
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#fff'
            }}
          />
        )}

        {/* Пузырёк сообщения */}
        <Paper
          elevation={0}
          sx={{
            py: 1,
            px: 1.5,
            maxWidth: '85%',
            wordBreak: 'break-word',
            backgroundColor: bubbleBgColor,
            boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
            borderRadius: isCurrentUser
              ? '16px 4px 16px 16px'
              : '4px 16px 16px 16px',
            position: 'relative'
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: messageTextColor,
              fontWeight: 400,
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap'
            }}
          >
            {message.content}
          </Typography>

          {/* Время отправки и статус доставки */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-end', 
              mt: 0.5,
              gap: 0.5
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: timeColor,
                fontSize: '0.7rem',
                ml: 'auto'
              }}
            >
              {formatMessageTime(message.timestamp)}
            </Typography>

            {isCurrentUser && (
              <Tooltip title={message.read ? "Прочитано" : "Доставлено"}>
                <DoneAllIcon 
                  sx={{ 
                    fontSize: '0.85rem', 
                    color: message.read ? primaryColor : timeColor,
                    opacity: message.read ? 1 : 0.7
                  }} 
                />
              </Tooltip>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default MessageBubble;
