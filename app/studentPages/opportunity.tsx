import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDownloadUrl } from "../../services/cloudinaryUploadService";
import { getOpportunityDetails } from "../../services/firestoreService";

const Opportunity = () => {
  const { id, specificCollection } = useLocalSearchParams<{
    id: string;
    specificCollection: string;
  }>();
  const [opportunity, setOpportunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id || !specificCollection) {
        setError("Missing opportunity information");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getOpportunityDetails(id, specificCollection);
        setOpportunity(data);
      } catch (err: any) {
        console.error("Error fetching opportunity:", err);
        setError(err.message || "Failed to load opportunity");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, specificCollection]);

  // Format date helper
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleRegister = async () => {
    const rawLink = opportunity?.link?.trim();
    if (!rawLink) {
      Alert.alert("Unavailable", "No registration link provided.");
      return;
    }
    const normalizedLink = /^https?:\/\//i.test(rawLink)
      ? rawLink
      : `https://${rawLink}`;
    const canOpen = await Linking.canOpenURL(normalizedLink);
    if (!canOpen) {
      Alert.alert("Error", "Cannot open this link.");
      return;
    }
    await Linking.openURL(normalizedLink);
  };

  const handleMemorandumDownload = async () => {
    if (!opportunity?.memorandumCloudinaryId) {
      Alert.alert("Error", "Memorandum not available.");
      return;
    }

    try {
      const downloadUrl = await getDownloadUrl(opportunity.memorandumCloudinaryId);
      const canOpen = await Linking.canOpenURL(downloadUrl);
      
      if (!canOpen) {
        Alert.alert("Error", "Cannot open the memorandum.");
        return;
      }
      
      await Linking.openURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading memorandum:", error);
      Alert.alert("Error", "Failed to download memorandum.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F6F4FE] items-center justify-center">
        <ActivityIndicator size="large" color="#4B1EB4" />
        <Text className="text-[#666] mt-4 font-karla">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error || !opportunity) {
    return (
      <SafeAreaView className="flex-1 bg-[#F6F4FE] items-center justify-center px-8">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-[#666] text-center font-karla mt-4">
          {error || "Opportunity not found"}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F6F4FE]" edges={["top", "bottom"]}>
      {/* Header */}
      <View className="bg-[#4B1EB4] rounded-b-2xl pb-7 pt-12 px-5">
        <Text className="text-white font-karla-bold text-[28px] leading-tight mb-3">
          {opportunity.title}
        </Text>
        <View className="flex-row items-center mb-4">
          <View className="bg-[#FDE68A] rounded-full px-3 py-1 mr-2">
            <Text className="text-[#92400E] text-[13px] font-karla-bold">
              {opportunity.category || "Opportunity"}
            </Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="bookmark-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center mb-1">
          <Ionicons name="person-outline" size={16} color="#fff" />
          <Text className="ml-2 text-white text-[15px] font-karla">
            <Text className="font-karla-bold">Posted by:</Text>{" "}
            {opportunity.organizationName || "Organization"}
          </Text>
        </View>
        <View className="flex-row items-center mb-1">
          <Ionicons name="calendar-outline" size={16} color="#fff" />
          <Text className="ml-2 text-white text-[15px] font-karla">
            <Text className="font-karla-bold">Date:</Text>{" "}
            {formatDate(opportunity.createdAt)}
          </Text>
        </View>
        {(opportunity.location?.address || opportunity.studySpotLocation) && (
          <View className="flex-row items-center">
            <MaterialIcons name="location-on" size={16} color="#fff" />
            <Text className="ml-2 text-white text-[15px] font-karla">
              <Text className="font-karla-bold">Location:</Text>{" "}
              {opportunity.location?.address || opportunity.studySpotLocation}
            </Text>
          </View>
        )}
      </View>

      {/* Everything below header */}
      <View className="flex-1 bg-[#F6F4FE]">
        <ScrollView
          className="flex-1 px-5 pt-4"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Info Row */}
          {opportunity.amount && (
            <View className="flex-row justify-between mb-5">
              <View
                className="bg-white rounded-xl px-3 py-3 items-center flex-1 mx-1 shadow-sm"
                style={{ elevation: 2 }}
              >
                <Text className="font-karla-bold text-[#18181B] text-[13px] mb-1">
                  {opportunity.amount}
                </Text>
                <Text className="text-[#6B7280] text-[11px] font-karla">
                  Amount
                </Text>
              </View>
            </View>
          )}

          {/* Description & Requirements */}
          <View
            className="bg-white rounded-xl p-4 mb-6 shadow-sm"
            style={{ elevation: 2 }}
          >
            <Text className="font-karla-bold text-[16px] text-[#18181B] mb-2">
              Description
            </Text>
            <Text className="text-[#605E8F] text-[14px] font-karla mb-3">
              {opportunity.description || "No description available"}
            </Text>

            {opportunity.eligibility && (
              <>
                <Text className="font-karla-bold text-[16px] text-[#18181B] mb-2">
                  Eligibility
                </Text>
                <Text className="text-[#605E8F] text-[14px] font-karla mb-3">
                  {opportunity.eligibility}
                </Text>
              </>
            )}

            {opportunity.dateMilestones &&
              opportunity.dateMilestones.length > 0 && (
                <>
                  <Text className="font-karla-bold text-[16px] text-[#18181B] mb-2">
                    Important Dates
                  </Text>
                  {opportunity.dateMilestones.map(
                    (milestone: any, idx: number) => (
                      <Text
                        key={idx}
                        className="text-[#605E8F] text-[14px] font-karla mb-1"
                      >
                        • {milestone.name}: {milestone.date}
                      </Text>
                    )
                  )}
                </>
              )}
          </View>

          {/* Official Memorandum Section */}
          {opportunity.memorandumCloudinaryId && (
            <View
              className="bg-white rounded-xl p-4 mb-6 shadow-sm"
              style={{ elevation: 2 }}
            >
              <Text className="font-karla-bold text-[16px] text-[#18181B] mb-3">
                Official Memorandum
              </Text>
              <TouchableOpacity
                className="bg-[#F0EDFF] rounded-xl p-4 flex-row items-center justify-between"
                onPress={handleMemorandumDownload}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center flex-1">
                  <View className="bg-[#4B1EB4] rounded-lg p-2 mr-3">
                    <Ionicons name="document-text" size={24} color="#fff" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-karla-bold text-[14px] text-[#18181B] mb-1">
                      {opportunity.memorandumFile?.name || "Official Memorandum"}
                    </Text>
                    <Text className="text-[#6B7280] text-[12px] font-karla">
                      Tap to view or download
                    </Text>
                  </View>
                </View>
                <Ionicons name="download-outline" size={20} color="#4B1EB4" />
              </TouchableOpacity>
            </View>
          )}

          {/* Register Button */}
          <View className="items-center mb-4">
            <TouchableOpacity
              className={`bg-[#4B1EB4] rounded-full py-3 px-8 items-center w-full max-w-[300px] ${!opportunity.link ? "opacity-50" : ""}`}
              activeOpacity={0.8}
              disabled={!opportunity.link}
              onPress={handleRegister}
            >
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
