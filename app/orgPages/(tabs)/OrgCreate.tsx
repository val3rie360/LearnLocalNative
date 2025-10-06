import {
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from "expo-linear-gradient";
import * as Location from 'expo-location';
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from 'react-native-maps';
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
  const [description, setDescription] = useState("");
  const [dateMilestones, setDateMilestones] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [openTimeDate, setOpenTimeDate] = useState(new Date());
  const [closeTimeDate, setCloseTimeDate] = useState(new Date());
  const [showOpenTimePicker, setShowOpenTimePicker] = useState(false);
  const [showCloseTimePicker, setShowCloseTimePicker] = useState(false);
  const [amount, setAmount] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [showMapModal, setShowMapModal] = useState(false);
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
  
  // Workshop/Seminar specific fields
  const [workshopStarts, setWorkshopStarts] = useState("");
  const [workshopEnds, setWorkshopEnds] = useState("");
  const [workshopStartsDate, setWorkshopStartsDate] = useState(new Date());
  const [workshopEndsDate, setWorkshopEndsDate] = useState(new Date());
  const [showWorkshopStartsPicker, setShowWorkshopStartsPicker] = useState(false);
  const [showWorkshopEndsPicker, setShowWorkshopEndsPicker] = useState(false);
  const [repeats, setRepeats] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState("Weekly");
  const [showRepeatDropdown, setShowRepeatDropdown] = useState(false);

  const repeatFrequencyOptions = [
    "Daily",
    "Weekly", 
    "Bi-weekly",
    "Monthly"
  ];

  const categoriesWithIcons = [
    { id: 1, name: "Scholarship / Grant", icon: "🎓" },
    { id: 2, name: "Workshop", icon: "🔧" },
    { id: 3, name: "Competition", icon: "🏆" },
    { id: 4, name: "Study Spot", icon: "📚" },
    { id: 5, name: "Upload Resource", icon: "📄" }
  ];

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setShowCategoryModal(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleOpenTimeChange = (event: any, selectedDate?: Date) => {
    console.log('Open time change:', event.type, selectedDate);
    
    if (Platform.OS === 'android') {
      setShowOpenTimePicker(false);
    }
    
    if (selectedDate) {
      setOpenTimeDate(selectedDate);
      setOpenTime(formatTime(selectedDate));
    }
  };

  const handleCloseTimeChange = (event: any, selectedDate?: Date) => {
    console.log('Close time change:', event.type, selectedDate);
    
    if (Platform.OS === 'android') {
      setShowCloseTimePicker(false);
    }
    
    if (selectedDate) {
      setCloseTimeDate(selectedDate);
      setCloseTime(formatTime(selectedDate));
    }
  };

  const confirmOpenTime = () => {
    setOpenTime(formatTime(openTimeDate));
    setShowOpenTimePicker(false);
  };

  const confirmCloseTime = () => {
    setCloseTime(formatTime(closeTimeDate));
    setShowCloseTimePicker(false);
  };

  // Workshop time handlers
  const handleWorkshopStartsChange = (event: any, selectedDate?: Date) => {
    console.log('Workshop starts change:', event.type, selectedDate);
    
    if (Platform.OS === 'android') {
      setShowWorkshopStartsPicker(false);
    }
    
    if (selectedDate) {
      setWorkshopStartsDate(selectedDate);
      setWorkshopStarts(formatTime(selectedDate));
    }
  };

  const handleWorkshopEndsChange = (event: any, selectedDate?: Date) => {
    console.log('Workshop ends change:', event.type, selectedDate);
    
    if (Platform.OS === 'android') {
      setShowWorkshopEndsPicker(false);
    }
    
    if (selectedDate) {
      setWorkshopEndsDate(selectedDate);
      setWorkshopEnds(formatTime(selectedDate));
    }
  };

  const confirmWorkshopStarts = () => {
    setWorkshopStarts(formatTime(workshopStartsDate));
    setShowWorkshopStartsPicker(false);
  };

  const confirmWorkshopEnds = () => {
    setWorkshopEnds(formatTime(workshopEndsDate));
    setShowWorkshopEndsPicker(false);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to use this feature');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setLocation(currentLocation);
      setMapRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setShowMapModal(true);
    } catch (error) {
      console.log('Location error:', error);
      Alert.alert('Error', 'Failed to get current location. You can still select a location manually on the map.');
      setShowMapModal(true);
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const newLocation = {
      coords: { 
        latitude, 
        longitude, 
        altitude: null, 
        accuracy: null, 
        altitudeAccuracy: null, 
        heading: null, 
        speed: null 
      },
      timestamp: Date.now(),
    };
    setLocation(newLocation);
  };

  const confirmLocation = () => {
    if (location) {
      setShowMapModal(false);
      Alert.alert('Success', 'Location selected successfully!');
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled) {
        setUploadedFile(result.assets[0]);
        Alert.alert('Success', 'PDF file uploaded successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload PDF file');
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (category === "Resources" && !uploadedFile) {
      Alert.alert('Error', 'Please upload a PDF file for resources category');
      return;
    }

    if ((category === "Study Spot" || category === "Workshop / Seminar") && !location) {
      Alert.alert('Error', `Please select a location for ${category.toLowerCase()}`);
      return;
    }

    // Here you would typically save the opportunity to your backend
    Alert.alert('Success', 'Opportunity posted successfully!');
  };

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
        

        {/* Title */}
        <Text className="text-sm text-black font-semibold mb-1">
          {category === "Study Spot" ? "Name of Location *" : 
           category === "Workshop / Seminar" ? "Workshop/Seminar Title *" : "Title *"}
        </Text>
        <TextInput
          className="bg-white rounded-xl px-3 h-11 text-base text-black mb-3"
          value={title}
          onChangeText={setTitle}
          placeholder={category === "Study Spot" ? "Enter location name" : 
                     category === "Workshop / Seminar" ? "Enter workshop/seminar title" : "Enter title"}
          placeholderTextColor="#aaa"
        />

        {/* Description */}
        <Text className="text-sm text-black font-semibold mb-1">
          {category === "Resources" ? "Resource Description *" : 
           category === "Study Spot" ? "Location Details *" : 
           category === "Workshop / Seminar" ? "Workshop/Seminar Description *" : "Description *"}
        </Text>
        <TextInput
          className="bg-white rounded-xl px-3 pt-3 text-base text-black mb-3 min-h-[80px] text-top"
          value={description}
          onChangeText={setDescription}
          placeholder={
            category === "Resources" ? "Enter resource description" : 
            category === "Study Spot" ? "Enter location details" : 
            category === "Workshop / Seminar" ? "Enter workshop/seminar description" :
            "Enter opportunity description"
          }
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={4}
        />

        {/* Date Milestones - Only show for scholarship and competition categories */}
        {category !== "Resources" && category !== "Study Spot" && category !== "Workshop / Seminar" && (
          <>
            <Text className="text-sm text-black font-semibold mb-1">
              Date Milestones
            </Text>
            <View className="flex-row items-center bg-white rounded-xl mb-3 px-3 h-11">
              <TextInput
                className="flex-1 text-base text-black"
                value={dateMilestones}
                onChangeText={setDateMilestones}
                placeholder="Add date"
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity>
                <Text className="text-xl text-gray-400 ml-2">＋</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Available Times - Show for Study Spot category */}
        {category === "Study Spot" && (
          <>
            <Text className="text-sm text-black font-semibold mb-1">
              Available Times
            </Text>
            <View className="flex-row space-x-3 mb-3">
              <View className="flex-1">
                <Text className="text-xs text-gray-600 mb-1">Opens at</Text>
                <TouchableOpacity
                  className="bg-white rounded-xl px-3 h-11 justify-center border border-gray-200"
                  onPress={() => {
                    console.log('Opening time picker');
                    setShowOpenTimePicker(true);
                  }}
                >
                  <Text className={`text-base ${openTime ? 'text-black' : 'text-gray-500'}`}>
                    {openTime || "Select time"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-600 mb-1">Closes at</Text>
                <TouchableOpacity
                  className="bg-white rounded-xl px-3 h-11 justify-center border border-gray-200"
                  onPress={() => {
                    console.log('Opening close time picker');
                    setShowCloseTimePicker(true);
                  }}
                >
                  <Text className={`text-base ${closeTime ? 'text-black' : 'text-gray-500'}`}>
                    {closeTime || "Select time"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* Workshop/Seminar Schedule - Show for Workshop / Seminar category */}
        {category === "Workshop / Seminar" && (
          <>
            <Text className="text-sm text-black font-semibold mb-1">
              Workshop Schedule
            </Text>
            {console.log('Rendering Workshop/Seminar section, repeats:', repeats)}
            <View className="flex-row space-x-3 mb-3">
              <View className="flex-1">
                <Text className="text-xs text-gray-600 mb-1">Starts at</Text>
                <TouchableOpacity
                  className="bg-white rounded-xl px-3 h-11 justify-center border border-gray-200"
                  onPress={() => {
                    console.log('Opening workshop starts picker');
                    setShowWorkshopStartsPicker(true);
                  }}
                >
                  <Text className={`text-base ${workshopStarts ? 'text-black' : 'text-gray-500'}`}>
                    {workshopStarts || "Select start time"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-600 mb-1">Ends at</Text>
                <TouchableOpacity
                  className="bg-white rounded-xl px-3 h-11 justify-center border border-gray-200"
                  onPress={() => {
                    console.log('Opening workshop ends picker');
                    setShowWorkshopEndsPicker(true);
                  }}
                >
                  <Text className={`text-base ${workshopEnds ? 'text-black' : 'text-gray-500'}`}>
                    {workshopEnds || "Select end time"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Repeat Option */}
            <View className="mb-3 bg-gray-50 p-3 rounded-xl">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-black font-semibold">Repeats</Text>
                <TouchableOpacity
                  className={`w-12 h-6 rounded-full border-2 ${
                    repeats ? 'bg-[#a084e8] border-[#a084e8]' : 'bg-gray-200 border-gray-300'
                  }`}
                  onPress={() => setRepeats(!repeats)}
                >
                  <View
                    className="w-5 h-5 rounded-full bg-white"
                    style={{
                      transform: [{ translateX: repeats ? 24 : 0 }],
                    }}
                  />
                </TouchableOpacity>
              </View>
              
              {repeats && (
                <View className="flex-row items-center bg-white rounded-xl px-3 h-11 border border-gray-200">
                  <Text className="text-sm text-gray-600 mr-2">Every:</Text>
                  <TouchableOpacity
                    className="flex-1 flex-row items-center justify-between"
                    onPress={() => setShowRepeatDropdown(!showRepeatDropdown)}
                  >
                    <Text className="text-base text-black">{repeatFrequency}</Text>
                    <Text className="text-lg text-gray-400">▼</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Debug indicator */}
              <Text className="text-xs text-gray-500 mt-1">
                Debug: repeats={repeats ? 'true' : 'false'}, showDropdown={showRepeatDropdown ? 'true' : 'false'}
              </Text>
              
              {/* Repeat Frequency Dropdown */}
              {showRepeatDropdown && (
                <View className="bg-white rounded-xl shadow border border-gray-200 mt-1 px-3 py-2">
                  {repeatFrequencyOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      className="py-2"
                      onPress={() => {
                        setRepeatFrequency(option);
                        setShowRepeatDropdown(false);
                      }}
                    >
                      <Text
                        className={`text-base font-karla ${
                          repeatFrequency === option ? "text-[#a084e8] font-karla-bold" : "text-[#18181B]"
                        }`}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </>
        )}

        {/* Amount - Only show for scholarship and competition categories */}
        {category !== "Resources" && category !== "Study Spot" && category !== "Workshop / Seminar" && (
          <>
            <Text className="text-sm text-black font-semibold mb-1">Amount</Text>
            <TextInput
              className="bg-white rounded-xl px-3 h-11 text-base text-black mb-3"
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
            />
          </>
        )}

        {/* Location Picker - Show for Study Spot and Workshop / Seminar categories */}
        {(category === "Study Spot" || category === "Workshop / Seminar") && (
          <>
            <Text className="text-sm text-black font-semibold mb-1">Location *</Text>
            <TouchableOpacity
              className={`rounded-xl px-3 h-11 justify-center border mb-3 ${
                location ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
              }`}
              onPress={getCurrentLocation}
            >
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">{location ? '✅' : '📍'}</Text>
                <Text className={`text-base flex-1 ${location ? 'text-green-800' : 'text-black'}`}>
                  {location ? 
                    `Location selected: ${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}` : 
                    "Tap to select location"
                  }
                </Text>
                <Text className="text-lg text-gray-400">→</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
        


        {/* File Upload Section - Only show for Resources category */}
        {category === "Resources" && (
          <>
            <Text className="text-sm text-black font-semibold mb-1">
              Upload PDF Resource *
            </Text>
            <TouchableOpacity 
              className="bg-white rounded-xl px-3 py-3 mb-3 border-2 border-dashed border-gray-300"
              onPress={handleFileUpload}
            >
              <View className="items-center">
                <Text className="text-2xl mb-2">📄</Text>
                <Text className="text-base text-gray-600">
                  {uploadedFile ? uploadedFile.name || "PDF uploaded" : "Tap to upload PDF"}
                </Text>
                <Text className="text-sm text-gray-400 mt-1">
                  PDF files only
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* Submit Button */}
        <TouchableOpacity 
          className="bg-[#a084e8] rounded-full py-3 items-center mt-2 mb-8 shadow"
          onPress={handleSubmit}
        >
          <Text className="text-white text-base font-bold">Submit</Text>
        </TouchableOpacity>
      </View>

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-lg font-bold text-black mb-4 text-center">
              Select Category
            </Text>
            {categoriesWithIcons.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                className="flex-row items-center py-4 border-b border-gray-200"
                onPress={() => handleCategorySelect(cat.name)}
              >
                <Text className="text-2xl mr-4">{cat.icon}</Text>
                <Text className="text-base text-black flex-1">{cat.name}</Text>
                {category === cat.name && (
                  <Text className="text-lg text-[#a084e8]">✓</Text>
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              className="bg-gray-200 rounded-xl py-3 mt-4"
              onPress={() => setShowCategoryModal(false)}
            >
              <Text className="text-center text-base text-gray-600">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Time Pickers */}
      {showOpenTimePicker && (
        <>
          {Platform.OS === 'ios' ? (
            <Modal
              visible={showOpenTimePicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowOpenTimePicker(false)}
            >
              <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-3xl p-6">
                  <Text className="text-lg font-bold text-[#a084e8] mb-4 text-center">
                    Select Opening Time
                  </Text>
                  <View className="bg-gray-50 rounded-xl p-2 border border-gray-200">
                    <DateTimePicker
                      value={openTimeDate}
                      mode="time"
                      is24Hour={false}
                      display="spinner"
                      onChange={handleOpenTimeChange}
                      style={{ 
                        backgroundColor: 'transparent'
                      }}
                      textColor="#333333"
                      accentColor="#a084e8"
                    />
                  </View>
                  <View className="flex-row space-x-3 mt-4">
                    <TouchableOpacity
                      className="flex-1 bg-gray-200 rounded-xl py-3"
                      onPress={() => setShowOpenTimePicker(false)}
                    >
                      <Text className="text-center text-base text-gray-600">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 bg-[#a084e8] rounded-xl py-3"
                      onPress={confirmOpenTime}
                    >
                      <Text className="text-center text-base text-white font-bold">Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={openTimeDate}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={handleOpenTimeChange}
              textColor="#333333"
              accentColor="#a084e8"
            />
          )}
        </>
      )}

      {showCloseTimePicker && (
        <>
          {Platform.OS === 'ios' ? (
            <Modal
              visible={showCloseTimePicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowCloseTimePicker(false)}
            >
              <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-3xl p-6">
                  <Text className="text-lg font-bold text-[#a084e8] mb-4 text-center">
                    Select Closing Time
                  </Text>
                  <View className="bg-gray-50 rounded-xl p-2 border border-gray-200">
                    <DateTimePicker
                      value={closeTimeDate}
                      mode="time"
                      is24Hour={false}
                      display="spinner"
                      onChange={handleCloseTimeChange}
                      style={{ 
                        backgroundColor: 'transparent'
                      }}
                      textColor="#333333"
                      accentColor="#a084e8"
                    />
                  </View>
                  <View className="flex-row space-x-3 mt-4">
                    <TouchableOpacity
                      className="flex-1 bg-gray-200 rounded-xl py-3"
                      onPress={() => setShowCloseTimePicker(false)}
                    >
                      <Text className="text-center text-base text-gray-600">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 bg-[#a084e8] rounded-xl py-3"
                      onPress={confirmCloseTime}
                    >
                      <Text className="text-center text-base text-white font-bold">Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={closeTimeDate}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={handleCloseTimeChange}
              textColor="#333333"
              accentColor="#a084e8"
            />
          )}
        </>
      )}

      {/* Workshop Starts Time Picker */}
      {showWorkshopStartsPicker && (
        <>
          {Platform.OS === 'ios' ? (
            <Modal
              visible={showWorkshopStartsPicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowWorkshopStartsPicker(false)}
            >
              <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-3xl p-6">
                  <Text className="text-lg font-bold text-[#a084e8] mb-4 text-center">
                    Select Workshop Start Time
                  </Text>
                  <View className="bg-gray-50 rounded-xl p-2 border border-gray-200">
                    <DateTimePicker
                      value={workshopStartsDate}
                      mode="time"
                      is24Hour={false}
                      display="spinner"
                      onChange={handleWorkshopStartsChange}
                      style={{ 
                        backgroundColor: 'transparent'
                      }}
                      textColor="#333333"
                      accentColor="#a084e8"
                    />
                  </View>
                  <View className="flex-row space-x-3 mt-4">
                    <TouchableOpacity
                      className="flex-1 bg-gray-200 rounded-xl py-3"
                      onPress={() => setShowWorkshopStartsPicker(false)}
                    >
                      <Text className="text-center text-base text-gray-600">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 bg-[#a084e8] rounded-xl py-3"
                      onPress={confirmWorkshopStarts}
                    >
                      <Text className="text-center text-base text-white font-bold">Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={workshopStartsDate}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={handleWorkshopStartsChange}
              textColor="#333333"
              accentColor="#a084e8"
            />
          )}
        </>
      )}

      {/* Workshop Ends Time Picker */}
      {showWorkshopEndsPicker && (
        <>
          {Platform.OS === 'ios' ? (
            <Modal
              visible={showWorkshopEndsPicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowWorkshopEndsPicker(false)}
            >
              <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-3xl p-6">
                  <Text className="text-lg font-bold text-[#a084e8] mb-4 text-center">
                    Select Workshop End Time
                  </Text>
                  <View className="bg-gray-50 rounded-xl p-2 border border-gray-200">
                    <DateTimePicker
                      value={workshopEndsDate}
                      mode="time"
                      is24Hour={false}
                      display="spinner"
                      onChange={handleWorkshopEndsChange}
                      style={{ 
                        backgroundColor: 'transparent'
                      }}
                      textColor="#333333"
                      accentColor="#a084e8"
                    />
                  </View>
                  <View className="flex-row space-x-3 mt-4">
                    <TouchableOpacity
                      className="flex-1 bg-gray-200 rounded-xl py-3"
                      onPress={() => setShowWorkshopEndsPicker(false)}
                    >
                      <Text className="text-center text-base text-gray-600">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 bg-[#a084e8] rounded-xl py-3"
                      onPress={confirmWorkshopEnds}
                    >
                      <Text className="text-center text-base text-white font-bold">Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={workshopEndsDate}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={handleWorkshopEndsChange}
              textColor="#333333"
              accentColor="#a084e8"
            />
          )}
        </>
      )}

      {/* Location Selection Modal - Only for Study Spot */}
      {category === "Study Spot" && (
        <Modal
          visible={showMapModal}
          transparent={false}
          animationType="slide"
          onRequestClose={() => setShowMapModal(false)}
        >
          <View className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 bg-[#a084e8]">
              <TouchableOpacity
                onPress={() => setShowMapModal(false)}
                className="bg-white rounded-full p-2"
              >
                <Text className="text-lg text-[#a084e8] font-bold">←</Text>
              </TouchableOpacity>
              <Text className="text-lg font-bold text-white">Select Location</Text>
              <TouchableOpacity
                onPress={confirmLocation}
                className="bg-white rounded-full px-4 py-2"
                disabled={!location}
              >
                <Text className={`text-sm font-bold ${location ? 'text-[#a084e8]' : 'text-gray-400'}`}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View className="flex-row space-x-3 p-4 bg-gray-50">
              <TouchableOpacity
                className="flex-1 bg-[#a084e8] rounded-xl py-3"
                onPress={getCurrentLocation}
              >
                <Text className="text-white text-center font-bold">
                  📍 Use Current Location
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-xl py-3"
                onPress={() => setShowMapModal(false)}
              >
                <Text className="text-gray-600 text-center font-bold">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>

            {/* Map */}
            <View className="flex-1">
              <MapView
                style={{ flex: 1 }}
                region={mapRegion}
                onPress={handleMapPress}
                showsUserLocation={true}
                showsMyLocationButton={true}
                mapType="standard"
              >
                {location && (
                  <Marker
                    coordinate={{
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                    }}
                    title="Study Spot Location"
                    description="Selected location for study spot"
                    pinColor="#a084e8"
                  />
                )}
              </MapView>
            </View>

            {/* Instructions */}
            <View className="p-4 bg-gray-50">
              <Text className="text-sm text-gray-600 text-center mb-2">
                Tap anywhere on the map to place a pin for your study spot location
              </Text>
              <Text className="text-xs text-gray-500 text-center">
                {location ? `Current selection: ${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}` : 'No location selected yet'}
              </Text>
            </View>
          </View>
        </Modal>
      )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default OrgCreate;
