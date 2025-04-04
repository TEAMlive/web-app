import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Paper, 
  Alert, 
  Hidden,
  Card,
  IconButton,
  InputAdornment,
  useMediaQuery,
} from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { Search as SearchIcon, Message as MessageIcon } from '@mui/icons-material';
import { Chat, Message } from '../core/models/Message';
import ChatList from '../components/messages/ChatList';
import ChatDialog from '../components/messages/ChatDialog';
import MobileLayout from '../components/layout/MobileLayout';
import { useAuth } from '../core/context/AuthContext';
import { useTheme } from '../core/context/ThemeContext';
import { MockMessagesService } from '../core/services/MessagesService';
import TextField from '../components/ui/TextField';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { mode } = useTheme();
  const isDarkMode = mode === 'dark';
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  // Используем useMemo для создания сервиса только один раз
  const messagesService = useMemo(() => new MockMessagesService(), []);
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [selectedChatParticipant, setSelectedChatParticipant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);
  
  // Загрузка чатов при монтировании компонента - только один раз
  useEffect(() => {
    if (user && !initialLoadCompleted) {
      loadChats();
      setInitialLoadCompleted(true);
    }
  }, [user, initialLoadCompleted]);
  
  // Загрузка сообщений при выборе чата
  useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId);
    }
  }, [selectedChatId]);
  
  const loadChats = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const fetchedChats = await messagesService.getChats(user.id);
      setChats(fetchedChats);
      
      // Если есть чаты, выбираем первый по умолчанию (только для десктопа)
      if (fetchedChats.length > 0 && !isMobile && !selectedChatId) {
        handleChatSelect(fetchedChats[0].id);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Ошибка загрузки чатов:', err);
      setError('Не удалось загрузить список чатов');
      setIsLoading(false);
    }
  };
  
  const loadMessages = async (chatId: number) => {
    setIsLoading(true);
    try {
      const fetchedMessages = await messagesService.getMessages(chatId);
      setMessages(fetchedMessages);
      
      // Получаем информацию о другом участнике чата
      const chat = chats.find(c => c.id === chatId);
      if (chat && user) {
        const otherUserId = chat.participants.find(id => id !== user.id);
        if (otherUserId) {
          const otherUser = messagesService.getUserById(otherUserId);
          setSelectedChatParticipant(otherUser);
        }
      }
      
      // Отмечаем непрочитанные сообщения как прочитанные
      await Promise.all(fetchedMessages
        .filter(message => !message.read && message.receiver === user?.id)
        .map(message => messagesService.markAsRead(message.id))
      );

      // Обновляем список чатов тихо, без показа спиннера
      if (user) {
        const updatedChats = await messagesService.getChats(user.id);
        setChats(updatedChats);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Ошибка загрузки сообщений:', err);
      setError('Не удалось загрузить сообщения');
      setIsLoading(false);
    }
  };
  
  const handleChatSelect = (chatId: number) => {
    setSelectedChatId(chatId);
  };
  
  const handleBack = () => {
    setSelectedChatId(null);
  };
  
  const handleSendMessage = async (content: string) => {
    if (!user || !selectedChatId || !selectedChatParticipant) return;
    
    setIsSending(true);
    try {
      const newMessage = await messagesService.sendMessage({
        sender: user.id,
        receiver: selectedChatParticipant.id,
        content
      });
      
      // Обновляем список сообщений локально
      setMessages(prev => [...prev, newMessage]);
      
      // Тихо обновляем список чатов без показа спиннера загрузки
      const updatedChats = await messagesService.getChats(user.id);
      setChats(updatedChats);
      
      setIsSending(false);
    } catch (err) {
      console.error('Ошибка отправки сообщения:', err);
      setError('Не удалось отправить сообщение');
      setIsSending(false);
    }
  };

  // Мемоизируем отфильтрованные чаты для предотвращения повторных вычислений
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim() || !user) return chats;
    
    return chats.filter(chat => {
      const otherUserId = chat.participants.find(id => id !== user.id);
      if (!otherUserId) return false;
      
      const otherUser = messagesService.getUserById(otherUserId);
      if (!otherUser) return false;
      
      const fullName = `${otherUser.firstName || ''} ${otherUser.lastName || ''}`.trim();
      return (
        otherUser.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [chats, searchQuery, user]);
  
  const showNoChats = !isLoading && chats.length === 0;
  const showNoMessages = !isLoading && selectedChatId && messages.length === 0;
  const isMobileAndChatSelected = selectedChatId !== null && isMobile;

  return (
    <MobileLayout title="Сообщения" showBackButton={isMobileAndChatSelected} onBackButtonClick={handleBack}>
      <Box sx={{ 
        position: 'relative',
        height: { xs: 'calc(100vh - 200px)', md: 'calc(100vh - 200px)' },
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        mb: 2
      }}>
        <Paper 
          elevation={0} 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.15)' : '0 4px 20px rgba(0,0,0,0.08)',
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            overflow: 'hidden',
          }}
        >
          {/* Список чатов */}
          <Hidden mdDown={isMobileAndChatSelected}>
            <Card
              elevation={0}
              sx={{
                width: { xs: '100%', md: 320 },
                maxWidth: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRight: { xs: 0, md: 1 },
                borderColor: 'divider',
                borderRadius: 0,
                bgcolor: isDarkMode ? 'background.paper' : 'background.default'
              }}
            >
              {/* Заголовок списка чатов с поиском */}
              <Box 
                sx={{ 
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Поиск..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 3,
                      bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                    }
                  }}
                />
              </Box>
              
              {isLoading && !initialLoadCompleted ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '100%' 
                }}>
                  <CircularProgress size={30} />
                </Box>
              ) : (
                <>
                  {error && (
                    <Alert severity="error" sx={{ m: 2 }}>
                      {error}
                    </Alert>
                  )}
                  
                  {showNoChats ? (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        textAlign: 'center',
                        p: 4,
                        height: '100%'
                      }}
                    >
                      <MessageIcon 
                        sx={{ 
                          fontSize: 60, 
                          color: 'text.secondary', 
                          opacity: 0.5, 
                          mb: 2,
                          p: 1.5,
                          borderRadius: '50%',
                          bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                        }}
                      />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Нет сообщений
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        У вас пока нет активных диалогов
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      flex: 1, 
                      overflowY: 'auto'
                    }}>
                      <ChatList
                        chats={filteredChats}
                        currentUserId={user ? user.id : 0}
                        selectedChatId={selectedChatId || undefined}
                        onChatSelect={handleChatSelect}
                      />
                    </Box>
                  )}
                </>
              )}
            </Card>
          </Hidden>
          
          {/* Диалог чата */}
          <Hidden mdDown={!selectedChatId}>
            <Box 
              sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: isDarkMode ? 'background.paper' : '#fff',
              }}
            >
              {selectedChatId && user ? (
                <ChatDialog
                  chatId={selectedChatId}
                  currentUser={user}
                  chatParticipant={selectedChatParticipant}
                  messages={messages}
                  onBack={handleBack}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading && selectedChatId !== null}
                />
              ) : (
                <Box 
                  sx={{ 
                    display: { xs: 'none', md: 'flex' },
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    textAlign: 'center',
                    p: 4
                  }}
                >
                  <MessageIcon 
                    sx={{ 
                      fontSize: 80, 
                      color: 'text.secondary', 
                      opacity: 0.3, 
                      mb: 2,
                      p: 2.5,
                      borderRadius: '50%',
                      bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    }} 
                  />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Выберите чат
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Выберите диалог из списка слева или начните новый разговор
                  </Typography>
                </Box>
              )}
            </Box>
          </Hidden>
        </Paper>
      </Box>
    </MobileLayout>
  );
};

export default MessagesPage;
