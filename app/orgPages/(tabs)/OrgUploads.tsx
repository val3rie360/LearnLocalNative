import { Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../contexts/AuthContext";
import {
  formatFileSize,
  getOrganizationUploads
} from "../../../services/cloudinaryUploadService";

const FileCard = ({
  upload,
  onPress,
  onLongPress,
}: {
  upload: any;
  onPress: () => void;
  onLongPress: () => void;
}) => {
  const thumbnailUrl = upload.cloudinarySecureUrl 
    ? upload.cloudinarySecureUrl.replace('/upload/', '/upload/w_150,h_150,c_fill,f_auto,q_auto/')
    : null;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 items-center m-2 flex-1 min-w-[140px] max-w-[48%] shadow-md"
    >
      {/* PDF Thumbnail or Icon */}
      <View className="mb-3 w-full items-center">
        {thumbnailUrl ? (
          <View className="relative">
            <Image
              source={{ uri: thumbnailUrl }}
              className="w-20 h-20 rounded-lg"
              resizeMode="cover"
            />
            <View className="absolute bottom-0 right-0 bg-red-500 rounded-full p-1">
              <Text className="text-white text-[10px] font-karla-bold">PDF</Text>
            </View>
          </View>
        ) : (
          <View className="bg-red-50 rounded-lg p-4">
            <Feather name="file-text" size={48} color="#EF4444" />
          </View>
        )}
      </View>

      {/* File Info */}
      <Text
        className="text-[15px] font-karla-bold text-[#222] mb-1 text-center"
        numberOfLines={2}
      >
        {upload.displayName || upload.fileName}
      </Text>
      <Text className="text-xs text-[#888] text-center font-karla mb-1">
        {formatDate(upload.createdAt)}
      </Text>
      <Text className="text-xs text-[#666] text-center font-karla">
        {formatFileSize(upload.fileSize)}
      </Text>
      
      {/* Download Count */}
      {upload.downloadCount > 0 && (
        <View className="flex-row items-center mt-2">
          <MaterialIcons name="download" size={12} color="#6C63FF" />
          <Text className="text-xs text-[#6C63FF] ml-1 font-karla">
            {upload.downloadCount} downloads
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function OrgUploads() {
  const router = useRouter();
  const { user } = useAuth();
  const [uploads, setUploads] = useState<any[]>([]);
  const [filteredUploads, setFilteredUploads] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Fetch uploads
  const fetchUploads = async () => {
    if (!user?.uid) return;

    try {
      setError("");
      console.log('Fetching uploads for organization:', user.uid);
      const data = await getOrganizationUploads(user.uid);
      console.log('Fetched uploads:', data.length);
      setUploads(data);
      setFilteredUploads(data);
    } catch (err: any) {
      console.error('Error fetching uploads:', err);
      setError(err.message || 'Failed to load uploads');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, [user?.uid]);

  // Sort uploads
  const sortUploads = (uploadsToSort: any[]) => {
    const sorted = [...uploadsToSort];
    
    sorted.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          comparison = bTime - aTime;
          break;
        case 'name':
          const aName = (a.displayName || a.fileName || '').toLowerCase();
          const bName = (b.displayName || b.fileName || '').toLowerCase();
          comparison = bName.localeCompare(aName);
          break;
        case 'size':
          comparison = (b.fileSize || 0) - (a.fileSize || 0);
          break;
      }
      
      return sortOrder === 'asc' ? -comparison : comparison;
    });
    
    return sorted;
  };

  // Handle search and sort
  useEffect(() => {
    let result = uploads;
    
    // Apply search filter
    if (searchQuery.trim() !== "") {
      result = result.filter((upload) =>
        (upload.displayName || upload.fileName)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    result = sortUploads(result);
    
    setFilteredUploads(result);
  }, [searchQuery, uploads, sortBy, sortOrder]);

  // Handle file open
  const handleFilePress = async (upload: any) => {
    try {
      const url = upload.cloudinarySecureUrl || upload.cloudinaryUrl;
      if (url) {
        console.log('Opening file:', url);
        await Linking.openURL(url);
      }
    } catch (err) {
      console.error('Error opening file:', err);
    }
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchUploads();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#ECEAFF]" edges={["top"]}>
      <LinearGradient colors={["#ECEAFF", "#4b1eb4c8"]} style={{ flex: 1 }}>
        <View className="flex-1 px-5 pt-8">
          {/* Header */}
          <View className="flex-col mb-3.5">
            <Text className="text-[28px] text-[#222] font-karla-bold mt-2">
              My Uploads
            </Text>
            <Text className="text-[15px] text-black mt-1 font-karla">
              {uploads.length} file{uploads.length !== 1 ? 's' : ''} uploaded
            </Text>
          </View>

          {/* Search */}
          <View className="flex-row items-center bg-white rounded-3xl px-4 h-11 mb-4.5 border border-[#ECECEC]">
            <Feather
              name="search"
              size={18}
              color="#000000ff"
              className="mr-2"
            />
            <TextInput
              className="flex-1 text-[15px] text-[#222] font-karla"
              placeholder="Search for learning materials..."
              placeholderTextColor="#B0B0B0"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Feather name="x" size={18} color="#888" />
              </TouchableOpacity>
            )}
          </View>
          <View className="h-px bg-[#ECECEC] w-full my-2" />

          {/* Section Title with Sort */}
          <View className="flex-row items-center justify-between mb-2 mt-2">
            <Text className="text-[18px] font-karla-bold text-[#222]">
              {searchQuery ? `Results (${filteredUploads.length})` : 'Your files'}
            </Text>
            <View className="flex-row items-center space-x-2">
              {/* Sort Button */}
              <TouchableOpacity
                onPress={() => setShowSortMenu(!showSortMenu)}
                className="flex-row items-center px-2 py-1"
              >
                <Feather 
                  name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'} 
                  size={18} 
                  color="#6C63FF" 
                />
                <Text className="text-sm text-[#6C63FF] ml-1 font-karla">
                  {sortBy === 'date' ? 'Date' : sortBy === 'name' ? 'Name' : 'Size'}
                </Text>
              </TouchableOpacity>
              {/* Refresh Button */}
              <TouchableOpacity onPress={onRefresh}>
                <Feather name="refresh-cw" size={20} color="#6C63FF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sort Menu Dropdown */}
          {showSortMenu && (
            <View className="bg-white rounded-xl shadow-lg border border-[#E5E0FF] mb-3 p-2">
              <TouchableOpacity
                className="flex-row items-center py-3 px-4 rounded-lg"
                onPress={() => {
                  setSortBy('date');
                  setShowSortMenu(false);
                }}
              >
                <Feather name="calendar" size={18} color={sortBy === 'date' ? '#6C63FF' : '#666'} />
                <Text className={`flex-1 ml-3 font-karla ${sortBy === 'date' ? 'font-karla-bold text-[#6C63FF]' : 'text-[#333]'}`}>
                  Date
                </Text>
                {sortBy === 'date' && (
                  <MaterialIcons name="check" size={20} color="#6C63FF" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center py-3 px-4 rounded-lg"
                onPress={() => {
                  setSortBy('name');
                  setShowSortMenu(false);
                }}
              >
                <Feather name="type" size={18} color={sortBy === 'name' ? '#6C63FF' : '#666'} />
                <Text className={`flex-1 ml-3 font-karla ${sortBy === 'name' ? 'font-karla-bold text-[#6C63FF]' : 'text-[#333]'}`}>
                  Name
                </Text>
                {sortBy === 'name' && (
                  <MaterialIcons name="check" size={20} color="#6C63FF" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center py-3 px-4 rounded-lg"
                onPress={() => {
                  setSortBy('size');
                  setShowSortMenu(false);
                }}
              >
                <Feather name="database" size={18} color={sortBy === 'size' ? '#6C63FF' : '#666'} />
                <Text className={`flex-1 ml-3 font-karla ${sortBy === 'size' ? 'font-karla-bold text-[#6C63FF]' : 'text-[#333]'}`}>
                  Size
                </Text>
                {sortBy === 'size' && (
                  <MaterialIcons name="check" size={20} color="#6C63FF" />
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View className="h-px bg-gray-200 my-2" />

              {/* Reverse Order Button */}
              <TouchableOpacity
                className="flex-row items-center justify-between py-3 px-4 rounded-lg"
                onPress={() => {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
              >
                <View className="flex-row items-center">
                  <Feather 
                    name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'} 
                    size={18} 
                    color="#6C63FF" 
                  />
                  <Text className="ml-3 font-karla text-[#6C63FF]">
                    {sortOrder === 'desc' ? 'Descending' : 'Ascending'}
                  </Text>
                </View>
                <MaterialIcons name="swap-vert" size={20} color="#6C63FF" />
              </TouchableOpacity>
            </View>
          )}

          {/* Loading State */}
          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#6C63FF" />
              <Text className="text-[#666] mt-4 font-karla">Loading your uploads...</Text>
            </View>
          ) : error ? (
            /* Error State */
            <View className="flex-1 justify-center items-center px-8">
              <Feather name="alert-circle" size={48} color="#EF4444" />
              <Text className="text-[#666] mt-4 text-center font-karla">{error}</Text>
              <TouchableOpacity
                onPress={fetchUploads}
                className="bg-[#6C63FF] rounded-full px-6 py-3 mt-4"
              >
                <Text className="text-white font-karla-bold">Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Files Grid */
            <FlatList
              data={filteredUploads}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={{ paddingBottom: 24 }}
              refreshing={refreshing}
              onRefresh={onRefresh}
              renderItem={({ item }) => (
                <FileCard upload={item} onPress={() => handleFilePress(item)} />
              )}
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center py-12">
                  <Feather name="inbox" size={64} color="#CCC" />
                  <Text className="text-center text-[#666] mt-4 text-[16px] font-karla-bold">
                    {searchQuery ? 'No files found' : 'No uploads yet'}
                  </Text>
                  <Text className="text-center text-[#888] mt-2 text-[14px] font-karla px-8">
                    {searchQuery
                      ? 'Try a different search term'
                      : 'Upload your first PDF from the Create tab'}
                  </Text>
                </View>
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
