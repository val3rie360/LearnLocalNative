import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#F6F4FE] px-5">
      {/* Back Arrow */}
      <TouchableOpacity
        className="mt-14 mb-2 w-8"
        hitSlop={10}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#222" />
      </TouchableOpacity>

      {/* Title */}
      <Text className="font-karla-bold text-[26px] text-[#18181B] mb-4">
        Settings
      </Text>

      {/* Profile Row */}
      <TouchableOpacity
        className="flex-row items-center mb-7"
        onPress={() => router.push("/editaccount")}
      >
        <View className="bg-[#F6F4FE] rounded-full w-12 h-12 items-center justify-center mr-3">
          <FontAwesome name="user-circle-o" size={36} color="#18181B" />
        </View>
        <View className="flex-1">
          <Text className="font-karla-bold text-[15px] text-[#18181B]">
            Rach Ramirez
          </Text>
          <Text className="font-karla text-[13px] text-[#6B7280]">
            Edit personal details
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#18181B" />
      </TouchableOpacity>

      {/* Divider */}
      <View className="h-[1px] bg-[#E5E0FF] mb-6" />

      {/* Dark Mode */}
      <View className="flex-row items-center justify-between mb-7">
        <View className="flex-row items-center">
          <View className="bg-[#E5E0FF] rounded-lg w-9 h-9 items-center justify-center mr-3">
            <Ionicons name="moon" size={20} color="#7D7CFF" />
          </View>
          <Text className="font-karla-bold text-[15px] text-[#18181B]">
            Dark Mode
          </Text>
        </View>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: "#E5E0FF", true: "#7D7CFF" }}
          thumbColor={darkMode ? "#fff" : "#fff"}
        />
      </View>

      {/* Notifications Label */}
      <Text className="font-karla text-[13px] text-[#6B7280] mb-2">
        Notifications
      </Text>

      {/* Notifications Toggle */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <View className="bg-[#E5E0FF] rounded-lg w-9 h-9 items-center justify-center mr-3">
            <Ionicons name="notifications" size={20} color="#7D7CFF" />
          </View>
          <Text className="font-karla-bold text-[15px] text-[#18181B]">
            Notifications
          </Text>
        </View>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: "#E5E0FF", true: "#7D7CFF" }}
          thumbColor={notifications ? "#fff" : "#fff"}
        />
      </View>

      {/* Version */}
      <View className="flex-1 justify-end items-center pb-4">
        <Text className="font-karla text-[#18181B] text-[13px]">
          App ver 1.0.1
        </Text>
      </View>
    </SafeAreaView>
  );
}
