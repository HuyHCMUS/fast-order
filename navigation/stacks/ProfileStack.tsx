import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../../screens/profile/ProfileScreen';
import OrderHistoryScreen from '../../screens/profile/OrderHistoryScreen';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileScreen" 
        component={ProfileScreen}
        options={{
          title: 'My Profile',
        }}
      />
      <Stack.Screen 
        name="OrderHistory" 
        component={OrderHistoryScreen}
        options={{
          title: 'Order History',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
} 