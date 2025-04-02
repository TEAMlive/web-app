import React from 'react';
import MuiTextField from '@mui/material/TextField';
import { styled } from '@mui/system';

interface TextFieldProps {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  sx?: any;
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
