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
  const [showPasswordForm, setShowPasswordForm] = useState(false);
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
        const { data: publicUrl } = supabase.storage
          .from('avatars')
          .getPublicUrl(user.user_metadata.avatar_url);
        setAvatar(publicUrl.publicUrl);
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
      setShowPasswordForm(false);
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
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        // Delete old avatar if exists
        if (user.user_metadata.avatar_url) {
          await supabase.storage
            .from('avatars')
            .remove([user.user_metadata.avatar_url]);
        }

        // Upload new avatar
        const fileName = `${user.id}-${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, decode(result.assets[0].base64), {
            contentType: 'image/jpeg',
            upsert: true,
            cacheControl: '3600'
          });

        if (uploadError) throw uploadError;

        // Update user metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            avatar_url: fileName,
          }
        });

        if (updateError) throw updateError;

        // Update local state
        const { data: publicUrl } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        setAvatar(publicUrl.publicUrl);
        
        Alert.alert('Success', 'Avatar updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Error uploading avatar');
      console.log('error', error);
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-6 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">Profile</Text>
        <Text className="text-gray-600 mt-1">Manage your account settings</Text>
      </View>

      <View className="p-6">
        {/* Avatar Section */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <View className="items-center">
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
                <View className="w-32 h-32 rounded-full bg-gray-100 items-center justify-center">
                  <Ionicons name="person" size={48} color="#9CA3AF" />
                </View>
              )}
              <View className="absolute bottom-0 right-0 bg-primary rounded-full p-2">
                <Ionicons name="camera" size={20} color="white" />
              </View>
            </TouchableOpacity>
            {uploading && (
              <View className="mt-2">
                <ActivityIndicator size="small" color="#FF6B00" />
              </View>
            )}
          </View>
        </View>

        {/* Profile Section */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Personal Information</Text>
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
              className="bg-primary rounded-lg p-4 mt-2"
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
        </View>

        {/* Password Section */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-800">Change Password</Text>
            <TouchableOpacity
              onPress={() => setShowPasswordForm(!showPasswordForm)}
              className="flex-row items-center space-x-1"
            >
              <Text className="text-primary font-medium">
                {showPasswordForm ? 'Cancel' : 'Change'}
              </Text>
              <Ionicons
                name={showPasswordForm ? 'close-circle' : 'key'}
                size={20}
                color="#FF6B00"
              />
            </TouchableOpacity>
          </View>

          {showPasswordForm && (
            <View className="space-y-4">
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
          )}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          className="bg-red-500 rounded-lg p-4 flex-row items-center justify-center space-x-2"
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