import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Import types
import { OrderStatus, TransformedOrder } from '../../types/order';

// Import services
import { fetchOrders } from '../../services/orderService';

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-gray-500';
    case 'confirmed':
      return 'bg-blue-500';
    case 'preparing':
      return 'bg-yellow-500';
    case 'ready':
      return 'bg-orange-500';
    case 'delivering':
      return 'bg-purple-500';
    case 'delivered':
      return 'bg-green-500';
    case 'cancelled':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'preparing':
      return 'Preparing';
    case 'ready':
      return 'Ready';
    case 'delivering':
      return 'Out for Delivery';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState<TransformedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data);
    } catch (error: any) {
      console.error('Error fetching orders:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {orders.length === 0 ? (
          <View className="flex-1 justify-center items-center py-8">
            <Ionicons name="receipt-outline" size={64} color="#ccc" />
            <Text className="text-gray-500 mt-4 text-lg">No orders yet</Text>
          </View>
        ) : (
          orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              className="bg-white rounded-lg p-4 mb-4 shadow-sm"
              onPress={() => navigation.navigate('OrderDetail', { order })}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-600">
                  Order #{order.id.substring(0, 8)}
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
          ))
        )}
      </View>
    </ScrollView>
  );
}