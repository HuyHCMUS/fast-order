import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Temporary data - will be replaced with actual cart data later
const cartItems = [
  {
    id: '1',
    name: 'Beef Burger',
    price: 8.99,
    quantity: 2,
    image: 'https://placehold.co/200x200',
  },
  {
    id: '2',
    name: 'Caesar Salad',
    price: 6.99,
    quantity: 1,
    image: 'https://placehold.co/200x200',
  },
];

export default function CartScreen() {
  const navigation = useNavigation();
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Cart Items */}
        <View className="p-4">
          {cartItems.map((item) => (
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
                    onPress={() => {
                      // Update quantity functionality will be added later
                    }}
                  >
                    <Ionicons name="remove" size={20} color="#FF6B00" />
                  </TouchableOpacity>
                  <Text className="mx-4 font-bold">{item.quantity}</Text>
                  <TouchableOpacity
                    className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                    onPress={() => {
                      // Update quantity functionality will be added later
                    }}
                  >
                    <Ionicons name="add" size={20} color="#FF6B00" />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                className="p-2"
                onPress={() => {
                  // Remove item functionality will be added later
                }}
              >
                <Ionicons name="trash-outline" size={24} color="#FF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Order Summary */}
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
          onPress={() => navigation.navigate('Checkout'  as never)}
        >
          <Text className="text-white text-center font-bold text-lg">
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 