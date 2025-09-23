import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile: React.FC = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-[#F6F4FE]" edges={["top"]}>
      <View className="flex-1 bg-[#F6F4FE] items-center pt-16">
        <View className="items-center mb-8">
          <View className="bg-[#EAE8FD] rounded-full p-1.5 mb-2">
            <FontAwesome name="user-circle-o" size={85} color="#000" />
          </View>
          <Text className="text-[20px] text-black font-karla-bold mb-1">
            Rach Ramirez
          </Text>
          <Text className="text-[14px] text-[#7D7CFF] font-karla-bold mb-2">
            @rachramz
          </Text>
          <View className="bg-[#FFB3B3] py-1 px-3 rounded-lg">
            <Text className="text-[14px] text-black font-karla-bold">
              Student
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View className="h-[1px] bg-[#D3D1FA] w-[85%] mb-5" />

        {/* Menu Section */}
        <View className="w-[85%]">
          <TouchableOpacity
            className="flex-row items-center py-1.5 justify-between"
            onPress={() => router.replace("../../settings")}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="settings-sharp"
                size={22}
                color="#7D7CFF"
                style={{
                  backgroundColor: "#EAE8FD",
                  borderRadius: 10,
                  padding: 6,
                  marginRight: 12,
                }}
              />
              <Text className="text-[16px] font-karla-bold text-black">
                Settings
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#000000ff" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-3 justify-between"
            onPress={() => router.replace("../communitypage")}
          >
            <View className="flex-row items-center">
              <FontAwesome
                name="users"
                size={22}
                color="#7D7CFF"
                style={{
                  backgroundColor: "#EAE8FD",
                  borderRadius: 10,
                  padding: 6,
                  marginRight: 12,
                }}
              />
              <Text className="text-[16px] font-karla-bold text-black">
                Community Board
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#000000ff" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-1.5 justify-between"
            onPress={() => router.replace("../index")}
          >
            <View className="flex-row items-center">
              <MaterialIcons
                name="exit-to-app"
                size={22}
                color="#FF6B6B"
                style={{
                  backgroundColor: "#FFE5E5",
                  borderRadius: 10,
                  padding: 6,
                  marginRight: 12,
                }}
              />
              <Text className="text-[16px] font-karla-bold text-[#FF6B6B]">
                Log Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
