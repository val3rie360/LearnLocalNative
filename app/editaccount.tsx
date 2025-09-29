import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { updateEmail, updatePassword, updateProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { updateUserProfile } from "../services/firestoreService";

interface ProfileData {
  name?: string;
  email?: string;
  role?: 'student' | 'organization';
  createdAt?: {
    seconds: number;
  };
  verificationFileUrl?: string;
}

export default function EditAccount() {
  const router = useRouter();
  const { user, profileData, profileLoading, refreshProfile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Set form values when profile data changes
  useEffect(() => {
    if (profileData) {
      setName(profileData?.name || user?.displayName || "");
      setEmail(profileData?.email || user?.email || "");
    }
  }, [profileData, user]);

  const handleSaveChanges = async () => {
    if (!user?.uid) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    setLoading(true);
    try {
      // Update Firebase Auth profile
      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }

      // Update email if changed
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      // Update password if provided
      if (password.trim()) {
        await updatePassword(user, password);
      }

      // Update Firestore profile
      const updatedProfileData = {
        name: name.trim(),
        email: email.trim(),
        updatedAt: new Date(),
      };

      await updateUserProfile(user.uid, updatedProfileData);

      // Refresh profile data to update all components
      await refreshProfile();

      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F4FE] px-6 pt-10">
      {/* Back Arrow */}
      <TouchableOpacity
        className="absolute left-6 top-10"
        onPress={() => router.back()}
        hitSlop={10}
      >
        <Feather name="arrow-left" size={22} color="#18181B" />
      </TouchableOpacity>

      {/* Title */}
      <Text className="text-center text-[22px] font-karla-bold mt-2 mb-6 text-[#18181B]">
        Edit Account
      </Text>

      {/* Profile Image */}
      <View className="items-center mb-8">
        <View className="relative">
          <FontAwesome name="user-circle-o" size={90} color="#18181B" />
          <TouchableOpacity
            className="absolute bottom-2 -right-3 bg-white rounded-full p-1 shadow border border-[#e0d7ff]"
            style={{ elevation: 2 }}
          >
            <MaterialIcons name="photo-camera" size={22} color="#4B1EB4" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Divider */}
      <View className="border-t border-[#e0e0e0] mb-6" />

      {/* Name Field */}
      <Text className="text-[15px] font-karla-bold mb-1 text-[#18181B]">
        Name
      </Text>
      <View className="flex-row items-center bg-white rounded-full px-4 mb-4 h-12 shadow border border-[#e0d7ff]">
        <Feather
          name="user"
          size={18}
          color="#A1A1AA"
          style={{ marginRight: 8 }}
        />
        <TextInput
          className="flex-1 text-base font-karla text-[#222]"
          value={profileLoading ? "Loading..." : name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor="#A1A1AA"
          editable={!profileLoading}
        />
      </View>

      {/* Email Field */}
      <Text className="text-[15px] font-karla-bold mb-1 text-[#18181B]">
        Email
      </Text>
      <View className="flex-row items-center bg-white rounded-full px-4 mb-4 h-12 shadow border border-[#e0d7ff]">
        <Feather
          name="mail"
          size={18}
          color="#A1A1AA"
          style={{ marginRight: 8 }}
        />
        <TextInput
          className="flex-1 text-base font-karla text-[#222]"
          value={profileLoading ? "Loading..." : email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#A1A1AA"
          keyboardType="email-address"
          editable={!profileLoading}
        />
      </View>

      {/* Password Field */}
      <Text className="text-[15px] font-karla-bold mb-1 text-[#18181B]">
        Change Password
      </Text>
      <View className="flex-row items-center bg-white rounded-full px-4 mb-8 h-12 shadow border border-[#e0d7ff]">
        <Feather
          name="lock"
          size={18}
          color="#A1A1AA"
          style={{ marginRight: 8 }}
        />
        <TextInput
          className="flex-1 text-base font-karla text-[#222]"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter new password (leave blank to keep current)"
          placeholderTextColor="#A1A1AA"
          secureTextEntry={!showPassword}
          editable={!profileLoading}
        />
        <TouchableOpacity
          onPress={() => setShowPassword((v) => !v)}
          className="p-1 ml-1"
          activeOpacity={1}
          disabled={profileLoading}
        >
          <Feather
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color="#A1A1AA"
          />
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity 
        className={`rounded-full py-4 items-center shadow mt-2 ${
          loading ? 'bg-gray-400' : 'bg-[#4B1EB4] active:opacity-90'
        }`}
        onPress={handleSaveChanges}
        disabled={loading || profileLoading}
      >
        <Text className="text-white text-base font-karla-bold">
          {loading ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
