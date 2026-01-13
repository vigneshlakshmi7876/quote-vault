import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@/app/providers/ThemeProvider';

interface ThemedViewProps extends ViewProps {
  backgroundColor?: string; // Optional override
}

export const ThemedView = ({ style, backgroundColor, ...props }: ThemedViewProps) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        { backgroundColor: backgroundColor || theme.background },
        style,
      ]}
      {...props}
    />
  );
};