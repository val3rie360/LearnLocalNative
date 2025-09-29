import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { Animated, Image, Text, View } from "react-native";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { getUserProfile } from "../services/firestoreService";
import "./globals.css";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  // Fetch user role when user is authenticated
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.uid) {
        try {
          setRoleLoading(true);
          const profile = await getUserProfile(user.uid);
          setUserRole(profile?.role || 'student');
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole('student'); // Default to student if error
        } finally {
          setRoleLoading(false);
        }
      } else {
        setUserRole(null);
        setRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user?.uid]);

  useEffect(() => {
    if (loading || roleLoading) {
      return;
    }

    const currentRoute = segments[0];
    const isOnProtectedStudentPages = currentRoute === "studentPages" && segments[1] === "(tabs)";
    const isOnProtectedOrgPages = currentRoute === "orgPages" && segments[1] === "(tabs)";
    const isOnAuthPages = currentRoute === "login" || 
      (currentRoute === "studentPages" && segments[1] === "studentsignup") ||
      (currentRoute === "orgPages" && segments[1] === "orgsignup");

    // Redirect unauthenticated users from protected pages to login
    if (!user && (isOnProtectedStudentPages || isOnProtectedOrgPages)) {
      console.log("Redirecting unauthenticated user from protected pages to login");
      router.replace("/login");
    }
    // Redirect authenticated users from auth pages to appropriate home based on role
    else if (user && isOnAuthPages) {
      const homeRoute = userRole === 'organization' 
        ? "/orgPages/(tabs)/OrgHome" 
        : "/studentPages/(tabs)/Home";
      console.log(`Redirecting authenticated ${userRole} user from auth pages to ${homeRoute}`);
      router.replace(homeRoute);
    }
    // Redirect users to correct pages based on their role
    else if (user && userRole) {
      if (userRole === 'organization' && isOnProtectedStudentPages) {
        console.log("Redirecting organization user from student pages to org pages");
        router.replace("/orgPages/(tabs)/OrgHome");
      } else if (userRole === 'student' && isOnProtectedOrgPages) {
        console.log("Redirecting student user from org pages to student pages");
        router.replace("/studentPages/(tabs)/Home");
      }
    }
  }, [user, loading, userRole, roleLoading, segments, router]);

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
