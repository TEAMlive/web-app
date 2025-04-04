import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingIndicatorProps {
  text?: string;
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  text = 'Загрузка...',
  fullScreen = false,
  size = 'medium'
}) => {
  const getSizeValue = () => {
    switch (size) {
      case 'small': return 24;
      case 'large': return 48;
      case 'medium':
      default: return 36;
    }
  };

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <CircularProgress size={getSizeValue()} color="primary" />
      {text && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, textAlign: 'center' }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default LoadingIndicator;
