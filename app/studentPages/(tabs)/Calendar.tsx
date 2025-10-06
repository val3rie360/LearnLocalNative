import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

const deadlines = [
  {
    date: "AUG 28",
    title: "STEM Future Leaders Scholarship 2025",
    tag: "Scholarships",
    tagColor: "bg-[#D1FAFF]",
    tagText: "text-[#0CA5E9]",
    viewColor: "text-[#6C63FF]",
  },
  {
    date: "AUG 29",
    title: "Dumaguete City Scholars Program",
    tag: "Scholarships",
    tagColor: "bg-[#D1FAFF]",
    tagText: "text-[#0CA5E9]",
    viewColor: "text-[#6C63FF]",
  },
  {
    date: "AUG 30",
    title: "National Robotics Challenge 2025",
    tag: "Events",
    tagColor: "bg-[#FECACA]",
    tagText: "text-[#B91C1C]",
    viewColor: "text-[#6C63FF]",
  },
];

const initialMarkedDates: Record<string, any> = {
  "2025-08-28": { marked: true, dotColor: "#6C63FF" },
  "2025-08-29": { marked: true, dotColor: "#F4B740" },
  "2025-08-30": { marked: true, dotColor: "#ff0a0aff" },
};

const SELECTED_COLOR = "#4B1EB4";

const Calendar = () => {
  const router = useRouter();
  const today = new Date();
  const todayString = today.toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(todayString);

  // Build markedDates: always highlight the selected date
  const markedDates = Object.keys(initialMarkedDates).reduce(
    (acc, date) => {
      acc[date] = { ...initialMarkedDates[date] };
      return acc;
    },
    {} as Record<string, any>
  );

  markedDates[selectedDate] = {
    ...(markedDates[selectedDate] || {}),
    selected: true,
    selectedColor: SELECTED_COLOR,
  };

  return (
    <SafeAreaView className="flex-1 bg-[#4B1EB4]" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        {/* Title */}
        <Text className="text-[26px] font-karla-bold mt-6 mb-4 text-white px-6">
          Your Calendar
        </Text>
        {/* Calendar Card */}
        <View className="bg-white rounded-2xl px-2 py-2 mx-6 mb-[-40px] shadow-lg z-10">
          <RNCalendar
            markedDates={markedDates}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            theme={{
              todayTextColor: "#000000ff",
              arrowColor: "#5d1c8fff",
              textDayFontFamily: "Karla",
              textMonthFontFamily: "Karla-Bold",
              textDayHeaderFontFamily: "Karla-Bold",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
              calendarBackground: "#fff",
            }}
          />
        </View>
        {/* Upcoming Deadlines */}
        <LinearGradient
          colors={["#fff", "#DADEFF"]}
          className="flex-1 rounded-t-[45px] mt-[65px] py-7 px-5"
        >
          <Text className="text-[20px] font-karla-bold mb-5 text-[#111827] text-center">
            Upcoming Deadlines
          </Text>
          {deadlines.map((item, idx) => (
            <View key={idx} className="mb-4">
              <View className="flex-row items-start">
                <Text className="font-karla-bold text-[#655b7d] text-[15px] w-[60px] mt-2">
                  {item.date}
                </Text>
                <View className="flex-1 bg-[#F9FAFB] rounded-xl px-4 py-3 flex-row items-center justify-between shadow-sm">
                  <View className="flex-1">
                    <Text className="text-[15px] font-karla-bold text-[#4B1EB4] mb-2">
                      {item.title}
                    </Text>
                    <Text
                      className={`text-[12px] font-karla-bold px-2 py-1 rounded-md ${item.tagColor} ${item.tagText} self-start`}
                    >
                      {item.tag}
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="ml-3"
                    onPress={() => router.push("/studentPages/opportunity")}
                  >
                    <Text
                      className={`font-karla-bold text-[14px] ${item.viewColor}`}
                    >
                      View →
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Calendar;
