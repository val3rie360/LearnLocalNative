import { Stack } from "expo-router";
import './globals.css';
import { useFonts } from "expo-font";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Karla: require("../assets/fonts/Karla-Regular.ttf"),
        "Karla-Bold": require("../assets/fonts/Karla-Bold.ttf"),
        "Karla-Italic": require("../assets/fonts/Karla-Italic.ttf"),
    });
    if (!fontsLoaded) {
        return null; // or a loading spinner
    }
    return (
        <Stack
            screenOptions={{
                headerShown: false, //to hide header on all screens/pages
            }}
        />
    );
}

