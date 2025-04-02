import { supabase } from '../lib/supabase';
import { Category } from '../types/category';

/**
 * Lấy tất cả danh mục
 * @param includeInactive Có bao gồm danh mục không hoạt động hay không
 * @returns Danh sách danh mục
 */
export const fetchCategories = async (includeInactive: boolean = false): Promise<Category[]> => {
  try {
    let query = supabase.from('categories').select('*');
    
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error('Error fetching categories:', error.message);
    throw error;
  }
};

/**
 * Lấy danh mục theo ID
 * @param id ID của danh mục
 * @returns Thông tin danh mục
 */
export const fetchCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error fetching category by ID:', error.message);
    throw error;
  }
};
