import React, { useEffect, useState } from 'react';
import { View,Share, StyleSheet, Dimensions, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Quote } from '@/domain';
import { ThemedText } from '@/components/common/ThemedText';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '@/app/providers/AuthProvider';
import { checkIsLiked, toggleFavorite } from '@/services/favorites.services';
import { STRINGS } from '@/constants';


const { width, height } = Dimensions.get('window');

interface QuoteReelItemProps {
  quote: Quote;
  backgroundImages: string[];
  onCollectionPress: (quoteId: string) => void; // Renamed for clarity
  onLocalSavePress: (quote: Quote) => void;     // New Prop for Local Save
  onMorePress:() => void;
}

export default function QuoteReelItem({ 
  quote, 
  backgroundImages, 
  onCollectionPress, 
  onLocalSavePress,
    onMorePress,
}: QuoteReelItemProps) {
    const { session } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
   

    // Image Hash Logic
    const imageIndex = quote.id.charCodeAt(0) % backgroundImages.length;
    const bgImage = backgroundImages[imageIndex];

    // Check Like Status
    useEffect(() => {
        if (session?.user) {
            checkIsLiked(session.user.id, quote.id).then(setIsLiked);
        }
    }, [quote.id, session?.user]);

    // Handle Like
    const handleLikePress = async () => {
        if (!session?.user) {
            Alert.alert(STRINGS.auth.loginRequiredTitle, STRINGS.auth.loginRequiredMessage);
            return;
        }
        const previousState = isLiked;
        setIsLiked(!isLiked);
        const { error } = await toggleFavorite(session.user.id, quote.id);
        if (error) {
            setIsLiked(previousState);
            Alert.alert(STRINGS.errors.generalTitle, STRINGS.errors.favoriteUpdate);
        }
    };

    //IMPLEMENT SHARE LOGIC
    const handleShare = async () => {
        try {
            const message = `"${quote.text}"\n\n— ${quote.author}\n\nShared via QuoteVault App`;
            
            await Share.share({
                message: message,
                // title is mainly for Android
                title: "Check out this quote!", 
            });
        } catch (error: any) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: bgImage }} style={styles.backgroundImage} resizeMode="cover" />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
                style={styles.gradient}
            />

            <View style={styles.contentContainer}>
                {/* Quote Text */}
                <View style={styles.textContainer}>
                    <ThemedText variant="h1" color="white" style={styles.quoteText}>
                        "{quote.text}"
                    </ThemedText>
                </View>

                <View style={styles.bottomRow}>
                    {/* Author Section */}
                    <View style={styles.authorContainer}>
                        <View style={styles.avatarPlaceholder}>
                            <ThemedText variant="h2" color="white">{quote.author.charAt(0)}</ThemedText>
                        </View>
                        <ThemedText variant="button" color="white">{quote.author}</ThemedText>
                    </View>

                    {/* --- ACTION BUTTON STACK --- */}
                    <View style={styles.actionsContainer}>
                        
                        {/* 1. FAVORITE (Heart) */}
                        <TouchableOpacity style={styles.actionButton} onPress={handleLikePress}>
                            <Ionicons
                                name={isLiked ? "heart" : "heart-outline"}
                                size={28}
                                color={isLiked ? "#FF4B4B" : "white"}
                            />
                            <ThemedText variant="caption" color="white" style={{ marginTop: 4 }}>
                                {isLiked ? "Liked" : "Like"}
                            </ThemedText>
                        </TouchableOpacity>

                        {/* 2. COLLECTION (Dotted Box + Plus) */}
                        <TouchableOpacity 
                            style={styles.actionButton} 
                            onPress={() => onCollectionPress(quote.id)}
                        >
                            <View style={styles.dottedBox}>
                                <Ionicons name="add" size={20} color="white" />
                            </View>
                            <ThemedText variant="caption" color="white" style={{ marginTop: 4 }}>
                                Collect
                            </ThemedText>
                        </TouchableOpacity>

                        {/* 3. LOCAL SAVE (Download) */}
                        <TouchableOpacity 
                            style={styles.actionButton} 
                            onPress={() => onLocalSavePress(quote)}
                        >
                            <Ionicons name="download-outline" size={28} color="white" />
                            <ThemedText variant="caption" color="white" style={{ marginTop: 4 }}>
                                Save
                            </ThemedText>
                        </TouchableOpacity>

                        {/* 4. SHARE (Share) */}
                        <ActionButton OnPress={handleShare}  icon="share-social-outline" label="Share" />

                        {/* 5. MORE (Categories Popup) */}
                        <TouchableOpacity 
                            style={styles.actionButton} 
                            onPress={onMorePress}
                        >
                            <Ionicons name="ellipsis-horizontal" size={28} color="white" />
                            <ThemedText variant="caption" color="white" style={{ marginTop: 4 }}>
                                More
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

// Helper
const ActionButton = ({ icon, label, OnPress }: { icon: any, label: string , OnPress:()=>void}) => (
    <TouchableOpacity onPress={OnPress} style={styles.actionButton}>
        <Ionicons name={icon} size={28} color="white" />
        <ThemedText variant="caption" color="white" style={{ marginTop: 4 }}>
            {label}
        </ThemedText>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { width, height, justifyContent: 'flex-end' },
    backgroundImage: { ...StyleSheet.absoluteFillObject },
    gradient: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
    contentContainer: { zIndex: 2, padding: 20, paddingBottom: 70, justifyContent: 'flex-end', height: '100%' },
    textContainer: { marginBottom: 20, width: '75%' }, // Reduced width to make room for buttons
    quoteText: { fontStyle: 'italic', textShadowColor: 'rgba(0,0,0,0.75)', textShadowRadius: 10 },
    
    bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    authorContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    
    actionsContainer: { alignItems: 'center', gap: 24 }, // Increased gap for better touch targets
    actionButton: { alignItems: 'center' },

    // NEW STYLE FOR DOTTED BOX
    dottedBox: {
        width: 28,
        height: 28,
        borderRadius: 6, // Rounded square
        borderWidth: 2,
        borderColor: 'white',
        borderStyle: 'dotted', // <--- DOTTED MARGIN
        justifyContent: 'center',
        alignItems: 'center',
    }
});