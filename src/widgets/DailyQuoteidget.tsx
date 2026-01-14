import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface WidgetProps {
  quote: string;
  author: string;
}

export function DailyQuoteWidget({ quote, author }: WidgetProps) {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#2C3E50', // Solid Dark Blue Background
        borderRadius: 16,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      clickAction="OPEN_APP"
      clickActionData={{ uri: 'quotevault://daily-quote' }}
    >
      {/* Title */}
      <TextWidget
        text="DAILY QUOTE"
        style={{
          fontSize: 12,
          color: '#F1C40F', // Gold color text
          fontWeight: 'bold',
          letterSpacing: 2,
          marginBottom: 10,
        }}
      />
      
      {/* Quote Text */}
      <TextWidget
        text={`"${quote}"`}
        style={{
          fontSize: 18,
          color: '#ffffff',
          fontStyle: 'italic',
          textAlign: 'center',
          marginBottom: 12,
        }}
        maxLines={5}
      />

      {/* Author */}
      <TextWidget
        text={`— ${author}`}
        style={{
          fontSize: 14,
          color: '#bdc3c7',
          fontWeight: 'bold',
        }}
      />
    </FlexWidget>
  );
}