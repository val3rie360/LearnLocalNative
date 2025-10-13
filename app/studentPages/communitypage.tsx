import { useAuth } from "@/contexts/AuthContext"; // adjust path if needed
import {
  getCommunityPosts,
  getLargestPosts,
  updateCommunityPostUpvotes,
} from "@/services/firestoreService";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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
  const { user } = useAuth();
  const userId = user?.uid || "guest"; // fallback if not logged in
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [upvoted, setUpvoted] = useState<{ [postId: string]: boolean }>({});
  const [refreshing, setRefreshing] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState<"top" | "default">("default"); // new state for sorting

  // Use a user-specific key for upvoted posts
  const upvoteStorageKey = `community_upvoted_${userId}`;

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
        const stored = await AsyncStorage.getItem(upvoteStorageKey);
        if (stored) setUpvoted(JSON.parse(stored));
      } catch {}
    };
    loadUpvoted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPosts, userId]);

  // Save upvoted state to AsyncStorage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem(upvoteStorageKey, JSON.stringify(upvoted));
  }, [upvoted, upvoteStorageKey]);

  // Handler for upvote arrow tap
  const handleUpvote = async (postId: string) => {
    const hasUpvoted = upvoted[postId];

    // Optimistically update UI
    setUpvoted((prev) => ({
      ...prev,
      [postId]: !hasUpvoted,
    }));

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              upvotes: (post.upvotes ?? 0) + (hasUpvoted ? -1 : 1),
            }
          : post
      )
    );

    try {
      await updateCommunityPostUpvotes(postId, hasUpvoted ? -1 : 1);
      await fetchPosts();
    } catch (e) {
      // Revert UI if error
      setUpvoted((prev) => ({
        ...prev,
        [postId]: hasUpvoted,
      }));
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                upvotes: (post.upvotes ?? 0) + (hasUpvoted ? 1 : -1),
              }
            : post
        )
      );
      console.error(e);
    }
  };

  // Add a function to fetch top-voted posts
  const fetchTopVotedPosts = useCallback(async () => {
    setRefreshing(true);
    const data = await getLargestPosts();
    setPosts(data);
    setRefreshing(false);
    setShowSortModal(false);
  }, []);

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
          <TouchableOpacity onPress={() => setShowSortModal(true)}>
            <Ionicons name="options-outline" size={20} color="#4B1EB4" />
          </TouchableOpacity>
        </View>

        {/* Sort Modal */}
        <Modal
          visible={showSortModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowSortModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowSortModal(false)}>
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }} />
          </TouchableWithoutFeedback>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 24,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 10,
            }}
          >
            <Text className="font-karla-bold text-lg mb-4">Sort Posts By</Text>
            <TouchableOpacity
              className="py-3 border-b border-[#eee]"
              onPress={() => {
                fetchTopVotedPosts();
                setSelectedSort("top");
              }}
            >
              <Text
                className={`text-base font-karla ${
                  selectedSort === "top"
                    ? "text-[#4B1EB4]"
                    : "text-[#18181B]"
                }`}
              >
                Top Votes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-3"
              onPress={() => {
                fetchPosts();
                setShowSortModal(false);
                setSelectedSort("default");
              }}
            >
              <Text
                className={`text-base font-karla ${
                  selectedSort === "default"
                    ? "text-[#4B1EB4]"
                    : "text-[#18181B]"
                }`}
              >
                Default (Newest)
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

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
                    {post.upvotes ?? 0}{" "}
                    {post.upvotes === 1 ? "upvote" : "upvotes"}
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
