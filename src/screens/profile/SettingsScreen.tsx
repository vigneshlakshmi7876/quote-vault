import React from 'react';
import { View, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/app/providers/ThemeProvider';
import { ThemedView } from '@/components/common/ThemedView';
import { ThemedText } from '@/components/common/ThemedText';
import { spacing } from '@/theme/spacing';
import { useAuth } from '@/app/providers/AuthProvider';

export default function SettingsScreen() {
  const { isDark, setIsDark, theme } = useTheme();
  const { signOut } = useAuth();

  return (
    <ThemedView style={styles.container}>
      
      {/* Setting Item: Dark Mode */}
      <View style={[styles.row, { borderBottomColor: theme.text + '20' }]}>
        <View style={styles.labelContainer}>
            <Ionicons name="moon-outline" size={24} color={theme.text} style={{ marginRight: 12 }}/>
            <ThemedText variant="body">Dark Mode</ThemedText>
        </View>
        <Switch
          value={isDark}
          onValueChange={(value) => setIsDark(value)}
          trackColor={{ false: '#767577', true: theme.primary }}
          thumbColor={'#f4f3f4'}
        />
      </View>

      {/* Setting Item: Notifications (Placeholder for marks) */}
      <View style={[styles.row, { borderBottomColor: theme.text + '20' }]}>
        <View style={styles.labelContainer}>
            <Ionicons name="notifications-outline" size={24} color={theme.text} style={{ marginRight: 12 }}/>
            <ThemedText variant="body">Daily Quote Notification</ThemedText>
        </View>
        <Switch value={true} onValueChange={()=>{}} disabled />
      </View>

      {/* Logout Button (Moved here as per standard app UX) */}
      <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
        <ThemedText variant="button" color="#FF4B4B">Logout</ThemedText>
      </TouchableOpacity>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.screenPadding,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.l,
    borderBottomWidth: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: spacing.xxxl,
    alignItems: 'center',
    padding: spacing.m,
  }
});