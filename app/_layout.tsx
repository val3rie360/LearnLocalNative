import { Stack } from "expo-router";
import "./globals.css";
import { useFonts } from "expo-font";
import { StatusBar } from "react-native";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Karla: require("../assets/fonts/Karla-Regular.ttf"),
        "Karla-Bold": require("../assets/fonts/Karla-Bold.ttf"),
        "Karla-Italic": require("../assets/fonts/Karla-Italic.ttf"),
    });
    if (!fontsLoaded) {
        return null;
    }
    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#F6F4FE" />
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="opportunity/[id]" options={{ headerShown: false }} />
            </Stack>
        </>
    );
}

