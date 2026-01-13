import React, { useState, useRef, useEffect } from 'react';
import { 
  Modal, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  Dimensions, 
  Alert,
  ActivityIndicator
} from 'react-native';
import ViewShot, { captureRef } from "react-native-view-shot";
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/common/ThemedText';
import { ThemedView } from '@/components/common/ThemedView';
import { useTheme } from '@/app/providers/ThemeProvider';
import { Quote } from '@/domain';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3;

interface Props {
  visible: boolean;
  onClose: () => void;
  quote: Quote;
  backgroundImages: string[];
}

export default function DownloadModal({ visible, onClose, quote, backgroundImages }: Props) {
  const { theme } = useTheme();
  
  // State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  // Ref for the "Hidden View" we want to capture
  const viewShotRef = useRef<View>(null);

  useEffect(() => {
    if (visible) {
      setSelectedImage(null); // Reset selection on open
    }
  }, [visible]);

  // 1. Handle Permission & Capture
  const handleDownload = async () => {
    if (!selectedImage) return;

    try {
        setDownloading(true);

        // A. Check Permissions
        if (permissionResponse?.status !== 'granted') {
            const { status } = await requestPermission();
            if (status !== 'granted') {
                Alert.alert("Permission needed", "We need permission to save to your gallery.");
                setDownloading(false);
                return;
            }
        }

        // B. Wait a tiny bit for the hidden view to render the selected image
        setTimeout(async () => {
            try {
                // C. Capture the Hidden View
                const uri = await captureRef(viewShotRef, {
                    format: "png",
                    quality: 1,
                    result: "tmpfile" // Temp file path
                });

                // D. Save to Gallery
                await MediaLibrary.saveToLibraryAsync(uri);
                
                Alert.alert("Saved!", "Quote saved to your gallery.");
                onClose();
            } catch (err) {
                console.error(err);
                Alert.alert("Error", "Could not generate image.");
            } finally {
                setDownloading(false);
            }
        }, 500); // 500ms delay to ensure image loaded in hidden view

    } catch (error) {
        Alert.alert("Error", "Something went wrong.");
        setDownloading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <ThemedView style={styles.container}>
            
            {/* Header */}
            <View style={styles.header}>
                <ThemedText variant="h3">Choose backdrop</ThemedText>
                {/* Cancel Button (Top Right alternative) */}
            </View>

            {/* Grid */}
            <FlatList
                data={backgroundImages}
                keyExtractor={(item) => item}
                numColumns={3}
                contentContainerStyle={{ paddingBottom: 100 }}
                renderItem={({ item }) => {
                    const isSelected = selectedImage === item;
                    return (
                        <TouchableOpacity 
                            onPress={() => setSelectedImage(item)}
                            activeOpacity={0.7}
                            style={[
                                styles.gridItem, 
                                { borderColor: theme.card } // Tiny lines
                            ]}
                        >
                            <Image source={{ uri: item }} style={styles.imageThumb} resizeMode="cover" />
                            
                            {/* Selection Overlay */}
                            {isSelected && (
                                <View style={styles.selectedOverlay}>
                                    <Ionicons name="checkmark-circle" size={32} color="#fff" />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                }}
            />

            {/* Footer Actions */}
            <View style={[styles.footer, { borderTopColor: theme.text + '10' }]}>
                <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                    <ThemedText variant="body" color={theme.text}>Cancel</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={handleDownload}
                    disabled={!selectedImage || downloading}
                    style={[
                        styles.downloadBtn, 
                        { backgroundColor: selectedImage ? theme.primary : theme.text + '20' }
                    ]}
                >
                    {downloading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <ThemedText variant="button" color="#fff">Download</ThemedText>
                    )}
                </TouchableOpacity>
            </View>

            {/* --------------------------------------------------------- */}
            {/* HIDDEN STAGE: This is what gets captured!                 */}
            {/* We position it off-screen so the user doesn't see it      */}
            {/* --------------------------------------------------------- */}
            <View 
                collapsable={false} 
                ref={viewShotRef}
                style={styles.hiddenStage}
            >
                {/* Only render if we have a selection to avoid empty captures */}
                {selectedImage && (
                    <View style={styles.captureContainer}>
                        <Image source={{ uri: selectedImage }} style={styles.captureBg} />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                            style={styles.captureGradient}
                        />
                        <View style={styles.captureContent}>
                            <ThemedText variant="h1" color="white" style={styles.captureText}>
                                "{quote.text}"
                            </ThemedText>
                            <View style={styles.captureAuthorRow}>
                                <View style={styles.captureAvatar}>
                                    <ThemedText variant="h3" color="white">{quote.author.charAt(0)}</ThemedText>
                                </View>
                                <ThemedText variant="h3" color="white">{quote.author}</ThemedText>
                            </View>
                            <ThemedText variant="caption" color="white" style={{marginTop: 20, opacity: 0.7}}>
                                QuoteVault
                            </ThemedText>
                        </View>
                    </View>
                )}
            </View>

        </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  
  // Grid
  gridItem: { width: ITEM_WIDTH, height: ITEM_WIDTH * 1.5, borderWidth: 1 }, // No gap, just border
  imageThumb: { width: '100%', height: '100%' },
  selectedOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  // Footer
  footer: { 
    padding: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderTopWidth: 1 
  },
  cancelBtn: { padding: 10 },
  downloadBtn: { 
    paddingVertical: 12, 
    paddingHorizontal: 32, 
    borderRadius: 30, 
    minWidth: 120, 
    alignItems: 'center' 
  },

  // HIDDEN STAGE STYLES
  hiddenStage: {
    position: 'absolute',
    left: -5000, // Move way off screen
    top: 0,
    width: 1080, // High Resolution Width (Instagram Story size-ish)
    height: 1920, // High Resolution Height
  },
  captureContainer: { flex: 1, backgroundColor: '#000' },
  captureBg: { ...StyleSheet.absoluteFillObject, resizeMode: 'cover' },
  captureGradient: { ...StyleSheet.absoluteFillObject },
  captureContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 80 },
  captureText: { fontSize: 60, lineHeight: 80, textAlign: 'center', fontWeight: 'bold', marginBottom: 60, textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 20 },
  captureAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  captureAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center' },
});