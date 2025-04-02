import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '../../types/navigation';
import { AuthError } from '@supabase/supabase-js';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<AuthStackNavigationProp>();

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      const authError = error as AuthError;
      Alert.alert('Error', authError.message);
      console.log('error', authError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</Text>
        <Text className="text-gray-600">Sign in to continue</Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-gray-700 mb-2">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 bg-gray-50"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View>
          <Text className="text-gray-700 mb-2">Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 bg-gray-50"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          className="bg-primary rounded-lg p-4"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          className="mt-4"
        >
          <Text className="text-center text-gray-600">
            Don't have an account?{' '}
            <Text className="text-primary font-semibold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 