import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrdersScreen from '../../screens/orders/OrdersScreen';
import OrderDetailScreen from '../../screens/orders/OrderDetailScreen';

const Stack = createNativeStackNavigator();

export default function OrderStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{
          title: 'My Orders',
        }}
      />
      <Stack.Screen 
        name="OrderDetail" 
        component={OrderDetailScreen}
        options={{
          title: 'Order Detail',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
} 