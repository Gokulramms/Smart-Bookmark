export interface Bookmark {
  id: string;
  user_id: string;
  url: string;
  title: string;
  summary: string | null;
  category: string | null;
  tags: string[] | null;
  favicon_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      bookmarks: {
        Row: Bookmark;
        Insert: Omit<Bookmark, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Bookmark, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

export interface AddBookmarkInput {
  url: string;
  title?: string;
}

export interface AIGeneratedData {
  title?: string;
  summary?: string;
  category?: string;
  tags?: string[];
  isDuplicate?: boolean;
  duplicateBookmark?: Bookmark | null;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export type BookmarkCategory = 
  | 'Work'
  | 'Personal'
  | 'Research'
  | 'Shopping'
  | 'Entertainment'
  | 'News'
  | 'Education'
  | 'Tools'
  | 'Social'
  | 'Other';
