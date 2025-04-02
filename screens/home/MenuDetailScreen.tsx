import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

// Import types
import { Product } from '../../types/product';

// Import services
import { addToCart } from '../../services/cartService';

type RouteParams = {
  item: Product;
};

export default function MenuDetailScreen() {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const { item } = route.params as RouteParams;

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await addToCart(item.id, quantity);
      Alert.alert('Success', `Added ${quantity} ${item.name}(s) to cart!`);
    } catch (error: any) {
      console.error('Error adding to cart:', error.message);
      Alert.alert('Error', error.message || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Food Image */}
      <Image
        source={{ uri: item.image_url }}
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
          onPress={handleAddToCart}
          className={`bg-primary rounded-lg p-4 mt-6 ${loading ? 'opacity-70' : ''}`}
          disabled={loading}
        >
          <Text className="text-white text-center font-bold text-lg">
            {loading ? 'Adding...' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}