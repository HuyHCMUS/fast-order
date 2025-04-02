import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
};

type RouteParams = {
  item: MenuItem;
};

export default function MenuDetailScreen() {
  const [quantity, setQuantity] = useState(1);
  const route = useRoute();
  const { item } = route.params as RouteParams;

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const addToCart = () => {
    // Cart functionality will be added later
    alert(`Added ${quantity} ${item.name}(s) to cart!`);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Food Image */}
      <Image
        source={{ uri: item.image }}
        className="w-full h-64"
        resizeMode="cover"
      />

      {/* Content */}
      <View className="p-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-800">{item.name}</Text>
          <Text className="text-xl font-bold text-primary">
            ${item.price.toFixed(2)}
          </Text>
        </View>

        <Text className="text-gray-500 mt-2">{item.category}</Text>

        <Text className="text-gray-600 mt-4 leading-6">{item.description}</Text>

        {/* Quantity Selector */}
        <View className="flex-row items-center justify-center mt-6 bg-gray-100 rounded-lg p-2">
          <TouchableOpacity
            onPress={decreaseQuantity}
            className="w-10 h-10 rounded-full bg-white items-center justify-center"
          >
            <Ionicons name="remove" size={24} color="#FF6B00" />
          </TouchableOpacity>
          
          <Text className="mx-8 text-xl font-bold">{quantity}</Text>
          
          <TouchableOpacity
            onPress={increaseQuantity}
            className="w-10 h-10 rounded-full bg-white items-center justify-center"
          >
            <Ionicons name="add" size={24} color="#FF6B00" />
          </TouchableOpacity>
        </View>

        {/* Total Price */}
        <View className="flex-row justify-between items-center mt-6">
          <Text className="text-gray-600 text-lg">Total Price:</Text>
          <Text className="text-2xl font-bold text-primary">
            ${(item.price * quantity).toFixed(2)}
          </Text>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          onPress={addToCart}
          className="bg-primary rounded-lg p-4 mt-6"
        >
          <Text className="text-white text-center font-bold text-lg">
            Add to Cart
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 