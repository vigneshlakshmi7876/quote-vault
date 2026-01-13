import { supabase } from "@/lib/supabase";

// 1. Fetch all collections for a specific user
export const fetchUserCollections = async (userId: string) => {
  const { data, error } = await supabase
    .from('collections')
    .select(`
      *,
      collection_quotes (count)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
    // Format the data to make "count" easily accessible
  const formattedData = data?.map((item: any) => ({
    ...item,
    count: item.collection_quotes?.[0]?.count || 0
  }));
    
  return { data:formattedData, error };
};

// 2. Fetch Quotes INSIDE a specific collection
export const fetchCollectionDetails = async (collectionId: string) => {
  const { data, error } = await supabase
    .from('collection_quotes')
    .select(`
      quote:quotes (
        id,
        text,
        author
      )
    `)
    .eq('collection_id', collectionId);

  // Flatten the structure
  const formattedData = data?.map((item: any) => item.quote) || [];

  return { data: formattedData, error };
};

//3. Create a new collection (e.g., "Motivational")
export const createCollection = async (userId: string, name: string) => {
  const { data, error } = await supabase
    .from('collections')
    .insert([{ user_id: userId, name: name }])
    .select()
    .single();

  return { data, error };
};

// 3. Add a quote to a specific collection
export const addQuoteToCollection = async (collectionId: string, quoteId: string) => {
  const { error } = await supabase
    .from('collection_quotes')
    .insert([{ collection_id: collectionId, quote_id: quoteId }])
    .select();

    if (error && error.code === '23505') {
    return { error: null, isDuplicate: true };
  }
  console.log('error',error);
  return { error };
};