import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/app/providers/ThemeProvider';

export default function ThemedStatusBar() {
  const { theme } = useTheme();
  const isDarkMode = theme.background === '#0e0e0e' || theme.text === '#FFFFFF'; 

  return (
    <StatusBar 
      // Dynamic Text Color
      style={isDarkMode ? 'light' : 'dark'} 
      backgroundColor="transparent"
      translucent={true}
    />
  );
}