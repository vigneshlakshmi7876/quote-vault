import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/app/providers/AuthProvider';
import { ThemedView } from '@/components/common/ThemedView';
import { ThemedText } from '@/components/common/ThemedText';
import { STRINGS, ROUTES } from '@/constants'; // Ensure ROUTES has SETTINGS: 'Settings'
import { spacing } from '@/theme/spacing';
import { useTheme } from '@/app/providers/ThemeProvider';
import LikesGrid from '@/components/profile/LikesGrid';
import CollectionsGrid from '@/components/profile/CollectionsGrid';

// --- Placeholder Components for Tabs (We will build these next) ---
const LikesTab = ({ userId }: { userId: string }) => (
    // We pass the userId down so the grid knows whose data to fetch
    <LikesGrid userId={userId} />
);

const CollectionsTab = ({ userId }: { userId: string }) => (
    <CollectionsGrid userId={userId} />
);

// --- Main Screen Component ---
export default function ProfileScreen({ navigation }: any) {
  const { session } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'likes' | 'collections'>('likes');

  // Logic to get the first letter of the email (or "G" for Guest)
  const userEmail = session?.user?.email || 'Guest';
  const avatarLetter = userEmail.charAt(0).toUpperCase();

  return (
    <ThemedView style={styles.container}>
      
      {/* --- 1. HEADER SECTION --- */}
      <View style={styles.header}>
        {/* Left: Circular Avatar */}
        <View style={styles.avatarContainer}>
            <ThemedText variant="h2" color="white">{avatarLetter}</ThemedText>
        </View>

        {/* Center: User Info */}
        <View style={styles.userInfo}>
            <ThemedText variant="bodySmall" style={{ opacity: 0.7 }}>
                {STRINGS.profile.emailLabel}
            </ThemedText>
            <ThemedText variant="body" style={{ fontWeight: '600' }}>
                {userEmail}
            </ThemedText>
        </View>

        {/* Right: Settings Button */}
        <TouchableOpacity 
            onPress={() => navigation.navigate(ROUTES.SETTINGS || 'Settings')}
            style={styles.settingsButton}
        >
            <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* --- 2. SEGMENT TABS --- */}
      <View style={[styles.tabsContainer, { borderBottomColor: theme.text + '10' }]}>
        
        {/* Likes Tab Button */}
        <TouchableOpacity 
            style={[
                styles.tabItem, 
                activeTab === 'likes' && { borderBottomColor: theme.primary }
            ]}
            onPress={() => setActiveTab('likes')}
        >
            <ThemedText 
                variant="button" 
                color={activeTab === 'likes' ? theme.primary : undefined}
                style={{ opacity: activeTab === 'likes' ? 1 : 0.5 }}
            >
                {STRINGS.profile.tabs.likes}
            </ThemedText>
        </TouchableOpacity>

        {/* Collections Tab Button */}
        <TouchableOpacity 
            style={[
                styles.tabItem, 
                activeTab === 'collections' && { borderBottomColor: theme.primary }
            ]}
            onPress={() => setActiveTab('collections')}
        >
            <ThemedText 
                variant="button" 
                color={activeTab === 'collections' ? theme.primary : undefined}
                style={{ opacity: activeTab === 'collections' ? 1 : 0.5 }}
            >
                {STRINGS.profile.tabs.collections}
            </ThemedText>
        </TouchableOpacity>
      </View>

      {/* --- 3. CONTENT AREA --- */}
      <View style={styles.contentArea}>
        {activeTab === 'likes' ? <LikesTab userId={session?.user?.id || ''} /> : <CollectionsTab userId={session?.user?.id || ''} />}
      </View>

    </ThemedView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // Adjust for Safe Area
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.l,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30, // Make it a perfect circle
    backgroundColor: '#FF6B6B', // Accent color for avatar
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  userInfo: {
    flex: 1, // Takes up remaining space between avatar and settings button
  },
  settingsButton: {
    padding: spacing.s,
  },
  
  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1, // Equal width
    alignItems: 'center',
    paddingVertical: spacing.m,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent', // Invisible unless active
  },
  
  // Content
  contentArea: {
    flex: 1,
  },

  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  }
});