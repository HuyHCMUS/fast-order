import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/home/HomeScreen';
import MenuDetailScreen from '../../screens/home/MenuDetailScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Menu" 
        component={HomeScreen}
        options={{
          title: 'Fast Order',
          headerTitleStyle: {
            color: '#FF6B00',
          },
        }}
      />
      <Stack.Screen 
        name="MenuDetail" 
        component={MenuDetailScreen}
        options={{
          title: 'Menu Detail',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
} 