import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/common/ThemedText';
import { ThemedView } from '@/components/common/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/app/providers/ThemeProvider';
import { Quote } from '@/domain';
import { useAuth } from '@/app/providers/AuthProvider';
import { getDailyQuote } from '@/services/dailyquote.services';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { DailyQuoteWidget } from '@/widgets/DailyQuoteidget';
import { STRINGS } from '@/constants';

const { width, height } = Dimensions.get('window');

// A specialized static background for the "Special" quote
const DAILY_BG = "https://agmrjgtagvmermxlrqpv.supabase.co/storage/v1/object/public/quote-backdrops/v1/sunSet.jpg";

export default function DailyQuoteScreen() {
  const { theme } = useTheme();
  const { session } = useAuth(); // Access User Session

  const [quote, setQuote] = useState<Quote | null>(null);
  const [dateStr, setDateStr] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (session?.user) {
      loadDailyQuote();
    }
  }, [session?.user]); // Reload if user changes

  const loadDailyQuote = async () => {
    try {
      setLoading(true);

      // 1. Set Date String for UI
      const today = new Date();
      setDateStr(today.toDateString());

      // 2. CALL THE NEW SERVICE
      // This handles: Check DB -> Get Unique -> Save History
      if (session?.user.id) {
        const { data, error } = await getDailyQuote(session.user.id);

        if (data) {
          setQuote(data);
          // 3. Update Widget immediately with this "Sticky" quote
          updateWidget(data);
        }
      }
    } catch (e) {
      Alert.alert(STRINGS.errors.generalTitle, STRINGS.errors.failedToGetDailyQuote);
    } finally {
      setLoading(false);
    }
  };

  const updateWidget = async (currentQuote: Quote) => {
    try {
      await requestWidgetUpdate({
        widgetName: 'DailyQuote',
        renderWidget: () => (
          <DailyQuoteWidget
            quote={currentQuote.text}
            author={currentQuote.author}
          />
        ),
        widgetNotFound: () => { }
      });
    } catch (error) {
      // console.log("Failed to update widget", error);
    }
  };

  if (loading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  if (!quote) return <ThemedView style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: DAILY_BG }} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.content}>
          {/* Badge */}
          <View style={[styles.badge, { backgroundColor: theme.primary }]}>
            <Ionicons name="sparkles" color="#fff" size={16} />
            <ThemedText variant="bodySmall" color="#fff" style={{ marginLeft: 6, fontWeight: 'bold' }}>
              {STRINGS.dailyQuote.todayQuote}
            </ThemedText>
          </View>

          {/* Date */}
          <ThemedText variant="h3" color="rgba(255,255,255,0.8)" style={{ marginTop: 20 }}>
            {dateStr}
          </ThemedText>

          {/* Big Quote */}
          <ThemedText variant="h1" color="#fff" style={styles.quoteText}>
            "{quote.text}"
          </ThemedText>

          <View style={styles.divider} />

          <ThemedText variant="h2" color="#fff">
            {quote.author}
          </ThemedText>

          <ThemedText variant="caption" color="rgba(255,255,255,0.6)" style={{ marginTop: 40 }}>
            {STRINGS.dailyQuote.swipeRightSide}
          </ThemedText>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { flex: 1, width, height, justifyContent: 'center' },
  content: { padding: 30, alignItems: 'center' },
  badge: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, alignItems: 'center' },
  quoteText: { marginTop: 30, textAlign: 'center', fontSize: 32, lineHeight: 44 },
  divider: { width: 60, height: 3, backgroundColor: '#fff', marginVertical: 30, opacity: 0.5 },
});