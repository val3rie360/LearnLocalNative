import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { Animated, Image, Text, View } from "react-native";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import "./globals.css";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) {
      return;
    }

    const currentRoute = segments[0];
    const isOnProtectedPages = currentRoute === 'studentPages' && segments[1] === '(tabs)';

    // Only redirect if user is trying to access protected student pages without being authenticated
    if (!user && isOnProtectedPages) {
      console.log('Redirecting unauthenticated user from protected pages to login');
      router.replace('/login');
    }
    // If user is authenticated and on login/signup pages, redirect to home
    else if (user && (currentRoute === 'login' || currentRoute === 'studentsignup')) {
      console.log('Redirecting authenticated user from auth pages to Home');
      router.replace('/studentPages/(tabs)/Home');
    }
  }, [user, loading, segments, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const [fadeAnim] = useState(new Animated.Value(0));

  const [fontsLoaded] = useFonts({
    "Karla-Bold": require("../assets/fonts/Karla-Bold.ttf"),
    Karla: require("../assets/fonts/Karla-Regular.ttf"),
    "Karla-Italic": require("../assets/fonts/Karla-Italic.ttf"),
  });
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          setAppReady(true);
          SplashScreen.hideAsync();
        }, 2000); // 2 seconds after fade-in
      });
    }
  }, [fontsLoaded, fadeAnim]);

  if (!appReady) {
    return (
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "#3D0DBD",
          alignItems: "center",
          justifyContent: "center",
          opacity: fadeAnim, // animated opacity
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#3D0DBD",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../assets/images/learl.png")}
            style={{ width: 90, height: 90, marginBottom: 24 }}
            resizeMode="contain"
          />
          <Text
            style={{
              color: "#FFF065",
              fontSize: 32,
              fontFamily: "Karla-Bold",
              marginBottom: 8,
            }}
          >
            LearnLocal
          </Text>
          <Text
            style={{
              color: "#FFF065",
              fontSize: 16,
              fontFamily: "Karla-Bold",
              opacity: 0.85,
            }}
          >
            Learning starts where you are.
          </Text>
        </View>
      </Animated.View>
    );
  }
  
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
