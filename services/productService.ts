import { supabase } from '../lib/supabase';
import { Product } from '../types/product';

/**
 * Lấy tất cả sản phẩm
 * @param categoryId ID của danh mục (tùy chọn)
 * @param searchQuery Từ khóa tìm kiếm (tùy chọn)
 * @param onlyAvailable Chỉ lấy sản phẩm có sẵn (mặc định: true)
 * @returns Danh sách sản phẩm
 */
export const fetchProducts = async (
  categoryId?: string | null,
  searchQuery?: string,
  onlyAvailable: boolean = true
): Promise<Product[]> => {
  try {
    let query = supabase.from('products').select('*');
    
    if (onlyAvailable) {
      query = query.eq('is_available', true);
    }
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error('Error fetching products:', error.message);
    throw error;
  }
};

/**
 * Lấy sản phẩm theo ID
 * @param id ID của sản phẩm
 * @returns Thông tin sản phẩm
 */
export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error fetching product by ID:', error.message);
    throw error;
  }
};

/**
 * Lấy các sản phẩm nổi bật
 * @param limit Số lượng sản phẩm tối đa
 * @returns Danh sách sản phẩm nổi bật
 */
export const fetchFeaturedProducts = async (limit: number = 10): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .eq('is_featured', true)
      .order('name')
      .limit(limit);
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error('Error fetching featured products:', error.message);
    throw error;
  }
};
