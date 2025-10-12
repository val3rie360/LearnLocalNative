import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebaseconfig";
import { logOut } from "../../services/authServices";

type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "organization" | "admin";
  createdAt: string;
  verificationStatus: "pending" | "verified" | "rejected";
  verificationFileUrl?: string;
};

function StatusTag({ status }: { status: User["verificationStatus"] }) {
  let bg = "";
  let text = "";
  if (status === "pending") {
    bg = "bg-yellow-100";
    text = "text-yellow-800";
  } else if (status === "verified") {
    bg = "bg-green-100";
    text = "text-green-800";
  } else {
    bg = "bg-red-100";
    text = "text-red-800";
  }
  return (
    <View className={`px-2 py-1 rounded-full ${bg}`}>
      <Text className={`text-xs font-karla-bold ${text}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
}

export default function SuperAdminReview() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const profilesSnapshot = await getDocs(collection(db, "profiles"));
        const usersData: User[] = profilesSnapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || "Unknown",
              email: data.email || "No email",
              role: data.role || "student",
              createdAt: data.createdAt?.seconds
                ? new Date(data.createdAt.seconds * 1000).toLocaleDateString()
                : "Unknown date",
              verificationStatus: data.verificationStatus || "pending",
              verificationFileUrl: data.verificationFileUrl || null,
            };
          })
          .filter((user) => user.role !== "admin"); // Filter out admin accounts
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleApprove = async (userId: string) => {
    console.log("Approve user:", userId);
    // TODO: Update Firestore with verification status
  };

  const handleReject = async (userId: string) => {
    console.log("Reject user:", userId);
    // TODO: Update Firestore with verification status
  };

  const handleViewFile = (fileUrl: string) => {
    const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileUrl);

    if (isImage) {
      setSelectedImage(fileUrl);
      setModalVisible(true);
    } else {
      Linking.openURL(fileUrl);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        className="flex-1 bg-[#F6F4FE] justify-center items-center"
        edges={["top"]}
      >
        <ActivityIndicator size="large" color="#4B1EB4" />
        <Text className="mt-4 text-[#6B7280] font-karla">Loading users...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F6F4FE]" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-[22px] font-karla-bold text-[#18181B]">
            Account Verification
          </Text>
          <TouchableOpacity
            className="bg-red-500 rounded-full px-4 py-2 flex-row items-center"
            onPress={handleLogout}
          >
            <Text className="text-white font-karla-bold text-[14px]">
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {users.length === 0 ? (
          <View className="bg-white rounded-2xl p-6 items-center">
            <Text className="text-[#6B7280] font-karla">No users found</Text>
          </View>
        ) : (
          users.map((user) => (
            <View
              key={user.id}
              className="bg-white rounded-2xl p-4 mb-4 shadow border border-[#E5E0FF]"
            >
              <View className="flex-row items-center mb-2">
                {user.role === "student" ? (
                  <Ionicons
                    name="person-circle"
                    size={32}
                    color="#4B1EB4"
                    style={{ marginRight: 10 }}
                  />
                ) : (
                  <FontAwesome5
                    name="school"
                    size={28}
                    color="#4B1EB4"
                    style={{ marginRight: 10 }}
                  />
                )}
                <View className="flex-1">
                  <Text className="font-karla-bold text-[16px] text-[#18181B]">
                    {user.name}
                  </Text>
                  <Text className="font-karla text-[13px] text-[#6B7280]">
                    {user.email}
                  </Text>
                  <Text className="font-karla text-[13px] text-[#6B7280] capitalize">
                    {user.role}
                  </Text>
                </View>
                <StatusTag status={user.verificationStatus} />
              </View>
              <Text className="text-[12px] text-[#A1A1AA] font-karla mb-2">
                Joined: {user.createdAt}
              </Text>

              {/* Verification File Button */}
              {user.verificationFileUrl && (
                <TouchableOpacity
                  className="bg-[#E5E0FF] rounded-lg py-2 px-3 mb-2 flex-row items-center"
                  onPress={() => handleViewFile(user.verificationFileUrl!)}
                >
                  <Ionicons name="document-attach" size={18} color="#4B1EB4" />
                  <Text className="text-[#4B1EB4] font-karla-bold ml-2">
                    View Verification File
                  </Text>
                </TouchableOpacity>
              )}

              {user.verificationStatus === "pending" && (
                <View className="flex-row gap-2 mt-2">
                  <TouchableOpacity
                    className="flex-1 bg-green-100 rounded-full py-2 items-center"
                    onPress={() => handleApprove(user.id)}
                  >
                    <Text className="text-green-800 font-karla-bold">
                      Approve
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-red-100 rounded-full py-2 items-center"
                    onPress={() => handleReject(user.id)}
                  >
                    <Text className="text-red-800 font-karla-bold">Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Image Preview Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/90 justify-center items-center">
          <TouchableOpacity
            className="absolute top-12 right-6 z-10"
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close-circle" size={40} color="white" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: "90%", height: "80%" }}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
