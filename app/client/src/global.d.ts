// Global declarations to fix type issues
declare module '@mui/material';
declare module '@mui/icons-material';
declare module '@mui/material/styles';
declare module 'react-router-dom';

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module '*';
