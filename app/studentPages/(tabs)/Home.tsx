import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { memo, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchBar } from "../../../components/Common";
import OpportunityCard from "../../../components/OpportunityCard";
import { useAuth } from "../../../contexts/AuthContext";
import { getAllActiveOpportunities } from "../../../services/firestoreService";

interface ProfileData {
  name?: string;
  email?: string;
  role?: "student" | "organization";
  createdAt?: {
    seconds: number;
  };
  verificationFileUrl?: string;
  verificationStatus?: "pending" | "verified" | "rejected";
}

// Static data outside component for efficiency
const DEADLINES = [
  { date: "AUG 28", title: "STEM Future Leaders Scholarship 2025" },
  { date: "AUG 29", title: "National Robotics Challenge 2025" },
  { date: "AUG 30", title: "Dumaguete Scholarships Program" },
];

const CATEGORIES = [
  { icon: "apps", label: "All", bg: "#6B7280", value: "all" },
  {
    icon: "school-outline",
    label: "Scholarships",
    bg: "#48DEE6",
    value: "scholarships",
  },
  {
    icon: "trophy",
    label: "Competitions",
    bg: "#5548E6",
    value: "competitions",
  },
  {
    icon: "bulb-outline",
    label: "Workshops",
    bg: "#F59E0B",
    value: "workshops",
  },
  {
    icon: "desk",
    label: "Study Spots",
    bg: "#FBBF24",
    family: "MaterialCommunityIcons",
    value: "studySpots",
  },
  // Resources redirects to Library tab instead of filtering
  {
    icon: "book-outline",
    label: "Resources",
    bg: "#F25B5E",
    value: "resources",
    isRedirect: true,
    redirectTo: "/studentPages/(tabs)/Library",
  },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First", icon: "arrow-down" },
  { value: "oldest", label: "Oldest First", icon: "arrow-up" },
  { value: "deadline-soon", label: "Deadline: Soonest First", icon: "time" },
  {
    value: "deadline-far",
    label: "Deadline: Latest First",
    icon: "time-outline",
  },
];

type CategoryItemProps = {
  icon: string;
  family?: string;
  bg: string;
  label: string;
  isSelected: boolean;
  onPress: () => void;
};

const CategoryItem = memo(function CategoryItem({
  icon,
  family = "Ionicons",
  bg,
  label,
  isSelected,
  onPress,
}: CategoryItemProps) {
  const IconComponent =
    family === "MaterialCommunityIcons" ? MaterialCommunityIcons : Ionicons;
  return (
    <TouchableOpacity onPress={onPress} className="items-center">
      <View
        className={`w-[63px] h-[63px] rounded-lg justify-center items-center shadow-sm ${
          isSelected ? "border-2 border-[#4B1EB4]" : ""
        }`}
        style={{
          backgroundColor: bg,
          opacity: isSelected ? 1 : 0.7,
        }}
      >
        <IconComponent name={icon as any} size={25} color="#fff" />
        {isSelected && (
          <View className="absolute -top-1 -right-1 bg-[#4B1EB4] rounded-full w-5 h-5 items-center justify-center">
            <Ionicons name="checkmark" size={14} color="#fff" />
          </View>
        )}
      </View>
      <Text
        className="mt-2.5 text-[13px] text-black text-center"
        style={{
          fontFamily: isSelected ? "Karla-Bold" : "Karla-Regular",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
});

export default function Home() {
  const router = useRouter();
  const { user, profileData, profileLoading } = useAuth();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get display name with fallbacks
  const getDisplayName = () => {
    if (profileLoading) return "there";
    return (
      profileData?.name ||
      user?.displayName ||
      user?.email?.split("@")[0] ||
      "there"
    );
  };

  // Format date for display
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper function to extract earliest deadline from opportunity
  const getEarliestDeadline = (opportunity: any): Date => {
    // Check for dateMilestones array
    if (
      opportunity.dateMilestones &&
      Array.isArray(opportunity.dateMilestones) &&
      opportunity.dateMilestones.length > 0
    ) {
      const dates = opportunity.dateMilestones
        .map((milestone: any) => {
          if (milestone.date?.toDate) return milestone.date.toDate();
          if (milestone.date) return new Date(milestone.date);
          return null;
        })
        .filter((date: any) => date && !isNaN(date.getTime()));

      if (dates.length > 0) {
        return new Date(Math.min(...dates.map((d: Date) => d.getTime())));
      }
    }

    // Check for deadline field
    if (opportunity.deadline) {
      const deadline = opportunity.deadline.toDate
        ? opportunity.deadline.toDate()
        : new Date(opportunity.deadline);
      if (!isNaN(deadline.getTime())) return deadline;
    }

    // Fallback to createdAt + 30 days if no deadline
    const fallback =
      opportunity.createdAt?.toDate?.() || new Date(opportunity.createdAt);
    return new Date(fallback.getTime() + 30 * 24 * 60 * 60 * 1000);
  };

  // Filter opportunities by category (excluding resources from all categories)
  const filterOpportunities = (opps: any[]) => {
    // Always exclude resources from the feed and filter by verified organizations
    return opps.filter((op) => {
      // Check multiple possible field names and handle case-insensitivity
      const specificCollection = (op.specificCollection || op.category || '').toLowerCase();
      const isNotResource = 
        specificCollection !== "resources" && 
        specificCollection !== "resource" &&
        op.type !== "resources" &&
        op.type !== "resource";
      
      const matchesCategory =
        selectedCategory === "all" ||
        op.specificCollection === selectedCategory ||
        specificCollection === selectedCategory.toLowerCase();
      
      const isVerified = isOpportunityOrganizationVerified(op);
      
      return isNotResource && matchesCategory && isVerified;
    });
  };

  // Sort opportunities based on selected criteria
  const sortOpportunities = (opps: any[]) => {
    const sorted = [...opps];

    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

      case "oldest":
        return sorted.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
          return dateA.getTime() - dateB.getTime();
        });

      case "deadline-soon":
        return sorted.sort((a, b) => {
          const deadlineA = getEarliestDeadline(a);
          const deadlineB = getEarliestDeadline(b);
          return deadlineA.getTime() - deadlineB.getTime();
        });

      case "deadline-far":
        return sorted.sort((a, b) => {
          const deadlineA = getEarliestDeadline(a);
          const deadlineB = getEarliestDeadline(b);
          return deadlineB.getTime() - deadlineA.getTime();
        });

      default:
        return sorted;
    }
  };

  // Get filtered and sorted opportunities
  const getDisplayedOpportunities = () => {
    const filtered = filterOpportunities(opportunities);
    return sortOpportunities(filtered);
  };

  // Fetch opportunities
  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const data = await getAllActiveOpportunities();
      
      // Log resource filtering for debugging
      const resourceOpps = data.filter((op: any) => {
        const specificCollection = (op.specificCollection || op.category || '').toLowerCase();
        return specificCollection === "resources" || 
               specificCollection === "resource" ||
               op.type === "resources" ||
               op.type === "resource";
      });
      
      if (resourceOpps.length > 0) {
        console.log(`🔍 Filtered out ${resourceOpps.length} resource opportunities from feed`);
      }
      
      setOpportunities(data);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      setOpportunities([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOpportunities();
  };

  // Get organization name from opportunity
  const getOpportunityOrganizationName = (op: any): string =>
    op?.organizationProfile?.name ??
    op?.organizationName ??
    op?.organization?.name ??
    "Organization";

  const isOpportunityOrganizationVerified = (op: any): boolean =>
    (op?.organizationProfile?.verificationStatus ??
      op?.organizationVerificationStatus ??
      op?.organization?.verificationStatus) === "verified";

  return (
    <SafeAreaView className="flex-1 bg-[#4B1EB4]" edges={["top"]}>
      <ScrollView
        className="bg-[#E0E3FF] flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="bg-[#4B1EB4] rounded-b-2xl pb-[100px] px-5">
          <View className=" pt-5 flex-row justify-between items-center">
            <View>
              <Text className="text-[26px] text-white font-karla">
                Hi, <Text className="font-karla-bold">{getDisplayName()}!</Text>
              </Text>
              <Text className="text-[14px] mb-4 text-[#EAEAEA] font-karla">
                Discover what's new today.
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push("../notifications")}>
              <Ionicons
                name="notifications-circle-outline"
                size={43}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
          <SearchBar />
        </View>
        {/* Upcoming Deadlines */}
        <View className="mt-[-90px] px-5">
          <View
            className="bg-white p-4 rounded-2xl shadow-sm"
            style={{ elevation: 4 }}
          >
            <Text className="text-[20px] font-karla-bold mb-3">
              Upcoming Deadlines
            </Text>
            {DEADLINES.map((item, idx) => (
              <View key={item.date}>
                <Text className="text-[#4B1EB4] font-karla text-[15px] mb-0.5">
                  <Text className="font-karla-bold">{item.date}</Text>:{" "}
                  {item.title}
                </Text>
                {idx < DEADLINES.length - 1 && (
                  <View className="h-0.5 bg-[#E5E5E5] my-1" />
                )}
              </View>
            ))}
            <TouchableOpacity>
              <Text className="text-[#605E8F] mt-2 text-right font-karla-bold">
                See all
              </Text>
            </TouchableOpacity>
            {/* Fade effect */}
            <LinearGradient
              colors={["transparent", "#fff"]}
              style={{
                position: "absolute",
                bottom: 40,
                left: 0,
                right: 0,
                height: 60,
              }}
              pointerEvents="none"
            />
          </View>
        </View>
        {/* Categories */}
        <View className="my-5">
          <Text className="text-[16px] font-karla-bold mb-3 px-5 text-[#333]">
            Filter by Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
          >
            {CATEGORIES.map((c) => (
              <CategoryItem
                key={c.value}
                {...c}
                isSelected={selectedCategory === c.value}
                onPress={() => {
                  if (c.isRedirect && c.redirectTo) {
                    console.log(`Redirecting to: ${c.redirectTo}`);
                    try {
                      router.push(c.redirectTo as any);
                    } catch (error) {
                      console.error("Navigation error:", error);
                    }
                  } else {
                    setSelectedCategory(c.value);
                  }
                }}
              />
            ))}
          </ScrollView>
        </View>
        {/* Opportunities */}
        <LinearGradient
          colors={["#fff", "#DADEFF"]}
          style={{ padding: 25, marginTop: 20 }}
        >
          <View className="flex-row justify-between items-center mb-3">
            <View>
              <Text className="text-[20px] font-karla-bold">Opportunities</Text>
              {!loading && (
                <Text className="text-[13px] text-[#666] font-karla mt-0.5">
                  {getDisplayedOpportunities().length}{" "}
                  {getDisplayedOpportunities().length === 1
                    ? "result"
                    : "results"}
                  {selectedCategory !== "all" &&
                    ` in ${CATEGORIES.find((c) => c.value === selectedCategory)?.label}`}
                </Text>
              )}
            </View>

            {/* Sort Button */}
            <TouchableOpacity
              onPress={() => setShowSortModal(true)}
              className="flex-row items-center bg-white px-3 py-2 rounded-lg shadow-sm"
              style={{ elevation: 2 }}
            >
              <Ionicons name="funnel" size={16} color="#4B1EB4" />
              <Text className="ml-1.5 text-[#4B1EB4] font-karla-bold text-[13px]">
                {SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label.split(
                  ":"
                )[0] || "Sort"}
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#4B1EB4" />
              <Text className="text-[#666] mt-2 font-karla">
                Loading opportunities...
              </Text>
            </View>
          ) : getDisplayedOpportunities().length > 0 ? (
            getDisplayedOpportunities().map((op) => (
              <OpportunityCard
                key={op.id}
                title={op.title}
                postedBy={getOpportunityOrganizationName(op)}
                posterVerified={isOpportunityOrganizationVerified(op)}
                deadline={formatDate(op.createdAt)}
                amount={op.amount || "N/A"}
                eligibility={op.eligibility || "See details"}
                description={op.description}
                tag={op.category}
                onViewDetails={() =>
                  router.push({
                    pathname: "../opportunity",
                    params: {
                      id: op.id,
                      specificCollection: op.specificCollection,
                    },
                  })
                }
              />
            ))
          ) : (
            <View className="py-8 items-center px-8">
              <Ionicons name="search-outline" size={48} color="#CCC" />
              <Text className="text-[#666] font-karla-bold text-[16px] mt-3">
                No opportunities found
              </Text>
              <Text className="text-[#999] font-karla text-center mt-1">
                {selectedCategory !== "all"
                  ? `No ${CATEGORIES.find((c) => c.value === selectedCategory)?.label.toLowerCase()} available right now`
                  : "Check back later for new opportunities"}
              </Text>
              {selectedCategory !== "all" && (
                <TouchableOpacity
                  onPress={() => setSelectedCategory("all")}
                  className="mt-4 px-4 py-2 bg-[#4B1EB4] rounded-lg"
                >
                  <Text className="text-white font-karla-bold">View All</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </LinearGradient>
      </ScrollView>

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
          className="flex-1 bg-black/50 justify-center items-center"
        >
          <View
            className="bg-white rounded-2xl w-[85%] shadow-lg"
            style={{ elevation: 10 }}
            onStartShouldSetResponder={() => true}
          >
            {/* Modal Header */}
            <View className="border-b border-gray-200 p-4">
              <Text className="text-[18px] font-karla-bold text-center">
                Sort Opportunities
              </Text>
            </View>

            {/* Sort Options */}
            <View className="py-2">
              {SORT_OPTIONS.map((option, index) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    setSortBy(option.value);
                    setShowSortModal(false);
                  }}
                  className={`flex-row items-center px-4 py-3.5 ${
                    index < SORT_OPTIONS.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                  style={{
                    backgroundColor:
                      sortBy === option.value ? "#F6F4FE" : "transparent",
                  }}
                >
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{
                      backgroundColor:
                        sortBy === option.value ? "#4B1EB4" : "#E0E3FF",
                    }}
                  >
                    <Ionicons
                      name={option.icon as any}
                      size={20}
                      color={sortBy === option.value ? "#fff" : "#4B1EB4"}
                    />
                  </View>

                  <Text
                    className="flex-1 font-karla text-[15px]"
                    style={{
                      fontFamily:
                        sortBy === option.value
                          ? "Karla-Bold"
                          : "Karla-Regular",
                      color: sortBy === option.value ? "#4B1EB4" : "#333",
                    }}
                  >
                    {option.label}
                  </Text>

                  {sortBy === option.value && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#4B1EB4"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Cancel Button */}
            <View className="border-t border-gray-200 p-3">
              <TouchableOpacity
                onPress={() => setShowSortModal(false)}
                className="py-2.5 items-center"
              >
                <Text className="text-[#666] font-karla-bold text-[15px]">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
