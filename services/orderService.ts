import { supabase } from '../lib/supabase';
import { Order, OrderStatus, PaymentMethod, PaymentStatus, TransformedOrder } from '../types/order';

// Định nghĩa các type cho dữ liệu trả về từ Supabase
type SupabaseOrderItem = {
  id: string;
  quantity: number;
  product?: {
    name?: string;
  };
};

type SupabaseCartItem = {
  id: string;
  quantity: number;
  product?: {
    id?: string;
    price?: number;
  };
};

/**
 * Lấy danh sách đơn hàng của người dùng hiện tại
 * @returns Danh sách đơn hàng đã được chuyển đổi
 */
export const fetchOrders = async (): Promise<TransformedOrder[]> => {
  try {
    // Kiểm tra xác thực người dùng
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Authentication error:', authError.message);
      throw new Error('Authentication failed. Please login again.');
    }

    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        status,
        total,
        order_items (
          id,
          quantity,
          product:products (
            name
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error.message);
      if (error.message.includes('permission denied')) {
        throw new Error('Permission denied: You do not have access to your orders. This is a Supabase RLS issue.');
      }
      throw error;
    }

    // Nếu không có dữ liệu, trả về mảng rỗng
    if (!data || data.length === 0) {
      return [];
    }

    // Chuyển đổi dữ liệu để phù hợp với định dạng mong muốn
    const transformedData = (data as any[]).map(order => ({
      id: order.id,
      date: order.created_at,
      status: order.status,
      total: order.total,
      items: order.order_items ? order.order_items.map((item: SupabaseOrderItem) => ({
        name: item.product ? item.product.name : 'Unknown Product',
        quantity: item.quantity
      })) : []
    }));

    return transformedData;
  } catch (error: any) {
    console.error('Error fetching orders:', error.message);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết đơn hàng theo ID
 * @param orderId ID của đơn hàng
 * @returns Thông tin chi tiết đơn hàng
 */
export const fetchOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    // Kiểm tra xác thực người dùng
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Authentication error:', authError.message);
      throw new Error('Authentication failed. Please login again.');
    }

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          unit_price,
          subtotal,
          product:products (
            id,
            name,
            image_url
          )
        )
      `)
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching order by ID:', error.message);
      if (error.message.includes('permission denied')) {
        throw new Error('Permission denied: You do not have access to this order. This is a Supabase RLS issue.');
      }
      throw error;
    }

    return data as Order;
  } catch (error: any) {
    console.error('Error fetching order by ID:', error.message);
    throw error;
  }
};

/**
 * Tạo đơn hàng mới
 * @param orderData Dữ liệu đơn hàng
 * @returns ID của đơn hàng mới
 */
export const createOrder = async (
  addressId: string | null,
  paymentMethod: string,
  notes?: string
): Promise<string> => {
  try {
    // Kiểm tra xác thực người dùng
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Authentication error:', authError.message);
      throw new Error('Authentication failed. Please login again.');
    }

    if (!user) {
      throw new Error('User not authenticated. Please login to place an order.');
    }

    // Lấy các mục trong giỏ hàng
    const { data: cartItems, error: cartError } = await supabase
      .from('cart')
      .select(`
        id,
        quantity,
        product:products (
          id,
          price
        )
      `)
      .eq('user_id', user.id);

    if (cartError) {
      console.error('Error fetching cart items:', cartError.message);
      if (cartError.message.includes('permission denied')) {
        throw new Error('Permission denied: You do not have access to your cart. This is a Supabase RLS issue.');
      }
      throw cartError;
    }

    if (!cartItems || cartItems.length === 0) {
      throw new Error('Your cart is empty. Please add items to your cart before placing an order.');
    }

    // Chuyển đổi dữ liệu để đảm bảo đúng kiểu
    const typedCartItems = cartItems as SupabaseCartItem[];

    // Tính tổng tiền hàng
    const subtotal = typedCartItems.reduce(
      (sum, item) => sum + item.quantity * (item.product?.price || 0),
      0
    );

    // Tạo đơn hàng mới
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        address: addressId,
        status: 'pending' as OrderStatus,
        payment_status: 'pending' as PaymentStatus,
        payment_method: paymentMethod as PaymentMethod,
        subtotal: subtotal,
        delivery_fee: 5.00, // Phí vận chuyển mặc định
        tax: subtotal * 0.1, // Thuế 10%
        discount: 0,
        total: subtotal + 5.00 + (subtotal * 0.1), // Tổng = tiền hàng + phí vận chuyển + thuế - giảm giá
        notes: notes
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError.message);
      if (orderError.message.includes('permission denied')) {
        throw new Error('Permission denied: You do not have permission to create orders. This is a Supabase RLS issue.');
      }
      throw orderError;
    }

    if (!order || !order.id) {
      throw new Error('Failed to create order: No order ID returned');
    }

    // Tạo các mục đơn hàng
    const orderItems = typedCartItems.map(item => ({
      order_id: order.id,
      product_id: item.product?.id || '',
      quantity: item.quantity,
      unit_price: item.product?.price || 0,
      subtotal: item.quantity * (item.product?.price || 0)
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError.message);
      if (itemsError.message.includes('permission denied')) {
        throw new Error('Permission denied: You do not have permission to create order items. This is a Supabase RLS issue.');
      }
      throw itemsError;
    }

    // Xóa giỏ hàng sau khi đặt hàng thành công
    const { error: clearCartError } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', user.id);

    if (clearCartError) {
      console.error('Error clearing cart:', clearCartError.message);
      // Không throw lỗi ở đây vì đơn hàng đã được tạo thành công
      console.warn('Cart could not be cleared, but order was created successfully');
    }

    return order.id;
  } catch (error: any) {
    console.error('Error creating order:', error.message);
    throw error;
  }
};
