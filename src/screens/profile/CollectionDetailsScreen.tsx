import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ThemedView } from '@/components/common/ThemedView';
import { fetchCollectionDetails } from '@/services/collections.services';
import QuoteGrid from '@/components/common/QuoteGrid';
import { STRINGS } from '@/constants';

export default function CollectionDetailsScreen({ route, navigation }: any) {
  const { id, name } = route.params; // Get params passed from navigation
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set the header title dynamically to match the folder name
    navigation.setOptions({ title: name });
    
    loadData();
  }, [id]);

  const loadData = async () => {
    const { data } = await fetchCollectionDetails(id);
    if (data) setQuotes(data);
    setLoading(false);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
      ) : (
        // Reuse our new shared grid component!
        <QuoteGrid 
            data={quotes} 
            emptyMessage={STRINGS.collections.noQuotesInCollection}
        />
      )}
    </ThemedView>
  );
}