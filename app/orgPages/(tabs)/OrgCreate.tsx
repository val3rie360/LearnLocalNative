import {
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const categories = [
  "Scholarship / Grant",
  "Competition / Event",
  "Workshop / Seminar",
  "Resources",
  "Study Spot",
];

const OrgCreate = () => {
  const [file, setFile] = useState("");
  const [level, setLevel] = useState("");
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [subject, setSubject] = useState("");
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  const levelOptions = [
    "Undergraduate",
    "Postgraduate",
    "High School",
    "Other",
  ];
  const subjectOptions = ["Math", "Science", "Arts", "Business", "Other"];
  const [category, setCategory] = useState("Scholarship / Grant");
  const [showDropdown, setShowDropdown] = useState(false);
  const [title, setTitle] = useState("");
  const [dateMilestones, setDateMilestones] = useState("");
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState("");
  const [eligibility, setEligibility] = useState("");
  // Study Spot fields
  const [studySpotName, setStudySpotName] = useState("");
  const [studySpotLocation, setStudySpotLocation] = useState("");
  const [availabilityType, setAvailabilityType] = useState("Weekdays");
  const [showAvailabilityDropdown, setShowAvailabilityDropdown] =
    useState(false);
  const [availabilityStartHour, setAvailabilityStartHour] = useState("");
  const [availabilityEndHour, setAvailabilityEndHour] = useState("");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showEndTimeDropdown, setShowEndTimeDropdown] = useState(false);
  const hourOptions = [
    "6:00 AM",
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
  ];
  const [studySpotDetails, setStudySpotDetails] = useState("");

  // Icon for category
  const getCategoryIcon = () => {
    if (category === "Competition / Event") {
      return (
        <FontAwesome6 name="award" size={22} color="#3C4251" className="mr-2" />
      );
    }
    if (category === "Resources") {
      return (
        <MaterialCommunityIcons name="bookshelf" size={24} color="#3C4251" />
      );
    }
    if (category === "Study Spot") {
      return <Ionicons name="location" size={24} color="#3C4251" />;
    }
    if (category === "Workshop / Seminar") {
      return (
        <FontAwesome6
          name="chalkboard-user"
          size={22}
          color="#3C4251"
          className="mr-2"
        />
      );
    }
    return (
      <FontAwesome6 name="scroll" size={22} color="#3C4251" className="mr-2" />
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: "#ECEAFF" }}
      edges={["top"]}
    >
      <LinearGradient colors={["#ECEAFF", "#4b1eb4c8"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 px-6 pt-10">
            {/* Header */}
            <View className="flex-row items-center mb-6 justify-center">
              <Text className="text-center text-xl font-karla-bold text-[#18181B]">
                New Opportunity
              </Text>
            </View>
            <View className="h-px bg-[#E5E0FF] mb-6" />

            {/* Category */}
            <Text className="text-sm text-[#18181B] font-karla-bold mb-1">
              Category
            </Text>
            <View
              className="flex-row items-center bg-white rounded-full mb-3 px-3 h-11 border border-[#E5E0FF] shadow"
              style={{ elevation: 4 }}
            >
              {getCategoryIcon()}
              <TouchableOpacity
                className="flex-1"
                activeOpacity={0.8}
                onPress={() => setShowDropdown(!showDropdown)}
                style={{ justifyContent: "center" }}
              >
                <Text className="text-base text-[#6B7280] font-karla px-2">
                  {category}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowDropdown(!showDropdown)}
                className="ml-2"
                activeOpacity={0.8}
              >
                <Feather name="chevron-down" size={20} color="#4B1EB4" />
              </TouchableOpacity>
            </View>
            {/* Dropdown */}
            {showDropdown && (
              <View
                className="bg-white rounded-xl shadow border border-[#E5E0FF] mb-3 px-3 py-2 absolute left-6 right-6 z-10"
                style={{ top: 160 }}
              >
                {categories.map((cat) => (
                  <Pressable
                    key={cat}
                    className="py-2"
                    onPress={() => {
                      setCategory(cat);
                      setShowDropdown(false);
                    }}
                  >
                    <Text
                      className={`text-base font-karla ${category === cat ? "text-[#4B1EB4] font-karla-bold" : "text-[#18181B]"}`}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Fields for Study Spot */}
            {category === "Study Spot" ? (
              <>
                {/* Study Spot Name */}
                <Text className="text-sm text-[#18181B] font-karla-bold mb-1">
                  Name
                </Text>
                <TextInput
                  className="bg-white rounded-full px-5 h-11 text-base text-[#18181B] font-karla mb-3 border border-[#E5E0FF]"
                  value={studySpotName}
                  onChangeText={setStudySpotName}
                  placeholder="Enter study spot name"
                  placeholderTextColor="#aaa"
                />

                {/* Choose Location */}
                <Text className="text-sm text-[#18181B] font-karla-bold mb-1">
                  Choose Location
                </Text>
                <View className="flex-row items-center bg-white rounded-full mb-3 px-3 h-11 border border-[#E5E0FF]">
                  <TextInput
                    className="flex-1 text-base text-[#18181B] font-karla"
                    value={studySpotLocation}
                    onChangeText={setStudySpotLocation}
                    placeholder="Choose on Map"
                    placeholderTextColor="#aaa"
                    editable={false}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      // TODO: Open map picker modal or navigate to map screen
                      // Example: setShowMapModal(true) or navigation.navigate('MapPicker')
                    }}
                  >
                    <Feather
                      name="map"
                      size={22}
                      color="#18181B"
                      style={{ marginLeft: 8 }}
                    />
                  </TouchableOpacity>
                </View>

                {/* Availability */}
                <Text className="text-sm text-[#18181B] font-karla-bold mb-1">
                  Availability
                </Text>
                <View className="flex-row mb-3 items-center">
                  <View className="flex-1">
                    <TouchableOpacity
                      className="bg-white rounded-full border border-[#E5E0FF] h-11 px-4 justify-center"
                      activeOpacity={0.8}
                      onPress={() =>
                        setShowAvailabilityDropdown((prev) => !prev)
                      }
                    >
                      <Text className="text-base text-[#18181B] font-karla">
                        {availabilityType}
                      </Text>
                    </TouchableOpacity>
                    {typeof showAvailabilityDropdown !== "undefined" &&
                      showAvailabilityDropdown && (
                        <View
                          className="bg-white rounded-xl shadow border border-[#E5E0FF] px-3 py-2 absolute left-0 right-0 z-10"
                          style={{ top: 48 }}
                        >
                          {["Weekdays", "Weekends", "Both"].map((type) => (
                            <Pressable
                              key={type}
                              className="py-2"
                              onPress={() => {
                                setAvailabilityType(type);
                                setShowAvailabilityDropdown(false);
                              }}
                            >
                              <Text
                                className={`text-base font-karla ${availabilityType === type ? "text-[#a084e8] font-karla-bold" : "text-[#18181B]"}`}
                              >
                                {type}
                              </Text>
                            </Pressable>
                          ))}
                        </View>
                      )}
                  </View>
                  <View style={{ width: 12 }} />
                  <View className="rounded-full h-11 px-6 justify-center items-center bg-[#a084e8]">
                    <TouchableOpacity
                      className="w-full h-full justify-center items-center"
                      onPress={() => setShowTimeDropdown(true)}
                    >
                      <Text className="text-base font-karla text-white">
                        {availabilityStartHour && availabilityEndHour
                          ? `${availabilityStartHour} - ${availabilityEndHour}`
                          : "8:00 AM - 5:00 PM"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {showTimeDropdown && !availabilityStartHour && (
                    <View className="absolute left-0 right-0 top-16 bg-white rounded-xl shadow border border-[#E5E0FF] px-4 py-4 z-20">
                      <Text className="text-base font-karla mb-2 text-[#18181B]">
                        Select Start Time
                      </Text>
                      <ScrollView style={{ maxHeight: 150 }}>
                        {hourOptions.map((hour) => (
                          <Pressable
                            key={hour}
                            className="py-2"
                            onPress={() => {
                              setAvailabilityStartHour(hour);
                              setShowTimeDropdown(false);
                              setShowEndTimeDropdown(true);
                            }}
                          >
                            <Text
                              className={`text-base font-karla ${availabilityStartHour === hour ? "text-[#a084e8] font-karla-bold" : "text-[#18181B]"}`}
                            >
                              {hour}
                            </Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                  {showEndTimeDropdown &&
                    availabilityStartHour &&
                    !availabilityEndHour && (
                      <View className="absolute left-0 right-0 top-16 bg-white rounded-xl shadow border border-[#E5E0FF] px-4 py-4 z-20">
                        <Text className="text-base font-karla mb-2 text-[#18181B]">
                          Select End Time
                        </Text>
                        <ScrollView style={{ maxHeight: 150 }}>
                          {hourOptions.map((hour) => (
                            <Pressable
                              key={hour}
                              className="py-2"
                              onPress={() => {
                                setAvailabilityEndHour(hour);
                                setShowEndTimeDropdown(false);
                              }}
                            >
                              <Text
                                className={`text-base font-karla ${availabilityEndHour === hour ? "text-[#a084e8] font-karla-bold" : "text-[#18181B]"}`}
                              >
                                {hour}
                              </Text>
                            </Pressable>
                          ))}
                        </ScrollView>
                        <View className="flex-row justify-end mt-4">
                          <TouchableOpacity
                            className="bg-[#a084e8] rounded-full px-4 py-2"
                            onPress={() => setShowEndTimeDropdown(false)}
                          >
                            <Text className="text-white font-karla">Done</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                </View>

                {/* Additional Details */}
                <Text className="text-sm text-[#18181B] font-karla-bold mb-1">
                  Additional Details
                </Text>
                <TextInput
                  className="bg-white rounded-xl px-5 text-base text-[#18181B] font-karla mb-6 min-h-[80px] border border-[#E5E0FF] text-top"
                  value={studySpotDetails}
                  onChangeText={setStudySpotDetails}
                  placeholder="Enter details"
                  placeholderTextColor="#aaa"
                  multiline
                  numberOfLines={20}
                />
              </>
            ) : category === "Resources" ? (
              <>
                {/* Title */}
                <Text className="text-sm text-[#18181B] font-karla-bold mb-1">
                  Title
                </Text>
                <TextInput
                  className="bg-white rounded-full px-5 h-11 text-base text-[#18181B] font-karla mb-3 border border-[#E5E0FF]"
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter title"
                  placeholderTextColor="#aaa"
                />

                {/* Add File (pdf only) */}
                <Text className="text-sm text-[#18181B] font-karla-bold mb-1">
                  Add File: (pdf only)
                </Text>
                <View className="flex-row items-center bg-white rounded-full mb-3 px-3 h-11 border border-[#E5E0FF]">
                  <TextInput
                    className="flex-1 text-base text-[#18181B] font-karla"
                    value={file}
                    onChangeText={setFile}
                    placeholder="Upload file"
                    placeholderTextColor="#aaa"
                  />
                  <TouchableOpacity>
                    <Feather
                      name="plus-circle"
                      size={20}
                      color="#7D7CFF"
                      className="ml-2"
                    />
                  </TouchableOpacity>
                </View>

                {/* Level Dropdown */}
                <Text className="text-sm text-[#18181B] font-karla-bold mb-1">
                  Level
                </Text>
                <TouchableOpacity
                  className="bg-white rounded-full px-5 h-11 flex-row items-center mb-3 border border-[#E5E0FF]"
                  onPress={() => setShowLevelDropdown(!showLevelDropdown)}
                  activeOpacity={0.8}
                >
                  <Text className="flex-1 text-base text-[#18181B] font-karla">
                    {level || "Select level"}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#4B1EB4" />
                </TouchableOpacity>
                {showLevelDropdown && (
                  <View
                    className="bg-white rounded-xl shadow border border-[#E5E0FF] mb-3 px-3 py-2 absolute left-6 right-6 z-10"
                    style={{ top: 320 }}
                  >
                    {levelOptions.map((opt) => (
                      <Pressable
                        key={opt}
                        className="py-2"
                        onPress={() => {
                          setLevel(opt);
                          setShowLevelDropdown(false);
                        }}
                      >
                        <Text
                          className={`text-base font-karla ${level === opt ? "text-[#4B1EB4] font-karla-bold" : "text-[#18181B]"}`}
                        >
                          {opt}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}

                {/* Subject Dropdown */}
                <Text className="text-sm text-[#18181B] font-karla-bold mb-1">
                  Subject
                </Text>
                <TouchableOpacity
                  className="bg-white rounded-full px-5 h-11 flex-row items-center mb-3 border border-[#E5E0FF]"
                  onPress={() => setShowSubjectDropdown(!showSubjectDropdown)}
                  activeOpacity={0.8}
                >
                  <Text className="flex-1 text-base text-[#18181B] font-karla">
                    {subject || "Select subject"}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#4B1EB4" />
                </TouchableOpacity>
                {showSubjectDropdown && (
                  <View
                    className="bg-white rounded-xl shadow border border-[#E5E0FF] mb-3 px-3 py-2 absolute left-6 right-6 z-10"
                    style={{ top: 380 }}
                  >
                    {subjectOptions.map((opt) => (
                      <Pressable
                        key={opt}
                        className="py-2"
                        onPress={() => {
                          setSubject(opt);
                          setShowSubjectDropdown(false);
                        }}
                      >
                        <Text
                          className={`text-base font-karla ${subject === opt ? "text-[#4B1EB4] font-karla-bold" : "text-[#18181B]"}`}
                        >
                          {opt}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}

                {/* Additional Details */}
                <Text className="text-sm text-[#18181B] font-karla-bold mb-1">
                  Additional Details
                </Text>
                <TextInput
                  className="bg-white rounded-xl px-5 text-base text-[#18181B] font-karla mb-6 min-h-[80px] border border-[#E5E0FF] text-top"
                  value={eligibility}
                  onChangeText={setEligibility}
                  placeholder="Enter details"
                  placeholderTextColor="#aaa"
                  multiline
                  numberOfLines={20}
                />
              </>
            ) : category === "Competition / Event" ? (
              <>
                {/* Title */}
                <Text className="text-sm text-[#18181B] font-karla-bold mb-1">
                  Title
                </Text>
                <TextInput
                  className="bg-white rounded-full px-5 h-11 text-base text-[#18181B] font-karla mb-3 border border-[#E5E0FF]"
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter title"
                  placeholderTextColor="#aaa"
                />

                {/* Date(s) */}
                <Text className="text-sm text-[#18181B] font-karla-bold mb-1">
                  Date(s):
                </Text>
                <View className="flex-row items-center bg-white rounded-full mb-3 px-3 h-11 border border-[#E5E0FF]">
                  <TextInput
                    className="flex-1 text-base text-[#18181B] font-karla"
                    value={dateMilestones}
                    onChangeText={setDateMilestones}
                    placeholder="Add date"
                    placeholderTextColor="#aaa"
                  />
                  <TouchableOpacity>
                    <Feather
                      name="plus-circle"
                      size={20}
                      color="#7D7CFF"
                      className="ml-2"
                    />
                  </TouchableOpacity>
                </View>

                {/* Location */}
                <Text className="text-sm text-[#18181B] font-karla-bold mb-1">
                  Location :
                </Text>
                <TextInput
                  className="bg-white rounded-full px-5 h-11 text-base text-[#18181B] font-karla mb-3 border border-[#E5E0FF]"
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter location"
                  placeholderTextColor="#aaa"
                />

                {/* Eligibility Details */}
                <Text className="text-sm text-[#18181B] font-karla-bold mb-1">
                  Eligibility Details
                </Text>
                <TextInput
                  className="bg-white rounded-xl px-5 text-base text-[#18181B] font-karla mb-6 min-h-[80px] border border-[#E5E0FF] text-top"
                  value={eligibility}
                  onChangeText={setEligibility}
                  placeholder="Enter details"
                  placeholderTextColor="#aaa"
                  multiline
                  numberOfLines={20}
                />
              </>
            ) : (
              <>
                {/* Title */}
                <Text className="text-sm text-[#18181B] font-karla-bold mb-1">
                  Title
                </Text>
                <TextInput
                  className="bg-white rounded-full px-5 h-11 text-base text-[#18181B] font-karla mb-3 border border-[#E5E0FF]"
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter title"
                  placeholderTextColor="#aaa"
                />

                {/* Date Milestones */}
                <Text className="text-sm text-[#18181B] font-karla-bold mb-1">
                  Date Milestones
                </Text>
                <View className="flex-row items-center bg-white rounded-full mb-3 px-3 h-11 border border-[#E5E0FF]">
                  <TextInput
                    className="flex-1 text-base text-[#18181B] font-karla"
                    value={dateMilestones}
                    onChangeText={setDateMilestones}
                    placeholder="Add date"
                    placeholderTextColor="#aaa"
                  />
                  <TouchableOpacity>
                    <Feather
                      name="plus-circle"
                      size={20}
                      color="#7D7CFF"
                      className="ml-2"
                    />
                  </TouchableOpacity>
                </View>

                {/* Amount */}
                <Text className="text-sm text-[#18181B] font-karla-bold mb-1">
                  Amount
                </Text>
                <TextInput
                  className="bg-white rounded-full px-5 h-11 text-base text-[#18181B] font-karla mb-3 border border-[#E5E0FF]"
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="Enter amount"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                />

                {/* Eligibility Details */}
                <Text className="text-sm text-[#18181B] font-karla-bold mb-1">
                  Eligibility Details
                </Text>
                <TextInput
                  className="bg-white rounded-xl px-5 text-base text-[#18181B] font-karla mb-6 min-h-[80px] border border-[#E5E0FF] text-top"
                  value={eligibility}
                  onChangeText={setEligibility}
                  placeholder="Enter details"
                  placeholderTextColor="#aaa"
                  multiline
                  numberOfLines={20}
                />
              </>
            )}

            {/* Submit Button */}
            <TouchableOpacity className="bg-[#a084e8] rounded-full py-3 items-center mt-2 mb-8 shadow active:opacity-90">
              <Text className="text-white text-base font-karla-bold">
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default OrgCreate;
