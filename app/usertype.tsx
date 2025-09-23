import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserType() {
  const [selected, setSelected] = useState<"student" | "org" | null>(null);
  const router = useRouter();
  const [isPressing, setIsPressing] = useState(false);

  const handleSelect = (type: "student" | "org") => {
    if (isPressing) return;
    setIsPressing(true);
    setSelected(type);

    // release lock after short delay
    setTimeout(() => setIsPressing(false), 400);
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/images/learl.png")}
        style={styles.logo}
      />

      {/* Welcome */}
      <Text style={styles.welcome}>
        Welcome to <Text style={styles.logoText}>LearnLocal</Text>
      </Text>
      <Text style={styles.desc}>
        Tell us who you are so we can personalize your experience.
      </Text>

      {/* Cards */}
      <View style={styles.cardRow}>
        <TouchableOpacity
          style={[styles.card, selected === "student" && styles.cardSelected]}
          onPress={() => handleSelect("student")}
          activeOpacity={1}
        >
          <Ionicons
            name="school"
            size={48}
            color="#4B2ACF"
            style={{ marginBottom: 12 }}
          />
          <Text style={styles.cardTitle}>I’m a Student</Text>
          <Text style={styles.cardDesc}>
            Discover scholarships, workshops, study spots, and learning programs
            near you.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, selected === "org" && styles.cardSelected]}
          onPress={() => handleSelect("org")}
          activeOpacity={1}
        >
          <FontAwesome5
            name="school"
            size={48}
            color="#4B2ACF"
            style={{ marginBottom: 12 }}
          />
          <Text style={styles.cardTitle}>I’m an Organization</Text>
          <Text style={styles.cardDesc}>
            Share your programs and connect with students in your community.
          </Text>
        </TouchableOpacity>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[styles.continueBtn, { opacity: selected ? 1 : 0.5 }]}
        disabled={!selected}
        onPress={() => {
          if (selected === "student") {
            router.replace("/studentPages/studentsignup");
          } else if (selected === "org") {
            router.replace("/orgsignup");
          }
        }}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4B2ACF",
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 18,
  },
  logo: {
    width: 54,
    height: 54,
    marginBottom: 13,
    alignSelf: "center",
  },
  welcome: {
    color: "#fff",
    fontFamily: "Karla-Bold",
    fontSize: 22,
    marginBottom: 8,
    textAlign: "center",
  },
  logoText: {
    color: "#FFE600",
    fontFamily: "Karla-Bold",
    fontSize: 22,
  },
  desc: {
    color: "#E0D6FF",
    fontFamily: "Karla",
    fontSize: 15,
    opacity: 1,
    marginBottom: 32,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 48,
    gap: 18,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: "center",
    width: 150,
    elevation: 3,
    borderWidth: 3.5,
    borderColor: "transparent",
  },
  cardSelected: {
    borderColor: "#FFE600",
    shadowColor: "#FFE600",
  },
  cardTitle: {
    fontFamily: "Karla-Bold",
    fontSize: 17,
    color: "#1A1158",
    marginBottom: 8,
    textAlign: "center",
  },
  cardDesc: {
    fontFamily: "Karla",
    fontSize: 13,
    color: "#4B2ACF",
    textAlign: "center",
    opacity: 0.85,
  },
  continueBtn: {
    backgroundColor: "#fff",
    borderRadius: 32,
    paddingVertical: 13,
    paddingHorizontal: 48,
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 16,
    elevation: 2,
  },
  continueText: {
    color: "#4B2ACF",
    fontFamily: "Karla-Bold",
    fontSize: 17,
    textAlign: "center",
  },
});
