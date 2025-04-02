import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Import types
import { TransformedCartItem } from '../../types/cart';
import { PaymentMethod } from '../../types/order';

// Import services
import { fetchCartItems } from '../../services/cartService';
import { createOrder } from '../../services/orderService';

const paymentMethods = [
  { id: 'cash' as PaymentMethod, name: 'Cash on Delivery', icon: 'cash-outline' },
  { id: 'credit_card' as PaymentMethod, name: 'Credit Card', icon: 'card-outline' },
  { id: 'bank_transfer' as PaymentMethod, name: 'Bank Transfer', icon: 'wallet-outline' },
];

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const [address, setAddress] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cash');
  const [cartItems, setCartItems] = useState<TransformedCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

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

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter your delivery address');
      return;
    }

    try {
      setPlacingOrder(true);
      // In a real app, we would create an address first and get its ID
      // For now, we'll use null for address_id
      const addressId = null;

      await createOrder(addressId, selectedPayment, 'Order from mobile app');

      // Hiển thị thông báo ngắn gọn và tự động chuyển sang tab Orders
      Alert.alert('Success', 'Your order has been placed successfully!');

      // Chuyển sang tab Orders
      navigation.reset({
        index: 0,
        routes: [{ name: 'Orders' as never }],
      });
    } catch (error: any) {
      console.error('Error placing order:', error.message);
      Alert.alert('Error', error.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Delivery Address */}
        <View className="bg-white p-4 mb-4">
          <Text className="text-lg font-bold mb-4">Delivery Address</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 bg-gray-50"
            placeholder="Enter your delivery address"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Payment Method */}
        <View className="bg-white p-4 mb-4">
          <Text className="text-lg font-bold mb-4">Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              className={`flex-row items-center p-4 border rounded-lg mb-2 ${
                selectedPayment === method.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200'
              }`}
              onPress={() => setSelectedPayment(method.id)}
            >
              <Ionicons
                name={method.icon as any}
                size={24}
                color={selectedPayment === method.id ? '#FF6B00' : '#666'}
              />
              <Text
                className={`ml-3 ${
                  selectedPayment === method.id
                    ? 'text-primary font-semibold'
                    : 'text-gray-600'
                }`}
              >
                {method.name}
              </Text>
              {selectedPayment === method.id && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#FF6B00"
                  style={{ marginLeft: 'auto' }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary */}
        <View className="bg-white p-4">
          <Text className="text-lg font-bold mb-4">Order Summary</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#FF6B6B" />
          ) : (
            <>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Subtotal</Text>
                <Text className="font-semibold">
                  ${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Delivery Fee</Text>
                <Text className="font-semibold">$5.00</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Tax (10%)</Text>
                <Text className="font-semibold">
                  ${(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.1).toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2 pt-2 border-t border-gray-200">
                <Text className="text-lg font-bold">Total</Text>
                <Text className="text-lg font-bold text-primary">
                  ${(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 5.00 +
                    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.1).toFixed(2)}
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View className="p-4 bg-white">
        <TouchableOpacity
          className={`bg-primary rounded-lg p-4 ${(loading || placingOrder) ? 'opacity-70' : ''}`}
          onPress={handlePlaceOrder}
          disabled={loading || placingOrder || cartItems.length === 0}
        >
          <Text className="text-white text-center font-bold text-lg">
            {placingOrder ? 'Placing Order...' : 'Place Order'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}