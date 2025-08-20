import { Text, View, Image } from "react-native";

import {Link} from "expo-router";
import React from "react";

export default function Index() {
    return (
        <View>
            <Text>Homepage</Text>
        </View>
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
    );
}
