import { supabase } from '../lib/supabase';
import { Order, TransformedOrder } from '../types/order';

/**
 * Lấy danh sách đơn hàng của người dùng hiện tại
 * @returns Danh sách đơn hàng đã được chuyển đổi
 */
export const fetchOrders = async (): Promise<TransformedOrder[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
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

    if (error) throw error;

    // Chuyển đổi dữ liệu để phù hợp với định dạng mong muốn
    const transformedData = data.map(order => ({
      id: order.id,
      date: order.created_at,
      status: order.status,
      total: order.total,
      items: order.order_items.map(item => ({
        name: item.product.name,
        quantity: item.quantity
      }))
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
    const { data: { user } } = await supabase.auth.getUser();
    
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

    if (error) throw error;

    return data;
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
  addressId: string,
  paymentMethod: string,
  notes?: string
): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
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

    if (cartError) throw cartError;

    if (!cartItems || cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    // Tính tổng tiền hàng
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    // Tạo đơn hàng mới
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        address_id: addressId,
        status: 'pending',
        payment_status: 'pending',
        payment_method: paymentMethod,
        subtotal: subtotal,
        delivery_fee: 5.00, // Phí vận chuyển mặc định
        tax: subtotal * 0.1, // Thuế 10%
        discount: 0,
        total: subtotal + 5.00 + (subtotal * 0.1), // Tổng = tiền hàng + phí vận chuyển + thuế - giảm giá
        notes: notes
      })
      .select('id')
      .single();

    if (orderError) throw orderError;

    // Tạo các mục đơn hàng
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.product.price,
      subtotal: item.quantity * item.product.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Xóa giỏ hàng sau khi đặt hàng thành công
    const { error: clearCartError } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', user.id);

    if (clearCartError) throw clearCartError;

    return order.id;
  } catch (error: any) {
    console.error('Error creating order:', error.message);
    throw error;
  }
};
