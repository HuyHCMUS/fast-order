import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'processing':
      return 'bg-blue-500';
    case 'delivering':
      return 'bg-yellow-500';
    case 'delivered':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'processing':
      return 'Processing';
    case 'delivering':
      return 'Out for Delivery';
    case 'delivered':
      return 'Delivered';
    default:
      return status;
  }
};

export default function OrderDetailScreen() {
  const route = useRoute();
  const { order } = route.params as { order: any };

  const handleContact = () => {
    Linking.openURL('tel:+1234567890');
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Order Status */}
      <View className="bg-white p-4 mb-4">
        <Text className="text-lg font-bold mb-4">Order Status</Text>
        <View className="flex-row items-center">
          <View
            className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(order.status)}`}
          />
          <Text className="text-gray-800 text-lg">
            {getStatusText(order.status)}
          </Text>
        </View>
      </View>

      {/* Order Details */}
      <View className="bg-white p-4 mb-4">
        <Text className="text-lg font-bold mb-4">Order Details</Text>
        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Order Number</Text>
            <Text className="font-semibold">#{order.id}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Date</Text>
            <Text className="font-semibold">
              {new Date(order.date).toLocaleDateString()}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Total Amount</Text>
            <Text className="font-semibold text-primary">
              ${order.total.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Order Items */}
      <View className="bg-white p-4 mb-4">
        <Text className="text-lg font-bold mb-4">Order Items</Text>
        <View className="space-y-2">
          {order.items.map((item: any, index: number) => (
            <View
              key={index}
              className="flex-row justify-between items-center py-2 border-b border-gray-100 last:border-0"
            >
              <View className="flex-row items-center">
                <Text className="text-gray-800">{item.name}</Text>
              </View>
              <Text className="text-gray-600">x{item.quantity}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Contact Support */}
      <View className="bg-white p-4">
        <TouchableOpacity
          onPress={handleContact}
          className="flex-row items-center justify-center space-x-2"
        >
          <Ionicons name="call-outline" size={24} color="#FF6B00" />
          <Text className="text-primary font-semibold">Contact Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 