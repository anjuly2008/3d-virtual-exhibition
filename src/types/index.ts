export interface Exhibit {
  id: number;
  title: string;
  description: string;
  creator_id: number;
  creator_name: string;
  creator_avatar?: string | null;
  category: string;
  model_url: string;
  thumbnail_url: string;
  status: string;
  likes: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar_url: string | null;
  created_at: string;
}