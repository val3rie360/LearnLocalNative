import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const posts = [
  {
    id: 1,
    user: "Rach Ramirez",
    date: "today",
    title: "Scholarships for TVET courses.",
    desc: "There's a dire need for more scholarships technical-vocational training.",
    tag: "Scholarship",
    tagColor: "bg-[#B6F0E2]",
    tagTextColor: "text-[#1B8C6E]",
    upvotes: 12,
  },
  {
    id: 2,
    user: "Kyle Valerie",
    date: "09/10/25",
    title: "Competitions for Math?",
    desc: "Specifically for elementary level.",
    tag: "Event",
    tagColor: "bg-[#FFD6E0]",
    tagTextColor: "text-[#C94F7C]",
    upvotes: 3,
  },
  {
    id: 3,
    user: "Chian Hoshino",
    date: "08/09/25",
    title: "Tutoring opportunities for JHS",
    desc: "English and Math.",
    tag: "Tutoring",
    tagColor: "bg-[#D7D6FF]",
    tagTextColor: "text-[#4B1EB4]",
    upvotes: 0,
  },
];

export default function OrgBoard() {
  const router = useRouter();
  return (
    <LinearGradient colors={["#ECEAFF", "#4b1eb4c8"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 px-0 pt-8">
        <View className="flex-1 px-5">
          {/* Title */}
          <Text className="font-karla-bold text-[28px] text-[#18181B] mb-1.5">
            Community Board
          </Text>
          <Text className="text-primaryb text-[15px] mb-4 font-karla leading-[20px]">
            See what students are asking for, and gain insight through upvotes
            on posts that highlight the most requested resources and programs.
          </Text>

          {/* Divider */}
          <View className="h-[1px] bg-[#E5E0FF] my-2" />

          {/* Posts Feed Header */}
          <View className="flex-row items-center mb-5">
            <Text className="font-karla-bold text-[17px] text-[#18181B] flex-1">
              Posts Feed
            </Text>
            <Ionicons name="options-outline" size={20} color="#4B1EB4" />
          </View>

          {/* Posts */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            {posts.map((post) => (
              <View
                key={post.id}
                className="bg-white rounded-2xl px-4 py-4 mb-4 shadow-sm"
                style={{
                  shadowColor: "#000",
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center mb-0.5">
                  <FontAwesome name="user-circle-o" size={18} color="#4B1EB4" />
                  <Text className="ml-1.5 font-karla-bold text-[#18181B] text-[13px]">
                    {post.user}
                  </Text>
                  <Text className="ml-1.5 text-[#A1A1AA] text-[12px] font-karla">
                    posted {post.date}
                  </Text>
                </View>
                <Text className="font-karla-bold text-[15px] text-[#18181B] mt-0.5">
                  {post.title}
                </Text>
                <Text className="text-[#52525B] text-[13px] mt-0.5 mb-2 font-karla">
                  {post.desc}
                </Text>
                <View className="flex-row items-center">
                  <View
                    className={`${post.tagColor} rounded-md px-2 py-0.5 mr-2`}
                  >
                    <Text
                      className={`${post.tagTextColor} text-[12px] font-karla-bold`}
                    >
                      {post.tag}
                    </Text>
                  </View>
                  <Entypo
                    name="arrow-up"
                    size={14}
                    color="#A1A1AA"
                    style={{ marginRight: 3 }}
                  />
                  <Text className="text-[#A1A1AA] text-[13px] font-karla">
                    {post.upvotes} upvotes
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
