"use client";

import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '@/state/slices/global/selectors';

export default function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  const isDarkMode = useSelector(selectIsDarkMode);

  // Create a theme instance based on the dark mode state
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          ...(isDarkMode
            ? {
                // Dark mode palette
                primary: {
                  main: '#90caf9',
                },
                secondary: {
                  main: '#f48fb1',
                },
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
                text: {
                  primary: '#e0e0e0',
                  secondary: '#aaaaaa',
                },
              }
            : {
                // Light mode palette
                primary: {
                  main: '#1976d2',
                },
                secondary: {
                  main: '#dc004e',
                },
                background: {
                  default: '#f5f5f5',
                  paper: '#ffffff',
                },
                text: {
                  primary: '#333333',
                  secondary: '#666666',
                },
              }),
        },
        // MUI X components need to be styled with sx prop or CSS instead of theme.components
      }),
    [isDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
} 