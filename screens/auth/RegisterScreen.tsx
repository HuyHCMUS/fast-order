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

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<AuthStackNavigationProp>();

  async function handleRegister() {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      Alert.alert(
        'Success',
        'Registration successful! Please check your email to verify your account.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
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
        <Text className="text-3xl font-bold text-gray-800 mb-2">Create Account</Text>
        <Text className="text-gray-600">Sign up to get started</Text>
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

        <View>
          <Text className="text-gray-700 mb-2">Confirm Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 bg-gray-50"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          className="bg-primary rounded-lg p-4"
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          className="mt-4"
        >
          <Text className="text-center text-gray-600">
            Already have an account?{' '}
            <Text className="text-primary font-semibold">Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 
