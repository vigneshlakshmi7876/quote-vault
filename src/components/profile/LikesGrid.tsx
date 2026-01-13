import React, { useEffect, useState } from 'react';
import { 
  FlatList, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  View, 
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback 
} from 'react-native';
import { Fontisto, Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/common/ThemedText';
import { ThemedView } from '@/components/common/ThemedView';
import { fetchUserFavorites } from '@/services/favorites.services';
import { useTheme } from '@/app/providers/ThemeProvider';
import { spacing } from '@/theme/spacing';

const { width } = Dimensions.get('window');
// EXACTLY 1/3rd of the screen width
const ITEM_WIDTH = width / 3;

interface LikesGridProps {
  userId: string;
}

export default function LikesGrid({ userId }: LikesGridProps) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    loadFavorites();
  }, [userId]);

  const loadFavorites = async () => {
    const { data } = await fetchUserFavorites(userId);
    if (data) setFavorites(data);
    setLoading(false);
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  if (favorites.length === 0) {
    return (
        <View style={styles.emptyContainer}>
            <ThemedText variant="bodySmall" style={{ opacity: 0.5 }}>
                No liked quotes yet.
            </ThemedText>
        </View>
    );
  }

  return (
    <>
      {/* 1. THE GRID */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.favoriteId}
        numColumns={3}
        // Remove default padding so it hits the edges
        contentContainerStyle={{ paddingBottom: 100 }} 
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
                styles.gridItem, 
                { 
                    backgroundColor: theme.card, 
                    borderColor: theme.background // Creates the "thin line" effect by revealing background
                }
            ]}
            onPress={() => setSelectedQuote(item)}
          >
            <ThemedText 
              variant="caption" 
              numberOfLines={4} 
              align="center"
              style={{ fontSize: 10, lineHeight: 14, opacity: 0.8 }}
            >
              {item.text}
            </ThemedText>
          </TouchableOpacity>
        )}
      />

      {/* 2. THE MODAL (Popup) */}
      <Modal
        visible={!!selectedQuote}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedQuote(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedQuote(null)}>
            <View style={styles.modalOverlay}>
                {/* Prevent clicks on the card from closing the modal */}
                <TouchableWithoutFeedback>
                    <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
                        
                        {/* Quote Content */}
                        <View style={styles.modalContent}>
                            <Fontisto name="quote-right" size={32} color={theme.primary} style={{ marginBottom: 16, opacity: 0.5 }} />
                            
                            <ThemedText variant="h3" align="center" style={{ marginBottom: 16 }}>
                                "{selectedQuote?.text}"
                            </ThemedText>
                            
                            <View style={{ width: 40, height: 2, backgroundColor: theme.primary, marginBottom: 16 }} />
                            
                            <ThemedText variant="body" align="center" style={{ fontWeight: '600', opacity: 0.7 }}>
                                — {selectedQuote?.author}
                            </ThemedText>
                        </View>

                        {/* Close Button */}
                        <TouchableOpacity 
                            style={[styles.closeButton, { borderTopColor: theme.text + '10' }]}
                            onPress={() => setSelectedQuote(null)}
                        >
                            <ThemedText variant="button" color={theme.primary}>Close</ThemedText>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH, // Square aspect ratio
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderWidth: 0.5, // Thin line
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContent: {
    padding: 32,
    alignItems: 'center',
  },
  closeButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
  }
});