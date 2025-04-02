export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cash' | 'credit_card' | 'bank_transfer' | 'e_wallet';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  notes?: string;
  product?: {
    name: string;
    image_url?: string;
  };
}

export interface Order {
  id: string;
  user_id: string;
  address_id?: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  subtotal: number;
  delivery_fee: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface TransformedOrder {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: {
    name: string;
    quantity: number;
  }[];
}
