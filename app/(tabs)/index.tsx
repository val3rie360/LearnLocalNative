import React from "react";
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#E0E3FF" }}>
            {/* Header Section */}
            <View style={{ backgroundColor: "#4B1EB4", borderBottomLeftRadius: 15, borderBottomRightRadius: 15, paddingBottom: 70 }}>
                {/* Header Text + Bell */}
                <View
                    style={{
                        padding: 30,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <View>
                        <Text style={{ fontSize: 22, color: "#fff" }}>
                            Hi, <Text style={{ fontWeight: "bold" }}>Rach!</Text>
                        </Text>
                        <Text style={{ fontSize: 14, color: "#EAEAEA" }}>
                            Discover what’s new today.
                        </Text>
                    </View>
                    <Ionicons name="notifications-outline" size={28} color="#fff" />
                </View>

                {/* Search Bar */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#fff",
                        marginHorizontal: 20,
                        marginTop: -10,
                        padding: 12,
                        borderRadius: 25,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        elevation: 4,
                    }}
                >
                    <Ionicons name="search-outline" size={20} color="#888" />
                    <TextInput
                        placeholder="Search for scholarships, study spaces, etc..."
                        placeholderTextColor="#888"
                        style={{ marginLeft: 8, flex: 1 }}
                    />
                </View>
            </View>

            {/* Upcoming Deadlines */}
            <View style={{ marginTop: -60, paddingHorizontal: 20 }}>
                <View
                    style={{
                        backgroundColor: "#fff",
                        padding: 20,
                        borderRadius: 20,
                        shadowColor: "#000",
                        shadowOpacity: 0.05,
                        shadowRadius: 8,
                        elevation: 4,
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
                        Upcoming Deadlines
                    </Text>
                    <Text style={{ color: "#4B1EB4", fontWeight: "600", marginBottom: 5 }}>
                        AUG 26: STEM Future Leaders Scholarship 2025
                    </Text>
                    <Text style={{ color: "#6C3EF8", marginBottom: 5 }}>
                        AUG 28: National Robotics Challenge 2025
                    </Text>
                    <Text style={{ color: "#6C3EF8", marginBottom: 5 }}>
                        AUG 28: Dumaguete Scholarships Program
                    </Text>
                    <TouchableOpacity>
                        <Text style={{ color: "#6C3EF8", marginTop: 8, textAlign: "right" }}>
                            See all
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Categories */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginVertical: 25,
                    paddingHorizontal: 10,
                }}
            >
                <CategoryItem icon="school-outline" label="Scholarships" bg="#34D399" />
                <CategoryItem icon="book-outline" label="Tutoring" bg="#8B5CF6" />
                <CategoryItem icon="home-outline" label="Study Spaces" bg="#FBBF24" />
                <CategoryItem icon="people-outline" label="Events" bg="#F87171" />
            </View>

            {/* Opportunities Section */}
            <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
                    Opportunities
                </Text>
                <View
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: 20,
                        padding: 20,
                        shadowColor: "#000",
                        shadowOpacity: 0.05,
                        shadowRadius: 8,
                        elevation: 3,
                    }}
                >
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "#4B1EB4" }}>
                        STEM Future Leaders Scholarship 2025
                    </Text>
                    <Text style={{ marginTop: 8, color: "#555" }}>
                        📅 Deadline: August 21, 2025
                    </Text>
                    <Text style={{ color: "#555" }}>💰 Amount: ₱50,000</Text>
                    <Text style={{ color: "#555" }}>
                        🎓 Eligibility: Grade 12 STEM strand students in the Philippines
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

function CategoryItem({
                          icon,
                          label,
                          bg,
                      }: {
    icon: string;
    label: string;
    bg: string;
}) {
    return (
        <View
            style={{
                width: 70,
                height: 70,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: bg,
            }}
        >
            <Ionicons name={icon} size={26} color="#fff" />
            <Text style={{ fontSize: 12, marginTop: 4, color: "#fff" }}>{label}</Text>
        </View>
    );
}


/* -----------ONBOARDING

       <View className="flex-1 justify-center items-center bg-[#3D0DBD]">
            <Image
                source={require("../../assets/images/learl.png")} // <-- replace with your logo path
                className="w-24 h-24"
                resizeMode="contain"
            />
            <Text className="text-logo text-4xl font-karla-bold">LearnLocal</Text>
            <Text className="text-logo text-lg font-karla">
                Learning starts where you are.
            </Text>


        </View>*/ //---------------------ONBOARDING
