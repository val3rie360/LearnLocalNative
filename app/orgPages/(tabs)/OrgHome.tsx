import {
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
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
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../contexts/AuthContext";

interface ProfileData {
  name?: string;
  email?: string;
  role?: "student" | "organization";
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
    return (
      profileData?.name ||
      user?.displayName ||
      user?.email?.split("@")[0] ||
      "Organization"
    );
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#D6D3FF] "
      edges={["top", "left", "right"]}
    >
      <LinearGradient colors={["#ECEAFF", "#4b1eb4c8"]} style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Gradient Header (lighter purple) */}
          <LinearGradient
            colors={["#D6D3FF", "#4d2adaa1", "#4d2adaff"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 130,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              zIndex: 0,
            }}
          />

          {/* Avatar and Org Name */}
          <View className="items-center mt-24 mb-2">
            <View
              className="bg-white rounded-full w-24 h-24 items-center justify-center border-4 border-[#ECEAFF] shadow"
              style={{ elevation: 0 }}
            >
              <Ionicons name="people" size={56} color="#7D7CFF" />
            </View>
            <View className="flex-row items-center mt-2">
              {/* Verified checkmark on the left of the name */}
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#8ee8ffff"
                style={{ marginRight: 6 }}
              />
              <Text className="text-white text-lg font-karla-bold">
                {getDisplayName()}
              </Text>
            </View>
          </View>

          {/* Search Bar & Icon Row */}
          <View className="mx-4 mt-2">
            <View className="bg-white rounded-2xl px-4 py-2 shadow border border-[#C9BFFF] mb-4">
              {/* Icon and Search Bar Row */}
              <View className="flex-row items-center">
                <View
                  className="w-9 h-9 rounded-full bg-[#D6D3FF] items-center justify-center mr-3"
                  style={{ position: "relative" }}
                >
                  <FontAwesome name="users" size={22} color="#7D7CFF" />
                  {/* Verified checkmark */}
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color="#4BDBFF"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: -2,
                      backgroundColor: "#fff",
                      borderRadius: 7,
                    }}
                  />
                </View>
                <View className="flex-1">
                  <View
                    style={{
                      backgroundColor: "#E3E3E3",
                      borderRadius: 25,
                      paddingHorizontal: 8,
                      paddingVertical: 1,
                    }}
                  >
                    <TextInput
                      placeholder="Opportunity Title"
                      placeholderTextColor="#9B9B9B"
                      style={{
                        fontFamily: "Karla",
                        fontSize: 13,
                        color: "#18181B",
                      }}
                    />
                  </View>
                </View>
              </View>
              {/* Categories Row */}
              <View className="flex-row justify-end mt-1.5 mb-1 px-2">
                <FontAwesome6
                  name="scroll"
                  size={19}
                  color="#57477cbd"
                  style={{ marginRight: 25 }}
                />
                <FontAwesome6
                  name="medal"
                  size={20}
                  color="#57477cbd"
                  style={{ marginRight: 25 }}
                />
                <FontAwesome5
                  name="chalkboard-teacher"
                  size={20}
                  color="#57477cbd"
                  style={{ marginRight: 25 }}
                />
                <Ionicons
                  name="location"
                  size={21}
                  color="#57477cbd"
                  style={{ marginRight: 25 }}
                />
                <MaterialCommunityIcons
                  name="bookshelf"
                  size={24}
                  color="#57477cbd"
                  style={{ marginRight: 25 }}
                />
                <Ionicons name="chevron-down" size={20} color="#57477cbd" />
              </View>
            </View>
          </View>

          {/* Opportunities List */}
          {opportunities.map((item) => (
            <View
              key={item.id}
              className="bg-[#ffffff] rounded-2xl mx-4 mb-5 p-4"
              style={{
                shadowColor: "#7D7CFF",
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center">
                <View
                  className="w-9 h-9 rounded-full bg-[#D6D3FF] items-center justify-center mr-3"
                  style={{ position: "relative" }}
                >
                  <FontAwesome name="users" size={22} color="#7D7CFF" />
                  {/* Verified checkmark */}
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color="#4BDBFF"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: -2,
                      backgroundColor: "#fff",
                      borderRadius: 7,
                    }}
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text
                      className="font-karla-bold text-primaryb text-s ml-2"
                      style={{ fontFamily: "Karla-Bold" }}
                    >
                      {getDisplayName()}
                    </Text>
                    {/* Conditional icon beside org name */}
                    {item.type === "scholarship" ? (
                      <FontAwesome6
                        name="scroll"
                        size={20}
                        color="#4B1EB4"
                        style={{ marginLeft: 6 }}
                      />
                    ) : (
                      <FontAwesome6
                        name="medal"
                        size={20}
                        color="#4B1EB4"
                        style={{ marginLeft: 6 }}
                      />
                    )}
                  </View>
                  <Text
                    className="text-[#18181B] text-xs ml-2 font-karla"
                    style={{ fontFamily: "Karla" }}
                  >
                    {item.date}
                  </Text>
                </View>
                <FontAwesome6
                  name="edit"
                  size={16}
                  color="#7D7CFF"
                  className="ml-auto"
                />
              </View>
              <Text className="font-karla-bold text-[#4B1EB4] text-base mb-1 mt-1">
                {item.title}
              </Text>
              {item.type === "scholarship" ? (
                <>
                  <View className="flex-row items-center mb-0.5">
                    <Ionicons
                      name="calendar-outline"
                      size={15}
                      color="#7D7CFF"
                    />
                    <Text
                      style={{ fontFamily: "Karla-Bold" }}
                      className="text-[#18181B] text-xs ml-1"
                    >
                      Deadline:
                    </Text>
                    <Text
                      style={{ fontFamily: "Karla" }}
                      className="text-[#18181B] text-xs ml-1"
                    >
                      {item.deadline}
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-0.5">
                    <FontAwesome name="money" size={15} color="#7D7CFF" />
                    <Text
                      style={{ fontFamily: "Karla-Bold" }}
                      className="text-[#18181B] text-xs ml-1"
                    >
                      Amount:
                    </Text>
                    <Text
                      style={{ fontFamily: "Karla" }}
                      className="text-[#18181B] text-xs ml-1"
                    >
                      {item.amount}
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-0.5 justify-between">
                    <View className="flex-row items-center">
                      <Ionicons
                        name="people-outline"
                        size={15}
                        color="#7D7CFF"
                      />
                      <Text
                        style={{ fontFamily: "Karla-Bold" }}
                        className="text-[#18181B] text-xs ml-1"
                      >
                        Current Applicants:
                      </Text>
                      <Text
                        style={{ fontFamily: "Karla" }}
                        className="text-[#18181B] text-xs ml-1"
                      >
                        {item.applicants}
                      </Text>
                    </View>
                    <TouchableOpacity className="flex-row items-center">
                      <Text
                        style={{ fontFamily: "Karla-Bold" }}
                        className="text-[#4B1EB4] mr-1"
                      >
                        See more
                      </Text>
                      <FontAwesome6
                        name="chevron-down"
                        size={16}
                        color="#4B1EB4"
                      />
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <View className="flex-row items-center mb-0.5">
                    <Ionicons
                      name="calendar-outline"
                      size={15}
                      color="#7D7CFF"
                    />
                    <Text
                      style={{ fontFamily: "Karla-Bold" }}
                      className="text-[#18181B] text-xs ml-1"
                    >
                      Date:
                    </Text>
                    <Text
                      style={{ fontFamily: "Karla" }}
                      className="text-[#18181B] text-xs ml-1"
                    >
                      {item.eventDate}
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-0.5">
                    <FontAwesome name="money" size={15} color="#7D7CFF" />
                    <Text
                      style={{ fontFamily: "Karla-Bold" }}
                      className="text-[#18181B] text-xs ml-1"
                    >
                      Cash Prize:
                    </Text>
                    <Text
                      style={{ fontFamily: "Karla" }}
                      className="text-[#18181B] text-xs ml-1"
                    >
                      {item.prize}
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-0.5 justify-between">
                    <View className="flex-row items-center">
                      <Ionicons
                        name="checkmark-done-outline"
                        size={15}
                        color="#7D7CFF"
                      />
                      <Text
                        style={{ fontFamily: "Karla-Bold" }}
                        className="text-[#18181B] text-xs ml-1"
                      >
                        Confirmed Applicants:
                      </Text>
                      <Text
                        style={{ fontFamily: "Karla" }}
                        className="text-[#18181B] text-xs ml-1"
                      >
                        {item.confirmed}
                      </Text>
                    </View>
                    <TouchableOpacity className="flex-row items-center">
                      <Text
                        style={{ fontFamily: "Karla-Bold" }}
                        className="text-[#4B1EB4] mr-1"
                      >
                        See more
                      </Text>
                      <FontAwesome6
                        name="chevron-down"
                        size={15}
                        color="#4B1EB4"
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
