import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Opportunity = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#F6F4FE]" edges={["top", "bottom"]}>
      {/* Header */}
      <View className="bg-[#4B1EB4] rounded-b-2xl pb-7 pt-12 px-5">
        <Text className="text-white font-karla-bold text-[28px] leading-tight mb-3">
          National Robotics{"\n"}Challenge 2025
        </Text>
        <View className="flex-row items-center mb-4">
          <View className="bg-[#FDE68A] rounded-full px-3 py-1 mr-2">
            <Text className="text-[#92400E] text-[13px] font-karla-bold">
              Closes in 15 days
            </Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="bookmark-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center mb-1">
          <Ionicons name="person-outline" size={16} color="#fff" />
          <Text className="ml-2 text-white text-[15px] font-karla">
            <Text className="font-karla-bold">Posted by:</Text> National
            Robotics Org
          </Text>
        </View>
        <View className="flex-row items-center mb-1">
          <Ionicons name="calendar-outline" size={16} color="#fff" />
          <Text className="ml-2 text-white text-[15px] font-karla">
            <Text className="font-karla-bold">Date:</Text> Aug 25–27, 2025 | 9
            AM – 5 PM
          </Text>
        </View>
        <View className="flex-row items-center">
          <MaterialIcons name="location-on" size={16} color="#fff" />
          <Text className="ml-2 text-white text-[15px] font-karla">
            <Text className="font-karla-bold">Location:</Text> Dumaguete City
            Hall Grounds
          </Text>
        </View>
      </View>

      {/* Everything below header */}
      <View className="flex-1 bg-[#F6F4FE]">
        <ScrollView
          className="flex-1 px-5 pt-4"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Info Row */}
          <View className="flex-row justify-between mb-5">
            <View
              className="bg-white rounded-xl px-3 py-3 items-center flex-1 mx-1 shadow-sm"
              style={{ elevation: 2 }}
            >
              <Text className="font-karla-bold text-[#18181B] text-[13px] mb-1">
                P30,000
              </Text>
              <Text className="text-[#6B7280] text-[11px] font-karla">
                cash prize
              </Text>
            </View>
            <View
              className="bg-white rounded-xl px-3 py-3 items-center flex-1 mx-1 shadow-sm"
              style={{ elevation: 2 }}
            >
              <Text className="font-karla-bold text-[#18181B] text-[13px] mb-1">
                15
              </Text>
              <Text className="text-[#6B7280] text-[11px] font-karla">
                Teams
              </Text>
            </View>
            <View
              className="bg-white rounded-xl px-3 py-3 items-center flex-1 mx-1 shadow-sm"
              style={{ elevation: 2 }}
            >
              <Text className="font-karla-bold text-[#18181B] text-[13px] mb-1">
                JHS or SHS
              </Text>
              <Text className="text-[#6B7280] text-[11px] font-karla">
                Students
              </Text>
            </View>
            <View
              className="bg-white rounded-xl px-3 py-3 items-center flex-1 mx-1 shadow-sm"
              style={{ elevation: 2 }}
            >
              <Text className="font-karla-bold text-[#18181B] text-[13px] mb-1">
                15 – 21
              </Text>
              <Text className="text-[#6B7280] text-[11px] font-karla">
                years old
              </Text>
            </View>
          </View>

          {/* Description & Requirements */}
          <View
            className="bg-white rounded-xl p-4 mb-6 shadow-sm"
            style={{ elevation: 2 }}
          >
            <Text className="font-karla-bold text-[16px] text-[#18181B] mb-2">
              Description
            </Text>
            <Text className="text-[#605E8F] text-[14px] font-karla mb-3">
              Showcase your innovation at the 2025 National Robotics Challenge —
              compete with the best minds in engineering and AI!
            </Text>
            <Text className="font-karla-bold text-[16px] text-[#18181B] mb-2">
              Requirements
            </Text>
            <View>
              <Text className="text-[#605E8F] text-[14px] font-karla mb-1">
                • Open to students aged 15–21 who are currently enrolled in a
                recognized school or university.
              </Text>
              <Text className="text-[#605E8F] text-[14px] font-karla mb-1">
                • Participants may join either individually or in teams of 3–5
                members.
              </Text>
              <Text className="text-[#605E8F] text-[14px] font-karla mb-1">
                • Basic knowledge in robotics and programming is recommended but
                not strictly required. All participants must bring a valid
                school ID, personal laptop, and any necessary tools or materials
                for their project.
              </Text>
              <Text className="text-[#605E8F] text-[14px] font-karla">
                • Registration must be completed before the deadline, and
                confirmed participants will receive further guidelines via
                email.
              </Text>
            </View>
          </View>

          {/* Register Button */}
          <View className="items-center mb-4">
            <TouchableOpacity className="bg-[#4B1EB4] rounded-full py-3 px-8 items-center w-full max-w-[300px]">
              <Text className="text-white font-karla-bold text-[16px]">
                Register Now
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Opportunity;
