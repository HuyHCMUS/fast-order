import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const paymentMethods = [
  { id: 'cash', name: 'Cash on Delivery', icon: 'cash-outline' },
  { id: 'card', name: 'Credit Card', icon: 'card-outline' },
];

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const [address, setAddress] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('cash');

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter your delivery address');
      return;
    }

    // Order placement logic will be added later
    Alert.alert(
      'Success',
      'Your order has been placed successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Orders'  as never);
          },
        },
      ]
    );
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
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Subtotal</Text>
            <Text className="font-semibold">$24.97</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Delivery Fee</Text>
            <Text className="font-semibold">$2.99</Text>
          </View>
          <View className="flex-row justify-between mb-2 pt-2 border-t border-gray-200">
            <Text className="text-lg font-bold">Total</Text>
            <Text className="text-lg font-bold text-primary">$27.96</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View className="p-4 bg-white">
        <TouchableOpacity
          className="bg-primary rounded-lg p-4"
          onPress={handlePlaceOrder}
        >
          <Text className="text-white text-center font-bold text-lg">
            Place Order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 