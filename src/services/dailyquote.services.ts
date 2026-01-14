import { supabase } from "@/lib/supabase"; 
import { Quote } from "@/domain/quote";

export const getDailyQuote = async (userId: string): Promise<{ data: Quote | null; error: any }> => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 1. CHECK: Do we already have a quote for today?
    const { data: existingEntry, error: fetchError } = await supabase
      .from('user_daily_quotes')
      .select('quotes (*)')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existingEntry && existingEntry.quotes) {
      // @ts-ignore
      return { data: existingEntry.quotes as Quote, error: null };
    }

    // 2. FETCH NEW: Call the Database Function
    // The RPC function doesn't know the return type automatically, so 'newQuote' is inferred as {}
    const { data: newQuote, error: rpcError } = await supabase
      .rpc('get_random_unique_quote', { user_uuid: userId })
      .maybeSingle();

    if (rpcError) throw rpcError;

    // 3. FALLBACK Logic
    let result: { quote: Quote; saveToHistory: boolean };

    if (!newQuote) {
      // Fallback: Fetch random from table
      const { data: fallback } = await supabase.from('quotes').select('*').limit(1).single();
      
      if (!fallback) return { data: null, error: "No quotes in database." };
      
      // FIX 1: Cast fallback to Quote just in case
      result = { quote: fallback as Quote, saveToHistory: false };
    } else {
      // FIX 2: Explicitly cast 'newQuote' to 'Quote' to fix the error
      result = { quote: newQuote as Quote, saveToHistory: true };
    }

    const { quote: finalQuote, saveToHistory } = result;

    // 4. SAVE
    if (saveToHistory) {
        const { error: insertError } = await supabase
        .from('user_daily_quotes')
        .insert({
            user_id: userId,
            quote_id: finalQuote.id,
            date: today,
        });

        if (insertError && insertError.code !== '23505') {
            console.warn("Error saving history:", insertError);
        }
    }

    return { data: finalQuote, error: null };

  } catch (error: any) {
    console.error("Error getting daily quote:", error);
    return { data: null, error: error.message };
  }
};