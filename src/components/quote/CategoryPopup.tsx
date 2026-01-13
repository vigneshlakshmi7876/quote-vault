import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { ThemedText } from '@/components/common/ThemedText';
import { useTheme } from '@/app/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { QUOTE_CATEGORIES } from '@/constants';

interface Props {
  visible: boolean;
  onClose: () => void;
  selectedCategories: string[]; // Pass in currently active filters
  onApplyFilter: (categories: string[]) => void; // Return the new list
}

export default function CategoryPopup({ visible, onClose, selectedCategories, onApplyFilter }: Props) {
  const { theme } = useTheme();
  const [localSelection, setLocalSelection] = useState<string[]>([]);

  // Sync local state when popup opens
  useEffect(() => {
    if (visible) {
      setLocalSelection(selectedCategories);
    }
  }, [visible, selectedCategories]);

  const toggleCategory = (key: string) => {
    if (localSelection.includes(key)) {
      // Remove if already selected
      setLocalSelection(prev => prev.filter(k => k !== key));
    } else {
      // Add if not selected
      setLocalSelection(prev => [...prev, key]);
    }
  };

  const handleApply = () => {
    onApplyFilter(localSelection);
    onClose();
  };

  const handleClear = () => {
      setLocalSelection([]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.popup, { backgroundColor: theme.card }]}>
              
              {/* Header */}
              <View style={styles.header}>
                <ThemedText variant="h3">Filter Quotes</ThemedText>
                {localSelection.length > 0 && (
                    <TouchableOpacity onPress={handleClear}>
                        <ThemedText variant="caption" color={theme.primary}>Clear</ThemedText>
                    </TouchableOpacity>
                )}
              </View>

              {/* Multi-Select Chips */}
              <View style={styles.chipsContainer}>
                {QUOTE_CATEGORIES.map((category) => {
                  const isSelected = localSelection.includes(category.key);
                  return (
                    <TouchableOpacity
                      key={category.key}
                      style={[
                        styles.chip, 
                        { 
                            borderColor: theme.primary,
                            backgroundColor: isSelected ? theme.primary : 'transparent' 
                        }
                      ]}
                      onPress={() => toggleCategory(category.key)}
                    >
                      <ThemedText 
                          variant="caption" 
                          color={isSelected ? '#fff' : theme.primary} 
                          style={{ fontWeight: '600' }}
                      >
                        {category.label}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Action Buttons */}
              <View style={styles.footer}>
                  <TouchableOpacity onPress={onClose} style={{ padding: 10 }}>
                      <ThemedText color={theme.text} style={{ opacity: 0.7 }}>Cancel</ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.applyButton, { backgroundColor: theme.primary }]}
                    onPress={handleApply}
                  >
                      <ThemedText color="#fff" style={{ fontWeight: 'bold' }}>
                          Apply Filters ({localSelection.length})
                      </ThemedText>
                  </TouchableOpacity>
              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popup: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  applyButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
  }
});