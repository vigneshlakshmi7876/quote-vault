import {
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";

import { fetchQuotes } from "@/services/quotes.services";
import { Quote } from "@/domain";
import { useAuth } from "@/app/providers/AuthProvider";

import { ThemedView } from "@/components/common/ThemedView";
import { ThemedText } from "@/components/common/ThemedText";
import QuoteReelItem from "@/components/quote/QuoteReelItem";
import CategoryPopup from "@/components/quote/CategoryPopup";
import AddToCollectionSheet from "@/components/quote/AddToCollections";
import DownloadModal from "@/components/quote/DownloadModal";

const { height } = Dimensions.get("window");

const BACKGROUND_IMAGES = [
  "https://agmrjgtagvmermxlrqpv.supabase.co/storage/v1/object/public/quote-backdrops/v1/leafOnWater.jpg",
  "https://agmrjgtagvmermxlrqpv.supabase.co/storage/v1/object/public/quote-backdrops/v1/lotusRiverSide.jpg",
  "https://agmrjgtagvmermxlrqpv.supabase.co/storage/v1/object/public/quote-backdrops/v1/seaShore.jpg",
  "https://agmrjgtagvmermxlrqpv.supabase.co/storage/v1/object/public/quote-backdrops/v1/sunSet.jpg",
  "https://agmrjgtagvmermxlrqpv.supabase.co/storage/v1/object/public/quote-backdrops/v1/yellowFlower.jpg",
];

export default function HomeScreen() {
  const { session } = useAuth();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [page, setPage] = useState(0);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sheetQuoteId, setSheetQuoteId] = useState<string | null>(null);
  const [downloadQuote, setDownloadQuote] = useState<Quote | null>(null);
  /* -------------------- INITIAL LOAD / FILTER CHANGE -------------------- */

  useEffect(() => {
    loadInitialQuotes();
  }, [selectedFilters]);

  const loadInitialQuotes = async () => {
    if (loading || refreshing) return;

    setLoading(true);
    setPage(0);

    const { data, error } = await fetchQuotes(0, selectedFilters);

    if (!error && data) {
      setQuotes(data);
      setPage(1);
    }

    setLoading(false);
  };

  /* -------------------- PULL TO REFRESH -------------------- */

  const handleRefresh = async () => {
    if (refreshing || loading) return;

    setRefreshing(true);
    setPage(0);

    const { data, error } = await fetchQuotes(0, selectedFilters);

    if (!error && data) {
      setQuotes(data);
      setPage(1);
    }

    setRefreshing(false);
  };

  /* -------------------- INFINITE SCROLL -------------------- */

  const loadMoreQuotes = async () => {
    if (loading || refreshing) return;

    setLoading(true);

    const { data, error } = await fetchQuotes(page, selectedFilters);

    if (!error && data && data.length > 0) {
      setQuotes((prev) => {
        const existingIds = new Set(prev.map((q) => q.id));
        const newQuotes = data.filter((q) => !existingIds.has(q.id));
        return [...prev, ...newQuotes];
      });

      setPage((prev) => prev + 1);
    }

    setLoading(false);
  };

  /* -------------------- ACTION HANDLERS -------------------- */

  const handleSavePress = (quoteId: string) => {
    if (!session?.user) {
      Alert.alert("Login Required", "Please login to save quotes.");
      return;
    }
    setSheetQuoteId(quoteId);
  };

  const handleLocalSave = (quote: Quote) => {
    setDownloadQuote(quote);
  };

  /* -------------------- RENDER -------------------- */

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={quotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuoteReelItem
            quote={item}
            backgroundImages={BACKGROUND_IMAGES}
            onCollectionPress={handleSavePress}
            onMorePress={() => setShowFilterPopup(true)}
            onLocalSavePress={handleLocalSave}
          />
        )}
        pagingEnabled
        snapToAlignment="center"
        snapToInterval={height}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={loadMoreQuotes}
        onEndReachedThreshold={0.7}
        ListFooterComponent={
          loading && !refreshing ? (
            <ActivityIndicator size="large" />
          ) : null
        }
        ListEmptyComponent={
          !loading && !refreshing ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color="#555" />
              <ThemedText
                variant="h3"
                style={{ marginTop: 16, textAlign: "center" }}
              >
                No quotes found
              </ThemedText>
              <ThemedText
                variant="body"
                style={{ marginTop: 8, textAlign: "center", opacity: 0.6 }}
              >
                Try adjusting your filters
              </ThemedText>
            </View>
          ) : null
        }
      />

      {session && (
        <AddToCollectionSheet
          visible={!!sheetQuoteId}
          onClose={() => setSheetQuoteId(null)}
          userId={session.user.id}
          quoteId={sheetQuoteId || ""}
        />
      )}

      <CategoryPopup
        visible={showFilterPopup}
        onClose={() => setShowFilterPopup(false)}
        selectedCategories={selectedFilters}
        onApplyFilter={setSelectedFilters}
      />

      {downloadQuote && (
        <DownloadModal
          visible={!!downloadQuote}
          onClose={() => setDownloadQuote(null)}
          quote={downloadQuote}
          backgroundImages={BACKGROUND_IMAGES}
        />
      )}
      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    height,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
});
