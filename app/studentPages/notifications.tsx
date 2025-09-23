import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const notifications = [
  {
    id: 1,
    icon: <FontAwesome5 name="chalkboard-teacher" size={26} color="#fff" />,
    title: (
      <>
        <Text className="font-karla-bold text-primaryb">
          New workshop available:
        </Text>
        <Text className="font-karla text-primaryb">
          {" "}
          Robotics for Beginners starts Aug 25.
        </Text>
      </>
    ),
    time: "24 mins ago",
    date: "",
    bg: "bg-[#6C47FF]",
  },
  {
    id: 2,
    icon: <Feather name="alert-circle" size={26} color="#fff" />,
    title: (
      <>
        <Text className="font-karla-bold text-primaryb">Reminder:</Text>
        <Text className="font-karla text-primaryb">
          {" "}
          Submit your scholarship application before August 20.
        </Text>
      </>
    ),
    time: "",
    date: "August 15, 2025",
    bg: "bg-[#6C47FF]",
  },
  {
    id: 3,
    icon: <Feather name="users" size={26} color="#fff" />,
    title: (
      <Text className="font-karla text-primaryb">
        Free career counselling event in your area this weekend.
      </Text>
    ),
    time: "",
    date: "August 5, 2025",
    bg: "bg-[#6C47FF]",
  },
  {
    id: 4,
    icon: <Feather name="award" size={26} color="#fff" />,
    title: (
      <Text className="font-karla text-primaryb">
        "Workshop ‘Creative Writing 101’ starts tomorrow at 4 PM."
      </Text>
    ),
    time: "",
    date: "July 29, 2025",
    bg: "bg-[#6C47FF]",
  },
];

export default function Notifications() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#fff", "#e6e6fa"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 px-5 pt-10">
        {/* Back Arrow */}
        <TouchableOpacity
          className="absolute left-5 top-10"
          onPress={() => router.back()}
          hitSlop={10}
        >
          <Feather name="arrow-left" size={22} color="#18181B" />
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-[22px] font-karla-bold text-[#18181B] mt-2 mb-6">
          Notifications
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {notifications.map((notif, idx) => (
            <React.Fragment key={notif.id}>
              <View className="flex-row items-start mb-6">
                <View
                  className={`w-12 h-12 rounded-full ${notif.bg} items-center justify-center mr-3`}
                >
                  {notif.icon}
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-karla text-[#18181B] mb-1">
                    {notif.title}
                  </Text>
                  {notif.time ? (
                    <Text className="text-[13px] font-karla text-[#6B7280]">
                      {notif.time}
                    </Text>
                  ) : (
                    <Text className="text-[13px] font-karla text-[#6B7280]">
                      {notif.date}
                    </Text>
                  )}
                </View>
              </View>
              {idx < notifications.length - 1 && (
                <View className="border-t border-[#e0e0e0] mb-4" />
              )}
            </React.Fragment>
          ))}
          <View className="border-t border-[#e0e0e0] my-2" />
          <Text className="text-center text-[14px] font-karla text-[#6B7280] mt-4 mb-8">
            End of Notifications
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
