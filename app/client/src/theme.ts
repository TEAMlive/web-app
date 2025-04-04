import { createTheme, Theme } from '@mui/material/styles';

// Base theme with common configurations
const baseTheme = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          '&:hover': {
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden'
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 20,
          '&:last-child': {
            paddingBottom: 20
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 65,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            paddingTop: 8,
          },
        },
      },
    },
  },
};

// Light theme
export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#5162FF',
      light: '#7B87FF',
      dark: '#3545EB',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF5D8F',
      light: '#FF84AE',
      dark: '#E33D6F',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2A2D3E',
      secondary: '#707590',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  components: {
    ...baseTheme.components,
    MuiPaper: {
      styleOverrides: {
        ...baseTheme.components?.MuiPaper?.styleOverrides,
        elevation0: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.03)',
        },
        elevation1: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          margin: 8,
        },
        switchBase: {
          padding: 1,
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: '#5162FF',
              opacity: 1,
              border: 0,
            },
          },
        },
        thumb: {
          width: 24,
          height: 24,
        },
        track: {
          borderRadius: 13,
          border: '1px solid #E0E0E0',
          backgroundColor: '#F5F5F5',
          opacity: 1,
        },
      },
    },
  },
});

// Dark theme
export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#6B7AFF',
      light: '#8F9CFF',
      dark: '#4158F0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF6E9A',
      light: '#FF9DB9',
      dark: '#D94F7C',
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#E8E9F0',
      secondary: '#AEB0C4',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  components: {
    ...baseTheme.components,
    MuiPaper: {
      styleOverrides: {
        ...baseTheme.components?.MuiPaper?.styleOverrides,
        elevation0: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
          backgroundColor: '#1E1E1E',
        },
        elevation1: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
          backgroundColor: '#1E1E1E',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          margin: 8,
        },
        switchBase: {
          padding: 1,
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: '#6B7AFF',
              opacity: 1,
              border: 0,
            },
          },
        },
        thumb: {
          width: 24,
          height: 24,
        },
        track: {
          borderRadius: 13,
          border: '1px solid #333',
          backgroundColor: '#222',
          opacity: 1,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.2)',
          backgroundImage: 'none',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#AEB0C4',
          '&.Mui-selected': {
            color: '#6B7AFF',
          },
        },
      },
    },
  },
});

// Default theme - for backward compatibility, export light theme as default
const theme = lightTheme;
export default theme;
