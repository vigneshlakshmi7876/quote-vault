import React, { memo, useMemo } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Quote } from "@/domain";
import { ThemedText } from "@/components/common/ThemedText";
import { STRINGS } from "@/constants";
import ActionButton from "./ActionButton";
import CollectionActionButton from "./CollectionActionButton";

const { width, height } = Dimensions.get("window");

interface QuoteReelItemProps {
    quote: Quote;
    isLiked: boolean;
    backgroundImages: string[];

    onToggleLike: (quoteId: string) => void;
    onShare: (quote: Quote) => void;
    onCollectionPress: (quoteId: string) => void;
    onLocalSavePress: (quote: Quote) => void;
    onMorePress: () => void;
}

function QuoteReelItem({
    quote,
    isLiked,
    backgroundImages,
    onToggleLike,
    onShare,
    onCollectionPress,
    onLocalSavePress,
    onMorePress,
}: QuoteReelItemProps) {
    /* -------------------- BACKGROUND IMAGE (HASHED) -------------------- */
    const bgImage = useMemo(() => {
        let hash = 0;
        for (let i = 0; i < quote.id.length; i++) {
            hash = (hash * 31 + quote.id.charCodeAt(i)) % backgroundImages.length;
        }
        return backgroundImages[hash];
    }, [quote.id, backgroundImages]);

    return (
        <View style={styles.container}>
            {/* 1. BACKGROUND */}
            <Image
                source={{ uri: bgImage }}
                style={styles.backgroundImage}
                resizeMode="cover"
            />

            <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.85)"]}
                style={styles.gradient}
            />

            {/* 2. RIGHT SIDEBAR */}
            <View style={styles.rightSidebar}>

                {/* LIKE */}
                <ActionButton
                    icon={isLiked ? "heart" : "heart-outline"}
                    label={isLiked ? STRINGS.home.liked : STRINGS.home.like}
                    color={isLiked ? "#FF4B4B" : "white"}
                    onPress={() => onToggleLike(quote.id)}
                />

                {/* COLLECT */}
                <CollectionActionButton
                    label={STRINGS.home.collect}
                    onPress={() => onCollectionPress(quote.id)}
                />

                 {/* SAVE */}
                <ActionButton
                    icon="download-outline"
                    label={STRINGS.home.save}
                    onPress={() => onLocalSavePress(quote)}
                />

                {/* SHARE */}
                <ActionButton
                    icon="share-social-outline"
                    label={STRINGS.home.share}
                    onPress={() => onShare(quote)}
                />

                {/* MORE */}
                <ActionButton
                    icon="ellipsis-horizontal"
                    label={STRINGS.home.more}
                    onPress={onMorePress}
                />
            </View>

            {/* 3. TEXT CONTENT */}
            <View style={styles.contentOverlay}>
                <View style={styles.centerTextWrapper}>
                    <ThemedText
                        variant="h1"
                        color="white"
                        style={styles.quoteText}
                    >
                        "{quote.text}"
                    </ThemedText>
                </View>

                {/* AUTHOR ROW */}
                <View style={styles.authorRow}>
                    <View style={styles.avatarPlaceholder}>
                        <ThemedText variant="h2" color="white">
                            {quote.author.charAt(0)}
                        </ThemedText>
                    </View>
                    <ThemedText
                        variant="button"
                        color="white"
                        style={styles.authorName}
                    >
                        {quote.author}
                    </ThemedText>
                </View>
            </View>
        </View>
    );
}

export default memo(QuoteReelItem);

/* -------------------- STYLES (UNCHANGED VISUALLY) -------------------- */

const styles = StyleSheet.create({
    container: {
        width,
        height,
        backgroundColor: "black",
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },

    /* RIGHT SIDEBAR */
    rightSidebar: {
        position: "absolute",
        right: 10,
        bottom: 70,
        zIndex: 10,
        alignItems: "center",
        gap: 20,
    },
    actionButton: {
        alignItems: "center",
    },

    /* TEXT CONTENT */
    contentOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 5,
        justifyContent: "space-between",
        padding: 20,
        paddingBottom: 40,
        paddingRight: 80,
    },
    centerTextWrapper: {
        flex: 1,
        justifyContent: "center",
    },
    quoteText: {
        fontSize: 32,
        lineHeight: 44,
        fontWeight: "bold",
        fontStyle: "italic",
        textShadowColor: "rgba(0,0,0,0.75)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },

    /* AUTHOR */
    authorRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 40,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FF6B6B",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        borderWidth: 1,
        borderColor: "white",
    },
    authorName: {
        fontSize: 16,
    },
});
