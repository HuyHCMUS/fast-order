export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at?: string;
  updated_at?: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
  };
}

export interface TransformedCartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
