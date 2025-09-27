import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
export default function GetStarted() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#4B2ACF] items-center justify-center px-6">
      {/* Logo and App Name */}
      <View className="flex-row items-center">
        <Image
          source={require("../assets/images/learl.png")}
          className="w-[60px] h-[60px]"
        />
        <Text className="text-[#FFE600] font-karla-bold text-[22px] tracking-wider ml-2">
          LearnLocal
        </Text>
      </View>

      {/* Main Illustration */}
      <Image
        source={require("../assets/images/gsimageLL.png")}
        className="w-[250px] h-[250px] mb-2 mt-[-1px]"
        resizeMode="contain"
      />

      {/* Headings */}
      <Text className="text-white text-[22px] text-center font-karla mb-3 leading-8">
        Your all-in-one
      </Text>
      <Text className="text-white text-[22px] text-center font-karla mt-[-15px] mb-3 leading-8">
        <Text className="text-[#FFE600] font-karla-bold">
          educational opportunity{"\n"} finder
        </Text>{" "}
        app
      </Text>
      <Text className="text-white text-[14px] text-center mb-8 opacity-90 font-karla">
        Discover scholarships, workshops, study spots, and learning programs
        near you — all in one place.
      </Text>

      {/* Get Started Button */}
      <TouchableOpacity
        className="bg-white rounded-3xl py-3 px-12 mb-4.5"
        onPress={() => router.replace("./usertype")}
      >
        <Text className="text-[#4B2ACF] font-karla-bold text-[16px]">
          Get Started
        </Text>
      </TouchableOpacity>

      {/* Log In Link */}
      <Text className="text-primaryw text-[14px] mt-3 text-center opacity-90 font-karla">
        Already have an account?{" "}
        <Text
          className="text-[#FFE600] font-karla-bold underline"
          onPress={() => router.replace("../login")}
        >
          Log in
        </Text>
      </Text>
    </View>
  );
}
