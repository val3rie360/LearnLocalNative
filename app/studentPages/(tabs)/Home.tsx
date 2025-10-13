import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { memo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchBar } from "../../../components/Common";
import OpportunityCard from "../../../components/OpportunityCard";
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

// Static data outside component for efficiency
const DEADLINES = [
  { date: "AUG 28", title: "STEM Future Leaders Scholarship 2025" },
  { date: "AUG 29", title: "National Robotics Challenge 2025" },
  { date: "AUG 30", title: "Dumaguete Scholarships Program" },
];

const CATEGORIES = [
  { icon: "school-outline", label: "Scholarships", bg: "#48DEE6" },
  { icon: "book-outline", label: "Tutoring", bg: "#5548E6" },
  {
    icon: "desk",
    label: "Study Spaces",
    bg: "#FBBF24",
    family: "MaterialCommunityIcons",
  },
  { icon: "people-outline", label: "Events", bg: "#F25B5E" },
];

const OPPORTUNITIES = [
  //placeholder data
  {
    title: "STEM Future Leaders Scholarship 2025",
    postedBy: "STEM Alliance PH",
    deadline: "August 28, 2025",
    amount: "₱50,000",
    eligibility: "Grade 12 STEM strand students in the Philippines",
    description:
      "A scholarship program aimed at empowering future leaders in science, technology, engineering, and mathematics.",
    tag: "Scholarships",
  },
];

type CategoryItemProps = {
  icon: string;
  family?: string;
  bg: string;
  label: string;
};

const CategoryItem = memo(function CategoryItem({
  icon,
  family = "Ionicons",
  bg,
  label,
}: CategoryItemProps) {
  const IconComponent =
    family === "MaterialCommunityIcons" ? MaterialCommunityIcons : Ionicons;
  return (
    <View className="items-center">
      <View
        className="w-[63px] h-[63px] rounded-lg justify-center items-center shadow-sm"
        style={{ backgroundColor: bg }}
      >
        <IconComponent name={icon as any} size={25} color="#fff" />
      </View>
      <Text className="mt-2.5 text-[13px] font-karla-bold text-black text-center">
        {label}
      </Text>
    </View>
  );
});

export default function Home() {
  const router = useRouter();
  const { user, profileData, profileLoading } = useAuth();

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

  return (
    <SafeAreaView className="flex-1 bg-[#4B1EB4]" edges={["top"]}>
      <ScrollView className="bg-[#E0E3FF] flex-1">
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
        <View className="flex-row justify-around my-5 px-4">
          {CATEGORIES.map((c) => (
            <CategoryItem key={c.label} {...c} />
          ))}
        </View>
        {/* Opportunities */}
        <LinearGradient
          colors={["#fff", "#DADEFF"]}
          style={{ padding: 25, marginTop: 20 }}
        >
          <Text className="text-[20px] font-karla-bold mb-3">
            Opportunities
          </Text>
          {OPPORTUNITIES.map((op) => (
            <OpportunityCard key={op.title} {...op} />
          ))}
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}
