import { supabase } from '../lib/supabase';
import { User } from '../types/user';

/**
 * Đăng nhập với email và mật khẩu
 * @param email Email của người dùng
 * @param password Mật khẩu của người dùng
 * @returns Thông tin người dùng
 */
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return data.user as User;
  } catch (error: any) {
    console.error('Error signing in:', error.message);
    throw error;
  }
};

/**
 * Đăng ký tài khoản mới
 * @param email Email của người dùng
 * @param password Mật khẩu của người dùng
 * @returns Thông tin người dùng
 */
export const signUp = async (email: string, password: string): Promise<User> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    return data.user as User;
  } catch (error: any) {
    console.error('Error signing up:', error.message);
    throw error;
  }
};

/**
 * Đăng xuất
 */
export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    console.error('Error signing out:', error.message);
    throw error;
  }
};

/**
 * Lấy thông tin người dùng hiện tại
 * @returns Thông tin người dùng hoặc null nếu chưa đăng nhập
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    return user as User;
  } catch (error: any) {
    console.error('Error getting current user:', error.message);
    return null;
  }
};
