import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { Fontisto, Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/common/ThemedText';
import { useTheme } from '@/app/providers/ThemeProvider';
import { STRINGS } from '@/constants';


const { width } = Dimensions.get('window');
// Full width divided by 3
const ITEM_WIDTH = width / 3;

interface Props {
  data: any[]; // List of quotes
  emptyMessage?: string;
}

export default function QuoteGrid({ data, emptyMessage = STRINGS.collections.noQuotesFound }: Props) {
  const { theme } = useTheme();
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="documents-outline" size={48} color={theme.text} style={{ opacity: 0.3 }} />
        <ThemedText variant="bodySmall" style={{ opacity: 0.5, marginTop: 12 }}>
          {emptyMessage}
        </ThemedText>
      </View>
    );
  }

  return (
    <>
      {/* 1. GRID */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.gridItem,
              {
                backgroundColor: theme.card,
                borderColor: theme.background
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
            <ThemedText
              variant="bodySmall"
              align="center"
              style={{ fontSize: 10, lineHeight: 18, opacity: 0.8 }}
            >
              {"-"} {item.author}
            </ThemedText>
          </TouchableOpacity>
        )}
      />

      {/* 2. MODAL (Popup) */}
      <Modal
        visible={!!selectedQuote}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedQuote(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedQuote(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
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
                <TouchableOpacity
                  style={[styles.closeButton, { borderTopColor: theme.text + '10' }]}
                  onPress={() => setSelectedQuote(null)}
                >
                  <ThemedText variant="button" color={theme.primary}>{STRINGS.common.close}</ThemedText>
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
    height: ITEM_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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