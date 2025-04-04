import React, { ReactNode } from 'react';
import MuiButton from '@mui/material/Button';
import { styled } from '@mui/system';

interface ButtonProps {
  children?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  sx?: any;
}

const StyledButton = styled(MuiButton)(({ fullWidth }: { fullWidth?: boolean }) => ({
  borderRadius: '8px',
  padding: '10px 16px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  width: fullWidth ? '100%' : 'auto',
  '&:hover': {
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
}));

const Button = (props: ButtonProps) => {
  const { children, ...rest } = props;
  return <StyledButton {...rest}>{children}</StyledButton>;
};

export default Button;
