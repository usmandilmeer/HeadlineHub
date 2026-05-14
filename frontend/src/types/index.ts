export interface Article {
  id: number;
  article_id: string;
  title: string;
  description: string | null;
  url: string;
  image_url: string | null;
  source: string | null;
  category: string;
  published_at: string | null;
  cached_at: string;
  saved_at?: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
