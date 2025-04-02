export interface Category {
  id: string | null;
  name: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
}
