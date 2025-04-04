import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="100vh"
          p={3}
          textAlign="center"
        >
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              maxWidth: 500, 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <ErrorOutline color="error" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" gutterBottom color="error">
              Что-то пошло не так
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Произошла ошибка при загрузке этого компонента. Приносим извинения за неудобства.
            </Typography>
            {this.state.error && (
              <Box 
                sx={{ 
                  mt: 2, 
                  mb: 3, 
                  p: 2, 
                  backgroundColor: 'rgba(0,0,0,0.03)', 
                  borderRadius: 1,
                  maxHeight: '150px',
                  overflow: 'auto',
                  textAlign: 'left'
                }}
              >
                <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            <Button 
              variant="contained" 
              color="primary" 
              onClick={this.handleReset}
              sx={{ mt: 2 }}
            >
              Попробовать снова
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
