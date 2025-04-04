import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Chip,
  Grid,
  Badge
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  EmojiEvents as TrophyIcon,
  Timeline as ActivityIcon
} from '@mui/icons-material';
import { useAuth } from '../core/context/AuthContext';
import { useTheme } from '../core/context/ThemeContext';
import MobileLayout from '../components/layout/MobileLayout';
import AnimatedContainer from '../components/ui/AnimatedContainer';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { mode } = useTheme();
  const [notificationCount] = useState(3);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const isDarkMode = mode === 'dark';

  // Функция для обработки лайков
  const handleLike = (postId: number) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  // Mock data for activity feed
  const activityItems = [
    {
      id: 1,
      user: {
        name: 'Александр',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      content: 'Добавил новый пост о технологиях React и TypeScript. Интересные подходы к типизации компонентов.',
      time: '2 часа назад',
      likes: 15,
      comments: 3
    },
    {
      id: 2,
      user: {
        name: 'Екатерина',
        avatar: 'https://i.pravatar.cc/150?img=5'
      },
      content: 'Рассказала о новом проекте по разработке мобильных приложений с использованием React Native.',
      time: '5 часов назад',
      likes: 23,
      comments: 7
    }
  ];

  return (
    <MobileLayout 
      title="Главная"
      showBackButton={false}
      showLogoutButton={false}
    >
      <Box sx={{ pb: 2 }}>
        {/* Welcome Card */}
        <AnimatedContainer>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 3,
              background: isDarkMode 
                ? 'linear-gradient(45deg, #323B69 0%, #4B5FFF 100%)'
                : 'linear-gradient(45deg, #5162FF 0%, #7B87FF 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: isDarkMode
                ? '0 8px 20px rgba(0, 0, 0, 0.4)'
                : '0 8px 20px rgba(81, 98, 255, 0.3)'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                p: 2,
                zIndex: 2
              }}
            >
              <Badge 
                badgeContent={notificationCount} 
                color="error" 
                overlap="circular"
                sx={{ 
                  '& .MuiBadge-badge': { 
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                    minWidth: '20px',
                    height: '20px',
                    borderRadius: '10px',
                  } 
                }}
              >
                <IconButton sx={{ color: 'white' }}>
                  <NotificationsIcon />
                </IconButton>
              </Badge>
            </Box>

            <Box 
              sx={{ 
                position: 'absolute',
                bottom: -40,
                right: -40,
                width: 200,
                height: 200,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                zIndex: 1
              }} 
            />

            <Box 
              sx={{ 
                position: 'absolute',
                top: -30,
                left: -30,
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                zIndex: 1
              }} 
            />

            <Box sx={{ maxWidth: '80%', position: 'relative', zIndex: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Добро пожаловать, {user?.firstName || user?.username}!
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                Сегодня отличный день для новых достижений!
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(5px)',
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s ease-in-out'
                  }
                }}
              >
                Новая запись
              </Button>
            </Box>
          </Paper>
        </AnimatedContainer>

        {/* Statistics */}
        <AnimatedContainer delay={0.2}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2.5,
                  borderRadius: 3,
                  textAlign: 'center',
                  height: '100%',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(81, 98, 255, 0.1)',
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5
                }}>
                  <ActivityIcon sx={{ color: 'primary.main' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Записей
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2.5,
                  borderRadius: 3,
                  textAlign: 'center',
                  height: '100%',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255, 93, 143, 0.1)',
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5
                }}>
                  <TrophyIcon sx={{ color: 'secondary.main' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Подписчиков
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </AnimatedContainer>

        {/* Activity Feed */}
        <AnimatedContainer delay={0.3}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Лента активности
            </Typography>

            {activityItems.length > 0 ? (
              <Box>
                {activityItems.map((item, index) => {
                  const isLiked = likedPosts.includes(item.id);
                  return (
                    <AnimatedContainer key={item.id} delay={0.1 + index * 0.1}>
                      <Card 
                        elevation={0} 
                        sx={{ 
                          mb: 2, 
                          borderRadius: 3,
                          overflow: 'hidden',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                            transform: 'translateY(-3px)'
                          }
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar 
                              src={item.user.avatar} 
                              sx={{ 
                                mr: 2,
                                width: 46,
                                height: 46,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }} 
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {item.user.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.time}
                              </Typography>
                            </Box>
                            <IconButton size="small">
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                            {item.content}
                          </Typography>
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ px: 2, py: 1 }}>
                          <Button 
                            size="small" 
                            startIcon={isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                            onClick={() => handleLike(item.id)}
                            sx={{ 
                              mr: 1, 
                              color: isLiked ? 'error.main' : 'inherit',
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            {isLiked ? item.likes + 1 : item.likes}
                          </Button>
                          <Button 
                            size="small" 
                            startIcon={<CommentIcon fontSize="small" />}
                            sx={{ mr: 1 }}
                          >
                            {item.comments}
                          </Button>
                          <Button 
                            size="small" 
                            startIcon={<ShareIcon fontSize="small" />} 
                            sx={{ ml: 'auto' }}
                          >
                            Поделиться
                          </Button>
                        </CardActions>
                      </Card>
                    </AnimatedContainer>
                  );
                })}
              </Box>
            ) : (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  borderRadius: 3, 
                  textAlign: 'center',
                  backgroundColor: 'background.default'
                }}
              >
                <ActivityIcon 
                  sx={{ 
                    fontSize: 48, 
                    color: 'text.disabled', 
                    opacity: 0.5, 
                    mb: 2 
                  }} 
                />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  Пока ничего нет
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Активности ваших друзей будут появляться здесь
                </Typography>
              </Paper>
            )}
          </Box>
        </AnimatedContainer>
      </Box>
    </MobileLayout>
  );
};

export default HomePage;
