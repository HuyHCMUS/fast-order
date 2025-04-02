import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Temporary data - will be replaced with Supabase data later
const categories = [
  'All',
  'Main Dishes',
  'Appetizers',
  'Drinks',
  'Desserts',
];

const menuItems = [
  {
    id: '1',
    name: 'Beef Burger',
    price: 8.99,
    category: 'Main Dishes',
    image: 'https://www.foodandwine.com/thmb/DI29Houjc_ccAtFKly0BbVsusHc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/crispy-comte-cheesburgers-FT-RECIPE0921-6166c6552b7148e8a8561f7765ddf20b.jpg',
    description: 'Juicy beef patty with fresh vegetables and special sauce',
  },
  {
    id: '2',
    name: 'Caesar Salad',
    price: 6.99,
    category: 'Appetizers',
    image: 'https://static01.nyt.com/images/2024/09/10/multimedia/JG-Parmesan-Crusted-Salmon-Caesar-Saladrex-kjpb/JG-Parmesan-Crusted-Salmon-Caesar-Saladrex-kjpb-mediumSquareAt3X.jpg',
    description: 'Fresh romaine lettuce with caesar dressing and croutons',
  },
  // Add more items as needed
];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      className="bg-white rounded-lg shadow-sm m-2 overflow-hidden"
      style={{ width: '45%' }}
      onPress={() => navigation.navigate('MenuDetail', { item })}
    >
      <Image
        source={{ uri: item.image }}
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
          onPress={() => {
            // Add to cart functionality will be added later
            alert('Added to cart!');
          }}
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="py-4"
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            className={`px-4 py-2 mx-2 rounded-full ${
              selectedCategory === category
                ? 'bg-primary'
                : 'bg-white border border-gray-200'
            }`}
          >
            <Text
              className={`${
                selectedCategory === category ? 'text-white' : 'text-gray-600'
              } font-medium`}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menu Items Grid */}
      <FlatList
        data={filteredItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
} 