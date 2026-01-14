import {
  FlatList,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Alert,
  Share,
} from "react-native";
import { useEffect, useState, useCallback } from "react";


import { fetchQuotes } from "@/services/quotes.services";
import { fetchLikedQuotes, toggleFavorite } from "@/services/favorites.services";
import { Quote } from "@/domain";
import { useAuth } from "@/app/providers/AuthProvider";

import { ThemedView } from "@/components/common/ThemedView";
import QuoteReelItem from "@/components/quote/QuoteReelItem";
import CategoryPopup from "@/components/quote/CategoryPopup";
import AddToCollectionSheet from "@/components/quote/AddToCollections";
import DownloadModal from "@/components/quote/DownloadModal";
import { STRINGS } from "@/constants";

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
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(0);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sheetQuoteId, setSheetQuoteId] = useState<string | null>(null);
  const [downloadQuote, setDownloadQuote] = useState<Quote | null>(null);

  /* -------------------- FETCH LIKED MAP ONCE -------------------- */
  useEffect(() => {
    if (!session?.user) return;

    fetchLikedQuotes(session.user.id)
      .then(({ data, error }) => { 
        if (error || !data) {
          Alert.alert(STRINGS.errors.generalTitle,STRINGS.errors.favoriteUpdate);
          return;
        }

        const map: Record<string, boolean> = {};
        data.forEach((id) => (map[id] = true));

        setLikedMap(map);
      })
      .catch((e) => {
        Alert.alert(STRINGS.errors.generalTitle, STRINGS.errors.favoriteUpdate);
      });
  }, [session?.user]);

  /* -------------------- INITIAL LOAD / FILTER CHANGE -------------------- */

  useEffect(() => {
    loadInitialQuotes();
  }, [selectedFilters]);

  const loadInitialQuotes = async () => {
    try {
      if (loading || refreshing) return;

      setLoading(true);
      setPage(0);

      const { data, error } = await fetchQuotes(0, selectedFilters);
      if (data) {
        setQuotes(data);
        setPage(1);
      }

      if (error) {
        Alert.alert(STRINGS.errors.generalTitle, STRINGS.errors.failedToLoadQuotes);
      }
    } catch {
      Alert.alert(STRINGS.errors.generalTitle, STRINGS.errors.failedToLoadQuotes);

    } finally {

      setLoading(false);
    }
  };

  /* -------------------- REFRESH -------------------- */

  const handleRefresh = async () => {
    try {
      if (refreshing || loading) return;

      setRefreshing(true);
      setPage(0);

      const { data, error } = await fetchQuotes(0, selectedFilters);
      if (data) {
        setQuotes(data);
        setPage(1);
      }

      if (error) {
        Alert.alert(STRINGS.errors.generalTitle, STRINGS.errors.failedToLoadQuotes);
      }
    } catch (e) {
      Alert.alert(STRINGS.errors.generalTitle, STRINGS.errors.failedToLoadQuotes);
    }
    finally {
      setRefreshing(false);
    }
  };

  /* -------------------- PAGINATION -------------------- */

  const loadMoreQuotes = async () => {
    if (loading || refreshing) return;

    setLoading(true);
    const { data } = await fetchQuotes(page, selectedFilters);

    if (data?.length) {
      setQuotes((prev) => [...prev, ...data]);
      setPage((p) => p + 1);
    }

    setLoading(false);
  };

  /* -------------------- ACTION HANDLERS -------------------- */

  const handleToggleLike = useCallback(
    async (quoteId: string) => {
      if (!session?.user) {
        Alert.alert(STRINGS.errors.loginRequired, STRINGS.errors.loginRequiredMessage);
        return;
      }

      setLikedMap((prev) => ({
        ...prev,
        [quoteId]: !prev[quoteId],
      }));

      const { error } = await toggleFavorite(session.user.id, quoteId);

      if (error) {
        setLikedMap((prev) => ({
          ...prev,
          [quoteId]: !prev[quoteId],
        }));
        Alert.alert(STRINGS.errors.generalTitle, STRINGS.errors.favoriteUpdate);
      }
    },
    [session?.user]
  );

  const handleShare = useCallback(async (quote: Quote) => {
    await Share.share({
      message: `"${quote.text}"\n\n— ${quote.author}`,
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Quote }) => (
      <QuoteReelItem
        quote={item}
        isLiked={!!likedMap[item.id]}
        backgroundImages={BACKGROUND_IMAGES}
        onToggleLike={handleToggleLike}
        onShare={handleShare}
        onCollectionPress={(id) => setSheetQuoteId(id)}
        onLocalSavePress={setDownloadQuote}
        onMorePress={() => setShowFilterPopup(true)}
      />
    ),
    [likedMap, handleToggleLike, handleShare]
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={quotes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        pagingEnabled
        snapToInterval={height}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={loadMoreQuotes}
        onEndReachedThreshold={0.7}
        initialNumToRender={1}
        maxToRenderPerBatch={3}
        windowSize={3}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
      />

      <AddToCollectionSheet
        visible={!!sheetQuoteId}
        onClose={() => setSheetQuoteId(null)}
        userId={session?.user.id || ""}
        quoteId={sheetQuoteId || ""}
      />

      <CategoryPopup
        visible={showFilterPopup}
        onClose={() => setShowFilterPopup(false)}
        selectedCategories={selectedFilters}
        onApplyFilter={setSelectedFilters}
      />

      {downloadQuote && (
        <DownloadModal
          visible
          onClose={() => setDownloadQuote(null)}
          quote={downloadQuote}
          backgroundImages={BACKGROUND_IMAGES}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
