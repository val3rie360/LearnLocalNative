import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Linking, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../contexts/AuthContext";
import { downloadFile, formatFileSize, getAllActiveUploads } from "../../../services/cloudinaryUploadService";
import { addBookmark, removeBookmark } from "../../../services/firestoreService";

const CategoryTag = ({ label }: { label: string }) => (
  <View className="bg-[#E5E7EB] rounded-[10px] px-2 py-0.5 mr-1.5 mb-1">
    <Text className="text-[11px] font-karla-bold text-[#374151]">{label}</Text>
  </View>
);

const Library = () => {
  const router = useRouter();
  const { user, profileData } = useAuth();
  const [resources, setResources] = useState<any[]>([]);
  const [filteredResources, setFilteredResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "bookmarked" | "new" | "popular">("all");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [newResources, setNewResources] = useState<any[]>([]);
  const [popularResources, setPopularResources] = useState<any[]>([]);

  // Fetch resources
  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getAllActiveUploads();
      console.log('Fetched resources:', data.length);
      setResources(data);
      setFilteredResources(data);
      
      // Filter new resources (uploaded in last 7 days)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const recentUploads = data.filter((resource) => {
        const createdAt = resource.createdAt?.toDate?.() || new Date(resource.createdAt);
        return createdAt >= oneWeekAgo;
      });
      setNewResources(recentUploads);
      console.log('New resources (last 7 days):', recentUploads.length);
      
      // Filter popular resources (with at least 1 download, sorted by download count)
      const popularUploads = data
        .filter((resource) => resource.downloadCount > 0)
        .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
        .slice(0, 10); // Top 10 most downloaded
      setPopularResources(popularUploads);
      console.log('Popular resources:', popularUploads.length);
      
      // Load user's bookmarked IDs from profile
      if (user?.uid && profileData) {
        const bookmarks = (profileData as any).bookmarkedResources || [];
        setBookmarkedIds(bookmarks);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      Alert.alert("Error", "Failed to load resources. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [user?.uid, profileData]);

  // Filter and search resources
  useEffect(() => {
    let result = [...resources];

    // Apply bookmarked filter first
    if (selectedFilter === "bookmarked") {
      result = result.filter((resource) => bookmarkedIds.includes(resource.id));
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      result = result.filter((resource) => {
        const titleMatch = resource.displayName?.toLowerCase().includes(searchLower) || 
                          resource.fileName?.toLowerCase().includes(searchLower);
        const descMatch = resource.description?.toLowerCase().includes(searchLower);
        const categoryMatch = resource.category?.toLowerCase().includes(searchLower);
        const tagMatch = resource.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower));
        const orgMatch = resource.organizationName?.toLowerCase().includes(searchLower);
        
        return titleMatch || descMatch || categoryMatch || tagMatch || orgMatch;
      });
    }

    // Apply other category filters
    if (selectedFilter === "new") {
      // Show resources from last 7 days (less than 1 week old)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      oneWeekAgo.setHours(0, 0, 0, 0); // Start of day 7 days ago
      
      result = result.filter((resource) => {
        const createdAt = resource.createdAt?.toDate?.() || new Date(resource.createdAt);
        return createdAt > oneWeekAgo; // Strictly less than 1 week
      });
    } else if (selectedFilter === "popular") {
      // Sort by download count
      result = result.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
    }

    setFilteredResources(result);
  }, [searchQuery, selectedFilter, resources, bookmarkedIds]);

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  };

  // Handle file download
  const handleDownload = async (resource: any) => {
    try {
      const url = await downloadFile(resource.id);
      await Linking.openURL(url);
      Alert.alert("Success", "File opened! You can download it from your browser.");
    } catch (error) {
      console.error("Error downloading file:", error);
      Alert.alert("Error", "Failed to download file. Please try again.");
    }
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = async (resourceId: string) => {
    if (!user?.uid) {
      Alert.alert("Error", "You must be logged in to bookmark resources.");
      return;
    }

    try {
      const isBookmarked = bookmarkedIds.includes(resourceId);
      
      if (isBookmarked) {
        // Remove bookmark
        await removeBookmark(user.uid, resourceId);
        setBookmarkedIds(prev => prev.filter(id => id !== resourceId));
        Alert.alert("Removed", "Resource removed from your library.");
      } else {
        // Add bookmark
        await addBookmark(user.uid, resourceId);
        setBookmarkedIds(prev => [...prev, resourceId]);
        Alert.alert("Saved", "Resource added to your library!");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      Alert.alert("Error", "Failed to update bookmark. Please try again.");
    }
  };

  // Refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchResources();
  };

  // Get color for resource based on category
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Math": "#F87171",
      "Science": "#4ADEDE",
      "English": "#FBBF24",
      "History": "#A78BFA",
      "Arts": "#FB923C",
      "Technology": "#34D399",
      "default": "#6366F1"
    };
    
    for (const key in colors) {
      if (category?.toLowerCase().includes(key.toLowerCase())) {
        return colors[key];
      }
    }
    return colors.default;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F4FE]" edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView 
        className="flex-1 bg-[#F6F4FE] px-5 pt-5"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <Text className="text-[25px] font-karla-bold text-[#111827] mb-2">
          Learning Library
        </Text>
        <Text className="text-[14px] font-karla text-[#6B7280] mb-4">
          Find free worksheets, modules, and study packs from trusted local
          organizations.
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-3xl px-4 h-11 mb-2 border border-[#E5E0FF]">
          <Ionicons name="search" size={18} color="#999" />
          <TextInput
            className="flex-1 ml-2 text-[15px] text-[#222] font-karla"
            placeholder="Search resources..."
            placeholderTextColor="#B0B0B0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <View className="h-[1px] bg-[#E5E0FF] mt-1 mb-4" />

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <TouchableOpacity 
            className={`py-1.5 px-4 rounded-full mr-2.5 ${selectedFilter === "all" ? "bg-[#6C3EF8]" : "bg-[#F3F4F6]"}`}
            onPress={() => setSelectedFilter("all")}
          >
            <Text className={`text-[14px] font-karla-bold ${selectedFilter === "all" ? "text-white" : "text-[#6B7280]"}`}>
              All ({resources.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`py-1.5 px-4 rounded-full mr-2.5 ${selectedFilter === "bookmarked" ? "bg-[#6C3EF8]" : "bg-[#F3F4F6]"}`}
            onPress={() => setSelectedFilter("bookmarked")}
          >
            <Text className={`text-[14px] font-karla-bold ${selectedFilter === "bookmarked" ? "text-white" : "text-[#6B7280]"}`}>
              My Library ({bookmarkedIds.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`py-1.5 px-4 rounded-full mr-2.5 ${selectedFilter === "new" ? "bg-[#6C3EF8]" : "bg-[#F3F4F6]"}`}
            onPress={() => setSelectedFilter("new")}
          >
            <Text className={`text-[14px] font-karla-bold ${selectedFilter === "new" ? "text-white" : "text-[#6B7280]"}`}>
              New
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`py-1.5 px-4 rounded-full ${selectedFilter === "popular" ? "bg-[#6C3EF8]" : "bg-[#F3F4F6]"}`}
            onPress={() => setSelectedFilter("popular")}
          >
            <Text className={`text-[14px] font-karla-bold ${selectedFilter === "popular" ? "text-white" : "text-[#6B7280]"}`}>
              Popular
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* New This Week - Horizontal Scroll */}
        {!loading && newResources.length > 0 && selectedFilter === "all" && (
          <View className="mb-5">
            <View className="flex-row justify-between items-center mb-2.5">
              <Text className="text-[16px] font-karla-bold text-[#111827]">
                📚 New This Week
              </Text>
              <Text className="text-[13px] text-[#6B7280] font-karla">
                {newResources.length} {newResources.length === 1 ? 'file' : 'files'}
              </Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="mb-2"
            >
              {newResources.slice(0, 10).map((item) => {
                const isBookmarked = bookmarkedIds.includes(item.id);
                
                return (
                  <View
                    key={item.id}
                    className="bg-white rounded-xl p-3 mr-3 shadow-sm w-[280px]"
                    style={{ elevation: 2 }}
                  >
                    {/* Action buttons in upper right */}
                    <View
                      style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
                      className="flex-row items-center"
                    >
                      {/* Bookmark button */}
                      <TouchableOpacity
                        onPress={() => handleBookmarkToggle(item.id)}
                        className="mr-2 p-1 bg-white rounded-full"
                        activeOpacity={0.7}
                        style={{ elevation: 2 }}
                      >
                        <Ionicons
                          name={isBookmarked ? "bookmark" : "bookmark-outline"}
                          size={18}
                          color={isBookmarked ? "#6C3EF8" : "#4B1EB4"}
                        />
                      </TouchableOpacity>
                      
                      {/* Download button */}
                      <TouchableOpacity
                        onPress={() => handleDownload(item)}
                        className="p-1 bg-white rounded-full"
                        activeOpacity={0.7}
                        style={{ elevation: 2 }}
                      >
                        <Ionicons
                          name="download-outline"
                          size={18}
                          color="#4B1EB4"
                        />
                      </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity
                      onPress={() => handleDownload(item)}
                      activeOpacity={0.7}
                    >
                      <View className="flex-row items-start">
                        <View
                          className="w-[45px] h-[45px] rounded-lg mr-3 items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: getCategoryColor(item.category) }}
                        >
                          <Ionicons name="document-text" size={22} color="#fff" />
                        </View>
                        <View className="flex-1 pr-8">
                          <Text className="text-[14px] font-karla-bold text-[#111827] mb-1" numberOfLines={2}>
                            {item.displayName || item.fileName}
                          </Text>
                          
                          {/* Organization name */}
                          {item.organizationName && (
                            <Text className="text-[10px] font-karla text-[#9333EA] mb-1">
                              by {item.organizationName}
                            </Text>
                          )}
                          
                          <View className="flex-row flex-wrap mb-1">
                            <CategoryTag label={item.category || "General"} />
                          </View>
                          
                          <Text className="text-[11px] font-karla text-[#6B7280]">
                            {formatDate(item.createdAt)} • {formatFileSize(item.fileSize)}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
            <View className="h-[1px] bg-[#E5E0FF] my-3" />
          </View>
        )}

        {/* Popular Resources - Horizontal Scroll */}
        {!loading && popularResources.length > 0 && selectedFilter === "all" && (
          <View className="mb-5">
            <View className="flex-row justify-between items-center mb-2.5">
              <Text className="text-[16px] font-karla-bold text-[#111827]">
                🔥 Popular Resources
              </Text>
              <Text className="text-[13px] text-[#6B7280] font-karla">
                Top {popularResources.length}
              </Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="mb-2"
            >
              {popularResources.map((item) => {
                const isBookmarked = bookmarkedIds.includes(item.id);
                
                return (
                  <View
                    key={item.id}
                    className="bg-white rounded-xl p-3 mr-3 shadow-sm w-[280px]"
                    style={{ elevation: 2 }}
                  >
                    {/* Action buttons in upper right */}
                    <View
                      style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
                      className="flex-row items-center"
                    >
                      {/* Bookmark button */}
                      <TouchableOpacity
                        onPress={() => handleBookmarkToggle(item.id)}
                        className="mr-2 p-1 bg-white rounded-full"
                        activeOpacity={0.7}
                        style={{ elevation: 2 }}
                      >
                        <Ionicons
                          name={isBookmarked ? "bookmark" : "bookmark-outline"}
                          size={18}
                          color={isBookmarked ? "#6C3EF8" : "#4B1EB4"}
                        />
                      </TouchableOpacity>
                      
                      {/* Download button */}
                      <TouchableOpacity
                        onPress={() => handleDownload(item)}
                        className="p-1 bg-white rounded-full"
                        activeOpacity={0.7}
                        style={{ elevation: 2 }}
                      >
                        <Ionicons
                          name="download-outline"
                          size={18}
                          color="#4B1EB4"
                        />
                      </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity
                      onPress={() => handleDownload(item)}
                      activeOpacity={0.7}
                    >
                      <View className="flex-row items-start">
                        <View
                          className="w-[45px] h-[45px] rounded-lg mr-3 items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: getCategoryColor(item.category) }}
                        >
                          <Ionicons name="document-text" size={22} color="#fff" />
                        </View>
                        <View className="flex-1 pr-8">
                          <Text className="text-[14px] font-karla-bold text-[#111827] mb-1" numberOfLines={2}>
                            {item.displayName || item.fileName}
                          </Text>
                          
                          {/* Organization name */}
                          {item.organizationName && (
                            <Text className="text-[10px] font-karla text-[#9333EA] mb-1">
                              by {item.organizationName}
                            </Text>
                          )}
                          
                          <View className="flex-row flex-wrap mb-1">
                            <CategoryTag label={item.category || "General"} />
                          </View>
                          
                          <View className="flex-row items-center justify-between">
                            <Text className="text-[11px] font-karla text-[#6B7280]">
                              {formatFileSize(item.fileSize)}
                            </Text>
                            <View className="flex-row items-center">
                              <Ionicons name="download" size={12} color="#6C3EF8" />
                              <Text className="text-[11px] font-karla-bold text-[#6C3EF8] ml-1">
                                {item.downloadCount}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
            <View className="h-[1px] bg-[#E5E0FF] my-3" />
          </View>
        )}

        {/* Resources List */}
        {loading ? (
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color="#6C3EF8" />
            <Text className="text-[#666] mt-3 font-karla">Loading resources...</Text>
          </View>
        ) : filteredResources.length > 0 ? (
          <>
            <View className="flex-row justify-between items-center mb-2.5">
              <Text className="text-[16px] font-karla-bold text-[#111827]">
                {selectedFilter === "all" ? "All Resources" :
                 selectedFilter === "bookmarked" ? "My Library" :
                 selectedFilter === "new" ? "New This Week" :
                 "Popular Resources"}
              </Text>
              <Text className="text-[13px] text-[#6B7280] font-karla">
                {filteredResources.length} {filteredResources.length === 1 ? 'file' : 'files'}
              </Text>
            </View>
            {filteredResources.map((item) => {
              const isBookmarked = bookmarkedIds.includes(item.id);
              
              return (
                <View
                  key={item.id}
                  className="bg-white rounded-xl p-3 mb-3 shadow-sm"
                  style={{ elevation: 2, position: "relative" }}
                >
                  {/* Action buttons in upper right */}
                  <View
                    style={{ position: "absolute", top: 12, right: 12, zIndex: 1 }}
                    className="flex-row items-center"
                  >
                    {/* Bookmark button */}
                    <TouchableOpacity
                      onPress={() => handleBookmarkToggle(item.id)}
                      className="mr-2 p-1"
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={isBookmarked ? "bookmark" : "bookmark-outline"}
                        size={20}
                        color={isBookmarked ? "#6C3EF8" : "#4B1EB4"}
                      />
                    </TouchableOpacity>
                    
                    {/* Download button */}
                    <TouchableOpacity
                      onPress={() => handleDownload(item)}
                      className="p-1"
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="download-outline"
                        size={20}
                        color="#4B1EB4"
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => handleDownload(item)}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center">
                      <View
                        className="w-[50px] h-[50px] rounded-lg mr-3 items-center justify-center"
                        style={{ backgroundColor: getCategoryColor(item.category) }}
                      >
                        <Ionicons name="document-text" size={24} color="#fff" />
                      </View>
                      <View className="flex-1 pr-12">
                        <Text className="text-[15px] font-karla-bold text-[#111827] mb-1" numberOfLines={2}>
                          {item.displayName || item.fileName}
                        </Text>
                        
                        {/* Organization name */}
                        {item.organizationName && (
                          <Text className="text-[11px] font-karla text-[#9333EA] mb-1">
                            by {item.organizationName}
                          </Text>
                        )}
                        
                        <View className="flex-row flex-wrap mb-1">
                          <CategoryTag label={item.category || "General"} />
                          {item.tags
                            ?.filter((tag: string) => tag !== item.category) // Remove category from tags
                            .filter((tag: string, index: number, self: string[]) => self.indexOf(tag) === index) // Remove duplicates
                            .slice(0, 2)
                            .map((tag: string, idx: number) => (
                              <CategoryTag key={idx} label={tag} />
                            ))}
                        </View>
                        
                        <View className="flex-row items-center justify-between">
                          <Text className="text-[12px] font-karla text-[#6B7280]">
                            {formatDate(item.createdAt)} • {formatFileSize(item.fileSize)}
                          </Text>
                          {item.downloadCount > 0 && (
                            <Text className="text-[11px] font-karla-bold text-[#6C3EF8]">
                              {item.downloadCount} downloads
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </>
        ) : (
          <View className="py-12 items-center px-8">
            <Ionicons 
              name={selectedFilter === "bookmarked" ? "bookmark-outline" : "folder-open-outline"} 
              size={64} 
              color="#CCC" 
            />
            <Text className="text-[#666] font-karla-bold text-[16px] mt-3 text-center">
              {selectedFilter === "bookmarked" 
                ? "No bookmarked resources yet" 
                : searchQuery 
                  ? "No resources found" 
                  : "No resources available yet"}
            </Text>
            <Text className="text-[#999] font-karla text-center mt-1">
              {selectedFilter === "bookmarked"
                ? "Tap the bookmark icon on resources to save them here"
                : searchQuery
                  ? "Try a different search term"
                  : "Check back later for learning materials"}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Library;
