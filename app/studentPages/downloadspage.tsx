import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Add this import
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const files = [
  { id: "1", title: "Math for Kids", date: "08/09/25", size: "5.2 MB" },
  { id: "2", title: "Genetics & Heredity", date: "08/09/25", size: "5.2 MB" },
  { id: "3", title: "Creative Writing 101", date: "08/09/25", size: "5.2 MB" },
  { id: "4", title: "World History", date: "08/09/25", size: "5.2 MB" },
  { id: "5", title: "Health and Fitness", date: "08/09/25", size: "5.2 MB" },
  { id: "6", title: "Coding for Kids", date: "08/09/25", size: "5.2 MB" },
];

const FileCard = ({
  title,
  date,
  size,
}: {
  title: string;
  date: string;
  size: string;
}) => (
  <View style={styles.card}>
    <Feather name="file" size={48} color="#6C63FF" style={styles.cardIcon} />
    <Text style={styles.cardTitle} numberOfLines={1}>
      {title}
    </Text>
    <Text style={styles.cardSubtitle}>
      {date} | {size}
    </Text>
  </View>
);

export default function DownloadsPage() {
  const router = useRouter();
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F6F4FE" }}
      edges={["top"]}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather
              name="arrow-left"
              size={24}
              color="#222"
              style={{ marginTop: 5 }}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Downloads</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={18}
            color="#000000ff"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for learning materials..."
            placeholderTextColor="#B0B0B0"
          />
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: "#ECECEC",
            width: "100%",
            marginVertical: 8,
          }}
        />
        {/* Section Title */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Your files</Text>
          <TouchableOpacity>
            <Feather name="settings" size={20} color="#6C63FF" />
          </TouchableOpacity>
        </View>

        {/* Files Grid */}
        <FlatList
          data={files}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.filesList}
          renderItem={({ item }) => (
            <FileCard title={item.title} date={item.date} size={item.size} />
          )}
          ListFooterComponent={
            <Text style={styles.footerText}>No more files to show.</Text>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F4FE",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 28,
    marginLeft: 16,
    color: "#222",
    fontFamily: "Karla-Bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 44,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#222",
    fontFamily: "Karla",
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    fontFamily: "Karla-Bold",
  },
  filesList: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    margin: 8,
    flex: 1,
    minWidth: 140,
    maxWidth: "48%",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardIcon: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    marginBottom: 4,
    textAlign: "center",
    fontFamily: "Karla-Bold",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    fontFamily: "Karla",
  },
  footerText: {
    textAlign: "center",
    color: "#888",
    marginTop: 24,
    fontSize: 14,
    fontFamily: "Karla",
  },
});
