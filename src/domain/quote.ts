export type QuoteCategory =
  | 'Motivation'
  | 'Love'
  | 'Success'
  | 'Wisdom'
  | 'Humor';

export interface Quote {
  id: string;
  text: string;
  author: string;
  category: QuoteCategory;
  created_at: string;
}
