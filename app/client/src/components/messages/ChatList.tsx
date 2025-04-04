import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Typography, 
  Badge, 
  Box,
  Divider
} from '@mui/material';
import { Chat } from '../../core/models/Message';
import { MockMessagesService } from '../../core/services/MessagesService';
import { formatMessageTime } from '../../core/utils/formatters';
import { useTheme } from '../../core/context/ThemeContext';

interface ChatListProps {
  chats: Chat[];
  currentUserId: number;
  selectedChatId?: number;
  onChatSelect: (chatId: number) => void;
}

const ChatList: React.FC<ChatListProps> = ({ 
  chats, 
  currentUserId, 
  selectedChatId, 
  onChatSelect 
}) => {
  const { mode } = useTheme();
  const isDarkMode = mode === 'dark';
  const messagesService = new MockMessagesService();

  return (
    <List 
      sx={{ 
        width: '100%', 
        p: 0,
        '& .MuiListItem-root': {
          transition: 'background-color 0.2s ease'
        }
      }}
    >
      {chats.map((chat) => {
        const isSelected = selectedChatId === chat.id;
        const otherUserId = chat.participants.find(id => id !== currentUserId);
        const otherUser = otherUserId ? messagesService.getUserById(otherUserId) : null;
        
        if (!otherUser) return null;
        
        const lastMessage = chat.lastMessage;
        const hasUnread = chat.unreadCount > 0;
        
        return (
          <React.Fragment key={chat.id}>
            <ListItem
              alignItems="flex-start"
              button
              selected={isSelected}
              onClick={() => onChatSelect(chat.id)}
              sx={{ 
                py: 1.5,
                px: 2,
                backgroundColor: isSelected ? 
                  (isDarkMode ? 'rgba(81, 98, 255, 0.1)' : 'rgba(81, 98, 255, 0.05)') : 
                  'transparent',
                '&:hover': {
                  backgroundColor: isDarkMode ? 
                    'rgba(255, 255, 255, 0.05)' : 
                    'rgba(0, 0, 0, 0.02)'
                },
                position: 'relative'
              }}
            >
              <ListItemAvatar sx={{ minWidth: 56 }}>
                <Avatar 
                  src={otherUser.avatar} 
                  alt={otherUser.username} 
                  sx={{ 
                    width: 48, 
                    height: 48,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }} 
                />
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: hasUnread ? 700 : 500,
                        fontSize: '0.95rem',
                        color: hasUnread ? 'primary.main' : 'text.primary'
                      }}
                      noWrap
                    >
                      {`${otherUser.firstName || ''} ${otherUser.lastName || ''}`}
                    </Typography>
                    
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: hasUnread ? 'primary.main' : 'text.secondary',
                        fontWeight: hasUnread ? 600 : 400,
                        fontSize: '0.75rem',
                        minWidth: '65px',
                        textAlign: 'right',
                        ml: 1
                      }}
                    >
                      {lastMessage ? formatMessageTime(lastMessage.timestamp) : ''}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center' 
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ 
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 'calc(100% - 28px)',
                        fontSize: '0.85rem',
                        fontWeight: hasUnread ? 500 : 400,
                        color: hasUnread ? 
                          (isDarkMode ? 'primary.light' : 'primary.main') : 
                          'text.secondary'
                      }}
                      component="span"
                    >
                      {lastMessage ? lastMessage.content : 'Нет сообщений'}
                    </Typography>
                    
                    {hasUnread && (
                      <Badge
                        badgeContent={chat.unreadCount}
                        color="primary"
                        sx={{ 
                          '& .MuiBadge-badge': {
                            fontSize: '0.65rem',
                            fontWeight: 'bold',
                            minWidth: 18,
                            height: 18,
                            borderRadius: '50%'
                          },
                          ml: 1
                        }}
                      />
                    )}
                  </Box>
                }
                secondaryTypographyProps={{
                  component: 'div'
                }}
                sx={{
                  my: 0,
                  overflow: 'hidden'
                }}
              />
            </ListItem>
            <Divider component="li" variant="inset" sx={{ ml: 7, opacity: 0.6 }} />
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default ChatList;
