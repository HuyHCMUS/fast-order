import { supabase } from '../lib/supabase';
import { CartItem, TransformedCartItem } from '../types/cart';
import { User } from '../types/user';

/**
 * Lấy các mục trong giỏ hàng của người dùng
 * @returns Danh sách các mục trong giỏ hàng đã được chuyển đổi
 */
export const fetchCartItems = async (): Promise<TransformedCartItem[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('cart')
      .select(`
        id,
        quantity,
        product:products (
          id,
          name,
          price,
          image_url
        )
      `)
      .eq('user_id', user.id);

    if (error) throw error;

    // Chuyển đổi dữ liệu để phù hợp với định dạng mong muốn
    const transformedData = data.map(item => ({
      id: item.id,
      product_id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image_url
    }));

    return transformedData;
  } catch (error: any) {
    console.error('Error fetching cart items:', error.message);
    throw error;
  }
};

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param productId ID của sản phẩm
 * @param quantity Số lượng (mặc định: 1)
 * @returns Thông báo thành công
 */
export const addToCart = async (productId: string, quantity: number = 1): Promise<string> => {
  try {
    // Kiểm tra xác thực người dùng
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error:', authError.message);
      throw new Error('Authentication error. Please try again.');
    }
    
    if (!user) {
      throw new Error('Please login to add items to cart');
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const { data: existingItem, error: checkError } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    // Xử lý lỗi PGRST116 (không tìm thấy bản ghi) một cách riêng biệt
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking cart:', checkError.message);
      throw checkError;
    }

    if (existingItem) {
      // Cập nhật số lượng nếu sản phẩm đã tồn tại
      const { error: updateError } = await supabase
        .from('cart')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);
      
      if (updateError) {
        console.error('Error updating cart:', updateError.message);
        throw updateError;
      }
    } else {
      // Thêm sản phẩm mới nếu chưa tồn tại
      const { error: insertError } = await supabase
        .from('cart')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity: quantity
        });
      
      if (insertError) {
        console.error('Error inserting to cart:', insertError.message);
        throw insertError;
      }
    }
    
    return 'Added to cart!';
  } catch (error: any) {
    console.error('Error adding to cart:', error.message);
    // Chỉ hiển thị thông báo lỗi nếu không phải lỗi PGRST116 (không tìm thấy bản ghi)
    if (error.code !== 'PGRST116') {
      throw new Error('Failed to add item to cart');
    }
    throw error;
  }
};

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 * @param itemId ID của mục trong giỏ hàng
 * @param newQuantity Số lượng mới
 */
export const updateCartItemQuantity = async (itemId: string, newQuantity: number): Promise<void> => {
  try {
    if (newQuantity < 1) {
      // Xóa mục nếu số lượng nhỏ hơn 1
      await removeCartItem(itemId);
      return;
    }

    const { error } = await supabase
      .from('cart')
      .update({ quantity: newQuantity })
      .eq('id', itemId);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error updating quantity:', error.message);
    throw new Error('Failed to update quantity');
  }
};

/**
 * Xóa mục khỏi giỏ hàng
 * @param itemId ID của mục trong giỏ hàng
 */
export const removeCartItem = async (itemId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error removing item:', error.message);
    throw new Error('Failed to remove item');
  }
};
