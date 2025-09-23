import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function GetStarted() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo and App Name */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/learl.png")}
          style={styles.logo}
        />
        <Text style={styles.appName}>LearnLocal</Text>
      </View>

      {/* Main Illustration */}
      <Image
        source={require("../assets/images/gsimageLL.png")}
        style={styles.illustration}
        resizeMode="contain"
      />

      {/* Headings */}
      <Text style={styles.heading}>Your all-in-one</Text>
      <Text style={[styles.heading, { marginTop: -15 }]}>
        {" "}
        <Text style={styles.highlight}>educational opportunity finder</Text> app
      </Text>
      <Text style={styles.subheading}>
        Discover scholarships, workshops, study spots, and learning programs
        near you — all in one place.
      </Text>

      {/* Get Started Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("./usertype")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      {/* Log In Link */}
      <Text style={styles.logInText}>
        Already have an account?{" "}
        <Text
          style={styles.logInLink}
          onPress={() => router.replace("../login")}
        >
          Log in
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4B2ACF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    flexDirection: "row", // Make children horizontal
    alignItems: "center", // Vertically center
    marginTop: 12,
  },
  logo: {
    width: 60,
    height: 60,
  },
  appName: {
    color: "#FFE600",
    fontFamily: "Karla-Bold",
    fontSize: 22,
    letterSpacing: 1,
  },
  illustration: {
    width: 250,
    height: 250,
    marginBottom: 10,
    marginTop: -1,
  },
  heading: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    fontFamily: "Karla",
    marginBottom: 12,
    lineHeight: 32,
  },
  highlight: {
    color: "#FFE600",
    fontFamily: "Karla-Bold",
  },
  subheading: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 32,
    opacity: 0.9,
    fontFamily: "Karla",
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 48,
    marginBottom: 18,
  },
  buttonText: {
    color: "#4B2ACF",
    fontFamily: "Karla-Bold",
    fontSize: 16,
  },
  logInText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    opacity: 0.9,
    fontFamily: "Karla",
  },
  logInLink: {
    color: "#FFE600",
    fontFamily: "Karla-Bold",
    textDecorationLine: "underline",
  },
});
