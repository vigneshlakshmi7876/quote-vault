import { Quote, QuoteCategory } from '@/domain';
import { supabase } from '@/lib/supabase';

const PAGE_SIZE = 10;


export const fetchQuotes = async (
  page: number,
  categories: string[] =[],
): Promise<{ data: Quote[] | null; error: any }> => {
  let query = supabase
    .from('quotes')
    .select('*')
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
    .order('created_at', { ascending: false });

  if (categories.length>0) {
    query = query.in('category', categories);
  }

  const { data, error } = await query;
  return { data, error };
};
