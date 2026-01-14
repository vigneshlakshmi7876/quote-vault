import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Dimensions, TouchableOpacity, Alert,View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/common/ThemedText';
import { useTheme } from '@/app/providers/ThemeProvider';
import { fetchUserCollections } from '@/services/collections.services';
import { spacing } from '@/theme/spacing';
import { ThemedView } from '../common/ThemedView';

const { width } = Dimensions.get('window');

// --- ALIGNMENT MATH ---
// We want 3 items + gaps to fit exactly in the screen width
const GAP = spacing.s; // Space between items
const SCREEN_PADDING = spacing.screenPadding || 20; // Padding on screen edges
const AVAILABLE_WIDTH = width - (SCREEN_PADDING * 2) - (GAP * 2); // Width left for items
const ITEM_WIDTH = AVAILABLE_WIDTH / 3; // Exact width per item

export default function CollectionsGrid({ userId }: { userId: string }) {
  const [collections, setCollections] = useState<any[]>([]);
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  useEffect(() => {
    loadCollections();
  }, [userId]);

  const loadCollections = async () => {
    const { data } = await fetchUserCollections(userId);
    if (data) setCollections(data);
  };

  return (
    <ThemedView style={{padding:spacing.screenPadding}}>

      <FlatList
        data={collections} // Prepend "New" button
        keyExtractor={(item) => item.id}
        numColumns={3}
        
        // Styling for Alignment
        columnWrapperStyle={{ gap: GAP }} 
        contentContainerStyle={{ paddingBottom: 100 }}
        
        renderItem={({ item }) => {
         
          return (
            <TouchableOpacity 
              style={[styles.card, { backgroundColor: theme.card }]}
              // Navigate to Details Page
              onPress={() => navigation.navigate('CollectionDetails', { 
                  id: item.id, 
                  name: item.name 
              })}
            >
              <Ionicons name="folder" size={32} color="#FFD700" />
              
              <ThemedText 
                  variant="caption" 
                  numberOfLines={1} 
                  align="center"
                  style={{ marginTop: 8, fontWeight: '600' }}
              >
                  {item.name}
              </ThemedText>
              
              {/* Show Count */}
              <ThemedText variant="caption" style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>
                   {item.count} items
              </ThemedText>
            </TouchableOpacity>
          );
        }}
      />
    </ThemedView>
    
  );
}

const styles = StyleSheet.create({
  card: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.3, // Aspect Ratio for folder look
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.s,
    padding: 4,
    // Soft Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  addCard: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.3, // Aspect Ratio for folder look
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.s,
    padding: 4,
  },
});