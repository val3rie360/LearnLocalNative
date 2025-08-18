import { Text, View, Image } from "react-native";
export default function Index() {
    return (
        <View className="flex-1 justify-center items-center bg-[#3D0DBD]">
            <Image
                source={require("../assets/images/learl.png")} // <-- replace with your logo path
                className="w-32 h-32"
                resizeMode="contain"
            />
            <Text className="text-[#FFF065] text-4xl font-karla-bold">LearnLocal</Text>
            <Text className="text-white text-lg font-karla">
                Learning starts where you are.
            </Text>
        </View>
    );
}
