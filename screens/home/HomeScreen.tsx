import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Import types
import { Category } from '../../types/category';
import { Product } from '../../types/product';

// Import services
import { fetchCategories } from '../../services/categoryService';
import { fetchProducts } from '../../services/productService';
import { addToCart } from '../../services/cartService';

// Lấy chiều rộng màn hình để tính kích thước
const { width } = Dimensions.get('window');
const CATEGORY_MIN_WIDTH = 100; // Kích thước tối thiểu của mỗi category

export default function HomeScreen() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories(false);

      // Add 'All' category at the beginning
      setCategories([{ id: null, name: 'All' }, ...data]);
    } catch (error: any) {
      console.error('Error fetching categories:', error.message);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts(selectedCategoryId, searchQuery);
      setProducts(data);
    } catch (error: any) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategoryId, searchQuery]);

  const handleAddToCart = async (product: Product) => {
    try {
      const message = await addToCart(product.id);
      alert(message);
    } catch (error: any) {
      console.error('Error adding to cart:', error.message);
      alert(error.message);
    }
  };

  const renderMenuItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      className="bg-white rounded-lg shadow-sm m-2 overflow-hidden"
      style={{ width: '45%' }}
      onPress={() => {
        navigation.navigate('MenuDetail' as never, { item } as never);
      }}
    >
      <Image
        source={{ uri: item.image_url }}
        className="w-full h-32"
        resizeMode="cover"
      />
      <View className="p-2">
        <Text className="font-semibold text-gray-800" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-primary font-bold mt-1">
          ${item.price.toFixed(2)}
        </Text>
        <TouchableOpacity
          className="bg-primary rounded-full w-8 h-8 items-center justify-center absolute bottom-2 right-2"
          onPress={() => handleAddToCart(item)}
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Render các category với kích thước cố định và hiệu ứng tốt hơn
  const renderCategory = (category: Category) => {
    const isSelected = selectedCategoryId === category.id;
    return (
      <TouchableOpacity
        key={category.id || 'all'}
        onPress={() => setSelectedCategoryId(category.id)}
        className={`
          min-w-[${CATEGORY_MIN_WIDTH}px]
          h-[60px]
          mx-2
          rounded-full
          ${isSelected ? 'bg-primary' : 'bg-white border border-gray-200'}
          justify-center
          items-center
          px-4
          ${isSelected ? 'shadow-md' : 'shadow-sm'}
        `}
      >
        <Text
          className={`
            ${isSelected ? 'text-white font-bold' : 'text-gray-600 font-normal'}
            text-[15px]
            text-center
          `}
        >
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="p-4 bg-white">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-2">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            className="flex-1 ml-2"
            placeholder="Search menu..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories */}
      <View style={{ backgroundColor: 'white', paddingVertical: 12 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        >
          {categories.map(renderCategory)}
        </ScrollView>
      </View>

      {/* Menu Items Grid */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}