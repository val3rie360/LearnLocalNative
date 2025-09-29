import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const OrgCreate = () => {
  const [category] = useState("Scholarship / Grant");
  const [title, setTitle] = useState("");
  const [dateMilestones, setDateMilestones] = useState("");
  const [amount, setAmount] = useState("");
  const [eligibility, setEligibility] = useState("");

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
        <Text className="text-sm text-black font-semibold mb-1">Category</Text>
        <View className="flex-row items-center bg-white rounded-xl mb-3 px-3 h-11">
          <Text className="text-lg mr-2">📄</Text>
          <TextInput
            className="flex-1 text-base text-black"
            value={category}
            editable={false}
          />
          <Text className="text-lg text-gray-400 ml-2">⌄</Text>
        </View>

        {/* Title */}
        <Text className="text-sm text-black font-semibold mb-1">Title</Text>
        <TextInput
          className="bg-white rounded-xl px-3 h-11 text-base text-black mb-3"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
          placeholderTextColor="#aaa"
        />

        {/* Date Milestones */}
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

        {/* Amount */}
        <Text className="text-sm text-black font-semibold mb-1">Amount</Text>
        <TextInput
          className="bg-white rounded-xl px-3 h-11 text-base text-black mb-3"
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
        />

        {/* Eligibility Details */}
        <Text className="text-sm text-black font-semibold mb-1">
          Eligibility Details
        </Text>
        <TextInput
          className="bg-white rounded-xl px-3 pt-3 text-base text-black mb-6 min-h-[80px] text-top"
          value={eligibility}
          onChangeText={setEligibility}
          placeholder="Enter details"
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={4}
        />

        {/* Submit Button */}
        <TouchableOpacity className="bg-[#a084e8] rounded-full py-3 items-center mt-2 mb-8 shadow">
          <Text className="text-white text-base font-bold">Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default OrgCreate;
