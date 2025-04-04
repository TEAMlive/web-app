import React from 'react';
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import { styled } from '@mui/system';

interface TextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  InputProps?: any;
  sx?: any;
  size?: 'small' | 'medium';
  margin?: 'none' | 'dense' | 'normal';
}

const StyledTextField = styled(MuiTextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: '#bdbdbd',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#5162FF',
    },
  },
  marginBottom: '16px',
}));

const TextField = (props: TextFieldProps) => {
  return <StyledTextField fullWidth {...props} />;
};

export default TextField;
