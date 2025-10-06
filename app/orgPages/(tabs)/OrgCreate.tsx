import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from 'react-native-maps';

const OrgCreate = () => {
  const [category, setCategory] = useState("Scholarship / Grant");
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

  const categories = [
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
        type: '*/*',
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled) {
        setUploadedFile(result.assets[0]);
        Alert.alert('Success', 'File uploaded successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload file');
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (category === "Upload Resource" && !uploadedFile) {
      Alert.alert('Error', 'Please upload a file for resource category');
      return;
    }

    if (category === "Study Spot" && !location) {
      Alert.alert('Error', 'Please select a location for study spot');
      return;
    }

    // Here you would typically save the opportunity to your backend
    Alert.alert('Success', 'Opportunity posted successfully!');
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 bg-[#e5d4fa] px-6 pt-10">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity>
            <Text className="text-2xl text-black mr-2">←</Text>
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-bold text-black mr-8">
            New Opportunity
          </Text>
        </View>

        {/* Category */}
        <Text className="text-sm text-black font-semibold mb-1">Category *</Text>
        <TouchableOpacity 
          className="flex-row items-center bg-white rounded-xl mb-3 px-3 h-11"
          onPress={() => setShowCategoryModal(true)}
        >
          <Text className="text-lg mr-2">
            {categories.find(cat => cat.name === category)?.icon || "📄"}
          </Text>
          <Text className="flex-1 text-base text-black">{category}</Text>
          <Text className="text-lg text-gray-400 ml-2">⌄</Text>
        </TouchableOpacity>
        

        {/* Title */}
        <Text className="text-sm text-black font-semibold mb-1">
          {category === "Study Spot" ? "Name of Location *" : "Title *"}
        </Text>
        <TextInput
          className="bg-white rounded-xl px-3 h-11 text-base text-black mb-3"
          value={title}
          onChangeText={setTitle}
          placeholder={category === "Study Spot" ? "Enter location name" : "Enter title"}
          placeholderTextColor="#aaa"
        />

        {/* Description */}
        <Text className="text-sm text-black font-semibold mb-1">
          {category === "Upload Resource" ? "Resource Description *" : 
           category === "Study Spot" ? "Location Details *" : "Description *"}
        </Text>
        <TextInput
          className="bg-white rounded-xl px-3 pt-3 text-base text-black mb-3 min-h-[80px] text-top"
          value={description}
          onChangeText={setDescription}
          placeholder={
            category === "Upload Resource" ? "Enter resource description" : 
            category === "Study Spot" ? "Enter location details" : 
            "Enter opportunity description"
          }
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={4}
        />

        {/* Date Milestones - Only show for non-upload resource and non-study spot categories */}
        {category !== "Upload Resource" && category !== "Study Spot" && (
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

        {/* Available Times - Only show for Study Spot category */}
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

        {/* Amount - Only show for non-upload resource and non-study spot categories */}
        {category !== "Upload Resource" && category !== "Study Spot" && (
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

        {/* Location Picker - Only show for Study Spot category */}
        {category === "Study Spot" && (
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
        


        {/* File Upload Section - Only show for Upload Resource category */}
        {category === "Upload Resource" && (
          <>
            <Text className="text-sm text-black font-semibold mb-1">
              Upload Resource *
            </Text>
            <TouchableOpacity 
              className="bg-white rounded-xl px-3 py-3 mb-3 border-2 border-dashed border-gray-300"
              onPress={handleFileUpload}
            >
              <View className="items-center">
                <Text className="text-2xl mb-2">📁</Text>
                <Text className="text-base text-gray-600">
                  {uploadedFile ? uploadedFile.name || "File uploaded" : "Tap to upload file"}
                </Text>
                <Text className="text-sm text-gray-400 mt-1">
                  PDF, DOC, DOCX, TXT, etc.
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
            {categories.map((cat) => (
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
  );
};

export default OrgCreate;
