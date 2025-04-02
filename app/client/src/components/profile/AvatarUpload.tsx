import React, { useState } from 'react';
import { Box, Avatar, IconButton, CircularProgress, Typography } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

interface AvatarUploadProps {
  currentAvatar?: string;
  username: string;
  onAvatarChange: (file: File) => Promise<void>;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatar, username, onAvatarChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setIsLoading(true);

      try {
        await onAvatarChange(file);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Avatar
        src={previewUrl || currentAvatar}
        alt={username}
        sx={{
          width: 120,
          height: 120,
          fontSize: 48,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          border: '3px solid white',
        }}
      >
        {username ? username.charAt(0).toUpperCase() : '?'}
      </Avatar>
      
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '50%',
          }}
        >
          <CircularProgress size={40} sx={{ color: 'white' }} />
        </Box>
      )}
      
      <IconButton
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': { backgroundColor: 'primary.dark' },
          width: 36,
          height: 36,
        }}
        component="label"
        disabled={isLoading}
      >
        <PhotoCamera fontSize="small" />
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
      </IconButton>
      
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: 'text.secondary' }}>
        Нажмите для изменения
      </Typography>
    </Box>
  );
};

export default AvatarUpload;
