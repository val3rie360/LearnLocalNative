import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { searchBarContainer, searchBarInput } from "../../../tsStyling";

import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const downloaded = [
  {
    id: "1",
    title: "Math for Kids",
    category: ["Math", "Elementary", "STEM"],
    date: "08/09/25",
    size: "5.2 MB",
    color: "#F87171",
  },
  {
    id: "2",
    title: "Genetics & Heredity",
    category: ["Science", "JHS", "STEM"],
    date: "08/09/25",
    size: "5.2 MB",
    color: "#4ADEDE",
  },
  {
    id: "3",
    title: "Creative Writing 101",
    category: ["English", "SHS", "Literature"],
    date: "08/09/25",
    size: "5.2 MB",
    color: "#FBBF24",
  },
];

const CategoryTag = ({ label }: { label: string }) => (
  <View className="bg-[#E5E7EB] rounded-[10px] px-2 py-0.5 mr-1.5 mb-1">
    <Text className="text-[11px] font-karla-bold text-[#374151]">{label}</Text>
  </View>
);

const Library = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-[#F6F4FE]" edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView className="flex-1 bg-[#F6F4FE] px-5 pt-5">
        {/* Header */}
        <Text className="text-[25px] font-karla-bold text-[#111827] mb-1.5">
          Learning Library
        </Text>
        <Text className="text-[14px] font-karla text-[#6B7280]">
          Find free worksheets, modules, and study packs from trusted local
          organizations.
        </Text>

        {/* Search */}
        <View
          className={`${searchBarContainer} mb-4 w-[100%] mx-auto border border-[#E5E7EB]`}
        >
          <Ionicons name="search-outline" size={20} className="ml-2.5" />
          <TextInput
            className={searchBarInput}
            placeholder="Search for scholarships, study spaces, etc..."
            placeholderTextColor="#888"
          />
        </View>

        {/* Downloaded Section */}
        <View className="flex-row justify-between items-center mb-2.5">
          <Text className="text-[16px] font-karla-bold text-[#111827]">
            Downloaded
          </Text>
          <TouchableOpacity onPress={() => router.push("../downloadspage")}>
            <Text className="text-[14px] text-[#6C3EF8] font-karla-bold">
              See all
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row gap-2.5 mb-4">
          <View
            className="flex-1 h-20 rounded-xl"
            style={{ backgroundColor: "#6366F1" }}
          />
          <View
            className="flex-1 h-20 rounded-xl"
            style={{ backgroundColor: "#EF4444" }}
          />
        </View>

        {/* Tabs */}
        <View className="flex-row mb-4">
          <TouchableOpacity className="py-1.5 px-4 rounded-full bg-[#6C3EF8] mr-2.5">
            <Text className="text-[14px] font-karla-bold text-white">All</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-1.5 px-4 rounded-full bg-[#F3F4F6] mr-2.5">
            <Text className="text-[14px] font-karla-bold text-[#6B7280]">
              New
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-1.5 px-4 rounded-full bg-[#F3F4F6]">
            <Text className="text-[14px] font-karla-bold text-[#6B7280]">
              Popular
            </Text>
          </TouchableOpacity>
        </View>

        {/* Downloaded List */}
        {downloaded.map((item) => (
          <View
            key={item.id}
            className="flex-row items-center bg-white rounded-xl p-3 mb-3 shadow-sm"
            style={{ elevation: 2 }}
          >
            <View
              className="w-[50px] h-[50px] rounded-lg mr-3"
              style={{ backgroundColor: item.color }}
            />
            <View className="flex-1">
              <Text className="text-[15px] font-karla-bold text-[#111827] mb-1">
                {item.title}
              </Text>
              <View className="flex-row flex-wrap mb-1">
                {item.category.map((cat, idx) => (
                  <CategoryTag key={idx} label={cat} />
                ))}
              </View>
              <Text className="text-[12px] font-karla text-[#6B7280]">
                {item.date} | {item.size}
              </Text>
            </View>
            <Ionicons name="download-outline" size={20} color="#4B1EB4" />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Library;
