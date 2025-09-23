import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditAccount() {
  const router = useRouter();
  const [name, setName] = useState("Rach Ramirez");
  const [email, setEmail] = useState("rachramz@gmail.com");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);

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
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor="#A1A1AA"
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
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#A1A1AA"
          keyboardType="email-address"
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
          placeholder="Password"
          placeholderTextColor="#A1A1AA"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword((v) => !v)}
          className="p-1 ml-1"
          activeOpacity={1}
        >
          <Feather
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color="#A1A1AA"
          />
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity className="bg-[#4B1EB4] rounded-full py-4 items-center shadow mt-2 active:opacity-90">
        <Text className="text-white text-base font-karla-bold">
          Save Changes
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
