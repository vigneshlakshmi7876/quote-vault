import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/app/providers/ThemeProvider';
import { typography } from '@/theme/typography';

// different type of text variants
type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'button' | 'caption';

interface ThemedTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const ThemedText = ({ 
  style, 
  variant = 'body', 
  color, 
  align,
  ...props 
}: ThemedTextProps) => {
  const { theme } = useTheme();

  return (
    <Text
      style={[
        // 1. Base typography style (size, weight)
        typography[variant], 
        // 2. Color (Theme default or manual override)
        { color: color || theme.text },
        // 3. Alignment helper (optional but handy)
        align && { textAlign: align },
        // 4. Any custom style overrides
        style,
      ]}
      {...props}
    />
  );
};