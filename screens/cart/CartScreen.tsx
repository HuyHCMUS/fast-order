import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Import types
import { TransformedCartItem } from '../../types/cart';

// Import services
import { fetchCartItems, updateCartItemQuantity, removeCartItem } from '../../services/cartService';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<TransformedCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const data = await fetchCartItems();
      setCartItems(data);
    } catch (error: any) {
      console.error('Error fetching cart items:', error.message);
      Alert.alert('Error', 'Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      await updateCartItemQuantity(itemId, newQuantity);
      // Refresh cart items
      loadCartItems();
    } catch (error: any) {
      console.error('Error updating quantity:', error.message);
      Alert.alert('Error', 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeCartItem(itemId);
      // Refresh cart items
      loadCartItems();
    } catch (error: any) {
      console.error('Error removing item:', error.message);
      Alert.alert('Error', 'Failed to remove item');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Cart Items */}
        <View className="p-4">
          {cartItems.length === 0 ? (
            <View className="flex-1 justify-center items-center py-8">
              <Ionicons name="cart-outline" size={64} color="#ccc" />
              <Text className="text-gray-500 mt-4 text-lg">Your cart is empty</Text>
            </View>
          ) : (
            cartItems.map((item) => (
              <View
                key={item.id}
                className="flex-row bg-white rounded-lg p-4 mb-4 shadow-sm"
              >
                <Image
                  source={{ uri: item.image }}
                  className="w-20 h-20 rounded-lg"
                  resizeMode="cover"
                />
                <View className="flex-1 ml-4">
                  <Text className="font-semibold text-gray-800">{item.name}</Text>
                  <Text className="text-primary font-bold mt-1">
                    ${item.price.toFixed(2)}
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <TouchableOpacity
                      className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                      onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <Ionicons name="remove" size={20} color="#FF6B00" />
                    </TouchableOpacity>
                    <Text className="mx-4 font-bold">{item.quantity}</Text>
                    <TouchableOpacity
                      className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                      onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Ionicons name="add" size={20} color="#FF6B00" />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  className="p-2"
                  onPress={() => handleRemoveItem(item.id)}
                >
                  <Ionicons name="trash-outline" size={24} color="#FF4444" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {cartItems.length > 0 && (
        /* Order Summary */
        <View className="bg-white p-4 shadow-sm">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Subtotal</Text>
            <Text className="font-semibold">${subtotal.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-gray-600">Delivery Fee</Text>
            <Text className="font-semibold">${deliveryFee.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-6">
            <Text className="text-lg font-bold">Total</Text>
            <Text className="text-lg font-bold text-primary">
              ${total.toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            className="bg-primary rounded-lg p-4"
            onPress={() => navigation.navigate('Checkout' as never)}
          >
            <Text className="text-white text-center font-bold text-lg">
              Proceed to Checkout
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}