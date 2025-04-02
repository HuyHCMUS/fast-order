import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CartScreen from '../../screens/cart/CartScreen';
import CheckoutScreen from '../../screens/cart/CheckoutScreen';

const Stack = createNativeStackNavigator();

export default function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CartScreen" 
        component={CartScreen}
        options={{
          title: 'My Cart',
        }}
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen}
        options={{
          title: 'Checkout',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
} 
