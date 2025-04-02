import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { TextInput } from 'react-native';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      // Get profile data from metadata
      const { full_name, phone } = user.user_metadata;
      setFullName(full_name || '');
      setPhone(phone || '');

      // Get avatar
      if (user.user_metadata.avatar_url) {
        const { data: avatarData } = await supabase.storage
          .from('avatars')
          .download(user.user_metadata.avatar_url);
        if (avatarData) {
          const fr = new FileReader();
          fr.readAsDataURL(avatarData);
          fr.onload = () => {
            setAvatar(fr.result as string);
          };
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Error loading profile');
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      Alert.alert('Error', 'Error signing out');
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          phone: phone,
        }
      });

      if (error) throw error;
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Error updating profile');
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  }

  async function updatePassword() {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      Alert.alert('Success', 'Password updated successfully');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      Alert.alert('Error', 'Error updating password');
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);

      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Permission to access media library denied');
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        // Upload image
        const fileName = `${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, decode(result.assets[0].base64), {
            contentType: 'image/jpeg'
          });

        if (uploadError) throw uploadError;

        // Update user metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            avatar_url: fileName,
          }
        });

        if (updateError) throw updateError;

        setAvatar(`data:image/jpeg;base64,${result.assets[0].base64}`);
        Alert.alert('Success', 'Avatar updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Error uploading avatar');
      console.log('error', error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        <Text className="text-2xl font-bold text-center mb-8">Profile</Text>

        {/* Avatar */}
        <View className="items-center mb-8">
          <TouchableOpacity
            onPress={uploadAvatar}
            disabled={uploading}
            className="relative"
          >
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                className="w-32 h-32 rounded-full"
              />
            ) : (
              <View className="w-32 h-32 rounded-full bg-gray-200 items-center justify-center">
                <Text className="text-4xl text-gray-400">👤</Text>
              </View>
            )}
            <View className="absolute bottom-0 right-0 bg-primary rounded-full p-2">
              <Text className="text-white text-xs">Edit</Text>
            </View>
          </TouchableOpacity>
          {uploading && <ActivityIndicator className="mt-2" />}
        </View>

        {/* Profile Form */}
        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 mb-2">Full Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4 bg-gray-50"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Phone Number</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4 bg-gray-50"
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity
            className="bg-primary rounded-lg p-4"
            onPress={updateProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold">
                Update Profile
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Password Change Form */}
        <View className="mt-8 space-y-4">
          <Text className="text-xl font-bold">Change Password</Text>
          
          <View>
            <Text className="text-gray-700 mb-2">New Password</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4 bg-gray-50"
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Confirm New Password</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4 bg-gray-50"
              placeholder="Confirm new password"
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className="bg-primary rounded-lg p-4"
            onPress={updatePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold">
                Update Password
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          className="mt-8 bg-red-500 rounded-lg p-4 flex-row items-center justify-center space-x-2"
          onPress={handleSignOut}
          disabled={loading}
        >
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text className="text-white text-center font-semibold text-lg">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 