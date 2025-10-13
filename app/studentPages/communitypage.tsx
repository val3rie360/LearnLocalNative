import {
  getCommunityPosts,
  updateCommunityPostUpvotes,
} from "@/services/firestoreService";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CommunityPost = {
  id: string;
  user: string;
  date: string;
  title: string;
  desc: string;
  tag: string;
  tagColor?: string;
  tagTextColor?: string;
  upvotes?: number;
};

export default function CommunityPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [upvoted, setUpvoted] = useState<{ [postId: string]: boolean }>({});
  const [refreshing, setRefreshing] = useState(false);

  // Extract fetch logic to a function
  const fetchPosts = useCallback(async () => {
    setRefreshing(true);
    const data = await getCommunityPosts();
    setPosts(data);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchPosts();

    const loadUpvoted = async () => {
      try {
        const stored = await AsyncStorage.getItem("community_upvoted");
        if (stored) setUpvoted(JSON.parse(stored));
      } catch {}
    };
    loadUpvoted();
  }, [fetchPosts]);

  // Save upvoted state to AsyncStorage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem("community_upvoted", JSON.stringify(upvoted));
  }, [upvoted]);

  // Handler for upvote arrow tap
  const handleUpvote = async (postId: string) => {
    if (upvoted[postId]) return;

    setUpvoted((prev) => ({
      ...prev,
      [postId]: true,
    }));

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, upvotes: (post.upvotes ?? 0) + 1 }
          : post
      )
    );

    try {
      await updateCommunityPostUpvotes(postId, 1);
      // No need to re-fetch posts, just update upvotes locally
    } catch (e) {
      setUpvoted((prev) => ({
        ...prev,
        [postId]: false,
      }));
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, upvotes: (post.upvotes ?? 1) - 1 }
            : post
        )
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F4FE]">
      <View className="flex-1 px-5">
        {/* Back Arrow */}
        <TouchableOpacity
          className="mt-5 mb-2 w-8"
          hitSlop={10}
          onPress={() => router.replace("/studentPages/(tabs)/Profile")}
        >
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>

        {/* Title */}
        <Text className="font-karla-bold text-[28px] text-[#18181B] mb-1.5">
          Community Board
        </Text>
        <Text className="text-[#6B7280] text-[15px] mb-4 font-karla leading-[20px]">
          A student-driven space to share ideas, requests, and feedback on
          learning materials and opportunities. Upvote posts so organizers can
          see what you truly need.
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchPosts} />
          }
        >
          {posts.map((post) => {
            // Match tag style based on categories array
            const categories = [
              {
                label: "Scholarship",
                bg: "bg-[#BDFCFF]",
                text: "text-[#106074]",
              },
              { label: "Event", bg: "bg-[#FFC3C4]", text: "text-[#934055]" },
              { label: "Tutoring", bg: "bg-[#6C63FF]", text: "text-white" },
              {
                label: "Learning Materials",
                bg: "bg-[#F2C25B]",
                text: "text-[#745000]",
              },
              { label: "Workshop", bg: "bg-[#C6F7B2]", text: "text-[#3B7C1B]" },
            ];
            const category = categories.find((cat) => cat.label === post.tag);

            const tagBg = category ? category.bg : "bg-[#FFD6E0]";
            const tagText = category ? category.text : "text-[#C94F7C]";

            return (
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
                  <View className={`${tagBg} rounded-md px-2 py-0.5 mr-2`}>
                    <Text className={`font-karla-bold text-[12px] ${tagText}`}>
                      {post.tag}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleUpvote(post.id)}
                    activeOpacity={0.7}
                  >
                    <Entypo
                      name="arrow-bold-up"
                      size={16}
                      color={upvoted[post.id] ? "#4B1EB4" : "#A1A1AA"} // secondary color if tapped
                      style={{ marginRight: 3 }}
                    />
                  </TouchableOpacity>
                  <Text className="text-[#A1A1AA] text-[13px] font-karla">
                    {post.upvotes ?? 0} upvotes
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Create Post Button */}
        <TouchableOpacity
          className="bg-secondary rounded-full py-3 items-center mb-4 mt-1.5"
          onPress={() => router.push("./createpost")}
        >
          <Text className="text-white font-karla-bold text-[16px]">
            Create Post
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
