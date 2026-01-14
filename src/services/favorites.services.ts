import { supabase } from "@/lib/supabase"; // Your supabase client

export const toggleFavorite = async (userId: string, quoteId: string) => {
  try {
    // 1. Check if it's already favorited
    const { data: existing } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .eq("quote_id", quoteId)
      .single();

    if (existing) {
      // 2. If exists -> DELETE (Un-like)
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", existing.id);
      
      return { data: null, isLiked: false, error };
    } else {
      // 3. If not exists -> INSERT (Like)
      const { data, error } = await supabase
        .from("favorites")
        .insert([{ user_id: userId, quote_id: quoteId }])
        .select()
        .single();
        
      return { data, isLiked: true, error };
    }
  } catch (error: any) {
    return { data: null, isLiked: false, error: error.message };
  }
};

export const checkIsLiked = async (userId: string, quoteId: string) => {
    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("quote_id", quoteId)
      .single();
    return !!data;
};

export const fetchUserFavorites = async (userId: string) => {
  // We join the 'favorites' table with the 'quotes' table
  // NOTE: This assumes you set up a Foreign Key in Supabase. 
  // If not, we can do a manual two-step fetch.
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      id,
      quote:quotes (
        id,
        text,
        author
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return { data: null, error };
  
  // Flatten the structure for easier UI consumption
  const formattedData = data.map((item: any) => ({
    favoriteId: item.id,
    ...item.quote // Spreads id, text, author
  }));

  return { data: formattedData, error: null };
};

export const fetchLikedQuotes = async (userId: string) => {
  const { data, error } = await supabase
    .from("favorites")
    .select("quote_id")
    .eq("user_id", userId);

  if (error) {
    return { data: [], error };
  }

  // Return as array of quote IDs
  return {
    data: data.map((item) => item.quote_id),
    error: null,
  };
};