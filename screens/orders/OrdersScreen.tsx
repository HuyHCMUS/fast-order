import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Temporary data - will be replaced with actual orders data later
const orders = [
  {
    id: '1',
    date: '2024-04-02',
    status: 'processing',
    total: 27.96,
    items: [
      { name: 'Beef Burger', quantity: 2 },
      { name: 'Caesar Salad', quantity: 1 },
    ],
  },
  {
    id: '2',
    date: '2024-04-01',
    status: 'delivered',
    total: 35.97,
    items: [
      { name: 'Chicken Wings', quantity: 2 },
      { name: 'Coke', quantity: 3 },
    ],
  },
];

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

export default function OrdersScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {orders.map((order) => (
          <TouchableOpacity
            key={order.id}
            className="bg-white rounded-lg p-4 mb-4 shadow-sm"
            onPress={() => navigation.navigate('OrderDetail', { order })}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600">
                Order #{order.id}
              </Text>
              <Text className="text-gray-600">
                {new Date(order.date).toLocaleDateString()}
              </Text>
            </View>

            <View className="border-t border-b border-gray-100 py-2 my-2">
              {order.items.map((item, index) => (
                <Text key={index} className="text-gray-800">
                  {item.quantity}x {item.name}
                </Text>
              ))}
            </View>

            <View className="flex-row justify-between items-center mt-2">
              <View className="flex-row items-center">
                <View
                  className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(
                    order.status
                  )}`}
                />
                <Text className="text-gray-600">
                  {getStatusText(order.status)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="font-bold text-primary mr-2">
                  ${order.total.toFixed(2)}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
} 