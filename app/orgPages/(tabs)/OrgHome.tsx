import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../../contexts/AuthContext";

interface ProfileData {
  name?: string;
  email?: string;
  role?: 'student' | 'organization';
  createdAt?: {
    seconds: number;
  };
  verificationFileUrl?: string;
}

const opportunities = [
  {
    id: 1,
    title: "STEM Future Leaders Scholarship 2025",
    date: "August 17, 2025",
    deadline: "August 21, 2025",
    amount: "₱50,000",
    applicants: 125,
    icon: "users",
    type: "scholarship",
  },
  {
    id: 2,
    title: "MATH-Tinik Competition 2025",
    date: "August 17, 2025",
    eventDate: "September 7, 2025",
    prize: "₱25,000",
    confirmed: 15,
    icon: "users",
    type: "competition",
  },
];

export default function OrgHome() {
  const { user, profileData, profileLoading } = useAuth();

  // Get display name with fallbacks
  const getDisplayName = () => {
    if (profileLoading) return "Organization";
    return profileData?.name || user?.displayName || user?.email?.split("@")[0] || "Organization";
  };

  return (
    <View className="flex-1 bg-[#ECEAFF]">
      {/* Gradient Header (lighter purple) */}
      <LinearGradient
        colors={["#D6D3FF", "#B8B4FF", "#A18AFF"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 210,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          zIndex: 0,
        }}
      />

      {/* Avatar and Org Name */}
      <View className="items-center mt-10 mb-2 z-10">
        <View
          className="bg-white rounded-full w-24 h-24 items-center justify-center mb-2 border-4 border-[#E5E0FF] shadow"
          style={{ elevation: 4 }}
        >
          <Ionicons name="people" size={56} color="#7D7CFF" />
        </View>
        <Text
          className="text-[#7D7CFF] text-lg font-bold mt-2"
          style={{ fontFamily: "Karla-Bold" }}
        >
          {getDisplayName()}
        </Text>
      </View>

      {/* Search Bar & Icon Row */}
      <View className="mx-4 mt-3">
        <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 shadow border border-[#C9BFFF]">
          <FontAwesome
            name="users"
            size={24}
            color="#7D7CFF"
            className="mr-2"
          />
          <TextInput
            placeholder="Opportunity Title"
            placeholderTextColor="#A3A3A3"
            className="flex-1 text-base"
            style={{ fontFamily: "Karla" }}
          />
          <Ionicons name="chevron-down" size={22} color="#A3A3A3" />
        </View>
        <View className="flex-row justify-between px-6 mt-3 mb-2">
          <MaterialCommunityIcons
            name="certificate-outline"
            size={24}
            color="#7D7CFF"
          />
          <Ionicons name="school" size={24} color="#7D7CFF" />
          <Ionicons name="trophy" size={24} color="#7D7CFF" />
          <Ionicons name="location" size={24} color="#7D7CFF" />
          <Ionicons name="calendar" size={24} color="#7D7CFF" />
        </View>
      </View>

      {/* Opportunities List */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {opportunities.map((item) => (
          <View
            key={item.id}
            className="bg-[#B8B4FF] rounded-2xl mx-4 mb-5 p-4"
            style={{
              shadowColor: "#7D7CFF",
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center mb-1">
              <FontAwesome name="users" size={20} color="#7D7CFF" />
              <Text
                className="font-bold text-[#7D7CFF] text-xs ml-1"
                style={{ fontFamily: "Karla-Bold" }}
              >
                {getDisplayName()}
              </Text>
              <Text
                className="text-[#18181B] text-xs ml-2"
                style={{ fontFamily: "Karla" }}
              >
                {item.date}
              </Text>
              <Ionicons
                name="create-outline"
                size={16}
                color="#7D7CFF"
                className="ml-auto"
              />
            </View>
            <Text
              className="font-bold text-[#4B1EB4] text-base mb-1 mt-1"
              style={{ fontFamily: "Karla-Bold" }}
            >
              {item.title}
            </Text>
            {item.type === "scholarship" ? (
              <>
                <View className="flex-row items-center mb-0.5">
                  <Ionicons name="calendar-outline" size={15} color="#7D7CFF" />
                  <Text
                    className="text-[#18181B] text-xs ml-1 font-bold"
                    style={{ fontFamily: "Karla-Bold" }}
                  >
                    Deadline:
                  </Text>
                  <Text
                    className="text-[#18181B] text-xs ml-1"
                    style={{ fontFamily: "Karla" }}
                  >
                    {item.deadline}
                  </Text>
                </View>
                <View className="flex-row items-center mb-0.5">
                  <FontAwesome name="money" size={15} color="#7D7CFF" />
                  <Text
                    className="text-[#18181B] text-xs ml-1 font-bold"
                    style={{ fontFamily: "Karla-Bold" }}
                  >
                    Amount:
                  </Text>
                  <Text
                    className="text-[#18181B] text-xs ml-1"
                    style={{ fontFamily: "Karla" }}
                  >
                    {item.amount}
                  </Text>
                </View>
                <View className="flex-row items-center mb-0.5">
                  <Ionicons name="people-outline" size={15} color="#7D7CFF" />
                  <Text
                    className="text-[#18181B] text-xs ml-1 font-bold"
                    style={{ fontFamily: "Karla-Bold" }}
                  >
                    Current Applicants:
                  </Text>
                  <Text
                    className="text-[#18181B] text-xs ml-1"
                    style={{ fontFamily: "Karla" }}
                  >
                    {item.applicants}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View className="flex-row items-center mb-0.5">
                  <Ionicons name="calendar-outline" size={15} color="#7D7CFF" />
                  <Text
                    className="text-[#18181B] text-xs ml-1 font-bold"
                    style={{ fontFamily: "Karla-Bold" }}
                  >
                    Date:
                  </Text>
                  <Text
                    className="text-[#18181B] text-xs ml-1"
                    style={{ fontFamily: "Karla" }}
                  >
                    {item.eventDate}
                  </Text>
                </View>
                <View className="flex-row items-center mb-0.5">
                  <FontAwesome name="money" size={15} color="#7D7CFF" />
                  <Text
                    className="text-[#18181B] text-xs ml-1 font-bold"
                    style={{ fontFamily: "Karla-Bold" }}
                  >
                    Cash Prize:
                  </Text>
                  <Text
                    className="text-[#18181B] text-xs ml-1"
                    style={{ fontFamily: "Karla" }}
                  >
                    {item.prize}
                  </Text>
                </View>
                <View className="flex-row items-center mb-0.5">
                  <Ionicons
                    name="checkmark-done-outline"
                    size={15}
                    color="#7D7CFF"
                  />
                  <Text
                    className="text-[#18181B] text-xs ml-1 font-bold"
                    style={{ fontFamily: "Karla-Bold" }}
                  >
                    Confirmed Applicants:
                  </Text>
                  <Text
                    className="text-[#18181B] text-xs ml-1"
                    style={{ fontFamily: "Karla" }}
                  >
                    {item.confirmed}
                  </Text>
                </View>
              </>
            )}
            <TouchableOpacity className="self-end mt-1 flex-row items-center">
              <Text
                className="text-[#4B1EB4] font-bold mr-1"
                style={{ fontFamily: "Karla-Bold" }}
              >
                See more
              </Text>
              <Ionicons name="chevron-down" size={16} color="#4B1EB4" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
