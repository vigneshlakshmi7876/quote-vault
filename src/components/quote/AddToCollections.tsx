import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TouchableWithoutFeedback, 
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/common/ThemedText'; // Adjust path if needed
import { useTheme } from '@/app/providers/ThemeProvider'; // Adjust path if needed
import { fetchUserCollections, createCollection, addQuoteToCollection } from '@/services/collections.services';

interface Props {
  visible: boolean;
  onClose: () => void;
  userId: string;
  quoteId: string;
}

export default function AddToCollectionSheet({ visible, onClose, userId, quoteId }: Props) {
  const { theme } = useTheme();
  
  // Data State
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create New UI State
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [creatingLoader, setCreatingLoader] = useState(false);

  // Load data when sheet opens
  useEffect(() => {
    if (visible) {
      loadCollections();
      setIsCreating(false);
      setNewCollectionName('');
    }
  }, [visible]);

  const loadCollections = async () => {
    setLoading(true);
    const { data } = await fetchUserCollections(userId);
    if (data) setCollections(data);
    setLoading(false);
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;
    
    setCreatingLoader(true);
    const { data, error } = await createCollection(userId, newCollectionName);
    
    if (data) {
      // Optimistically add to top of list
      setCollections([data, ...collections]);
      setIsCreating(false);
      setNewCollectionName('');
    } else {
      Alert.alert('Error', error?.message || 'Could not create collection');
    }
    setCreatingLoader(false);
  };

  const handleSelectCollection = async (collectionId: string) => {
    // console.log('quoteId',quoteId);
    // console.log('collection',collectionId);
    const { error, isDuplicate } = await addQuoteToCollection(collectionId, quoteId);
    
    if (!error) {
        if (isDuplicate) {
            Alert.alert('Saved', 'Quote was already in this collection.');
        } else {
            Alert.alert('Success', 'Quote added to collection!');
        }
        onClose();
    } else {
        Alert.alert('Error', 'Could not add quote.');
    }
  };

 return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      {/* 1. Move KeyboardAvoidingView to the TOP level */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* 2. Overlay handles the background tap */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay}>
            
            {/* 3. Stop propagation so tapping the sheet doesn't close it */}
            <TouchableWithoutFeedback>
              <View style={[styles.sheet, { backgroundColor: theme.card }]}>
                
                {/* Header */}
                <View style={styles.header}>
                  <ThemedText variant="h3">Save to...</ThemedText>
                  <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={24} color={theme.text} />
                  </TouchableOpacity>
                </View>

                {/* --- CONTENT SWITCHER --- */}
                {isCreating ? (
                  /* 1. CREATE MODE */
                  <View style={styles.createContainer}>
                    <ThemedText variant="bodySmall" style={{marginBottom: 8}}>Name your collection:</ThemedText>
                    <TextInput 
                      style={[styles.input, { color: theme.text, borderColor: theme.text + '30', backgroundColor: theme.background }]}
                      placeholder="e.g., Motivation"
                      placeholderTextColor={theme.text + '80'}
                      value={newCollectionName}
                      onChangeText={setNewCollectionName}
                      autoFocus
                    />
                    <View style={styles.createActions}>
                        <TouchableOpacity onPress={() => setIsCreating(false)} style={{ padding: 10 }}>
                            <ThemedText>Cancel</ThemedText>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.createButton, { backgroundColor: theme.primary }]}
                            onPress={handleCreateCollection}
                            disabled={creatingLoader}
                        >
                            {creatingLoader ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <ThemedText style={{color: '#fff', fontWeight: 'bold'}}>Create</ThemedText>
                            )}
                        </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  /* 2. LIST MODE */
                  <>
                    <TouchableOpacity 
                        style={[styles.newItemRow, { borderBottomColor: theme.text + '10' }]}
                        onPress={() => setIsCreating(true)}
                    >
                        <View style={[styles.iconBox, { backgroundColor: theme.primary + '20' }]}>
                            <Ionicons name="add" size={24} color={theme.primary} />
                        </View>
                        <ThemedText variant="button" style={{color: theme.primary}}>New Collection</ThemedText>
                    </TouchableOpacity>

                    {loading ? (
                        <ActivityIndicator style={{ padding: 20 }} />
                    ) : (
                        <FlatList
                            data={collections}
                            keyExtractor={(item) => item.id}
                            style={{ maxHeight: 300 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={styles.collectionRow} 
                                    onPress={() => handleSelectCollection(item.id)}
                                >
                                    <Ionicons name="folder-outline" size={24} color={theme.text} style={{ opacity: 0.6 }} />
                                    <ThemedText style={{ marginLeft: 12, fontSize: 16 }}>{item.name}</ThemedText>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <ThemedText style={{textAlign: 'center', padding: 20, opacity: 0.5}}>
                                    No collections yet. Create one!
                                </ThemedText>
                            }
                        />
                    )}
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  
  // List Styles
  newItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, marginBottom: 8 },
  collectionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  iconBox: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },

  // Create Styles
  createContainer: { gap: 16 },
  input: { padding: 16, borderRadius: 8, borderWidth: 1, fontSize: 16 },
  createActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 16 },
  createButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, minWidth: 80, alignItems: 'center' },
});