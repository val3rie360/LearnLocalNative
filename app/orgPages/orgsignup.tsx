import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { DocumentPickerAsset } from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signUp } from "../../services/authServices";
import {
  getUploadById,
  uploadPDF,
} from "../../services/cloudinaryUploadService";
import {
  signInWithFacebook,
  signInWithGoogle,
} from "../../services/socialAuthServices";

type UploadDocument = {
  cloudinaryPublicId?: string;
  cloudinarySecureUrl?: string;
  cloudinaryUrl?: string;
};

export default function OrgSignup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [file, setFile] = useState<DocumentPickerAsset | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
      });
      if (!result.canceled) {
        setFile(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const handleSignUp = async () => {
    setError(""); // Clear previous error

    // Trim all fields before validation
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (
      !trimmedName ||
      !trimmedEmail ||
      !trimmedPassword ||
      !trimmedConfirmPassword
    ) {
      setError("Please fill in all fields");
      return;
    }
    if (trimmedPassword !== trimmedConfirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!file) {
      setError("Please upload a verification document");
      return;
    }
    if (!accepted) {
      setError("Please accept the terms and conditions");
      return;
    }

    setLoading(true);
    try {
      console.log("📄 File to upload:", {
        name: file.name,
        size: file.size,
        uri: file.uri,
        mimeType: file.mimeType,
      });

      // Ensure all required properties exist
      if (!file.uri || !file.name || file.size === undefined) {
        throw new Error("Invalid file selected. Please try again.");
      }

      console.log(
        "🚀 Attempting to register organization with email:",
        trimmedEmail
      );

      const sanitizedOrgId =
        trimmedEmail.replace(/[^a-zA-Z0-9_-]/g, "_") || "pending-org";

      const uploadId = await uploadPDF(
        {
          uri: file.uri,
          name: file.name,
          mimeType: file.mimeType,
          size: file.size ?? 0,
          type: file.mimeType ?? "application/pdf",
        },
        sanitizedOrgId,
        {
          displayName: file.name,
          description: `${trimmedName} verification`,
          category: "verification",
          tags: ["organization", "verification"],
        },
        () => {}
      );

      const uploadDoc = (await getUploadById(uploadId)) as UploadDocument;

      const extraData = {
        name: trimmedName,
        verificationFile: {
          uri: file.uri,
          name: file.name,
          size: file.size ?? 0,
          mimeType: file.mimeType ?? "application/pdf",
          uploadId,
          cloudinaryPublicId: uploadDoc.cloudinaryPublicId,
          cloudinarySecureUrl: uploadDoc.cloudinarySecureUrl,
          cloudinaryUrl: uploadDoc.cloudinaryUrl,
          storage: "cloudinary",
        },
      };

      await signUp(trimmedEmail, trimmedPassword, "organization", extraData);
      console.log("✅ Organization registered successfully");
      router.replace("/orgPages/(tabs)/OrgHome");
    } catch (error: any) {
      console.error("❌ Error registering organization:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        stack: error.stack,
      });

      if (error.code === "auth/email-already-in-use") {
        setError(
          "This email is already registered. Please use a different email or try logging in."
        );
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please choose a stronger password.");
      } else if (error.message?.includes("File upload failed")) {
        setError("Failed to upload verification file. Please try again.");
      } else {
        setError(`Registration failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace("/orgPages/(tabs)/OrgHome");
    } catch (error) {
      setError("Google sign-up failed. Please try again.");
      console.error("Google signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignUp = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithFacebook();
      router.replace("/orgPages/(tabs)/OrgHome");
    } catch (error) {
      setError("Facebook sign-up failed. Please try again.");
      console.error("Facebook signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#4B1EB4]">
      {loading && (
        <View className="absolute inset-0 z-50 bg-black/40 justify-center items-center">
          <View className="bg-white px-6 py-4 rounded-2xl items-center shadow-lg">
            <ActivityIndicator size="large" color="#4B1EB4" />
            <Text className="mt-3 text-[#4B1EB4] font-karla-bold">
              Creating your account...
            </Text>
          </View>
        </View>
      )}
      <View className="flex-1 bg-secondary">
        {/* Top Section */}
        <View className="pt-5 pb-4 px-6 bg-[#4B1EB4]">
          <Text className="text-white text-[33px] font-karla-bold mb-1">
            Hello!
          </Text>
          <Text className="text-[#E0D7FF] text-base font-karla">
            Create an account
          </Text>
        </View>
        {/* Card Section */}
        <LinearGradient
          colors={["#fff", "#e5e0ff"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            flex: 1,
            marginTop: 0,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 20,
            paddingTop: 24,
          }}
        >
          <Text className="text-[24px] font-karla-bold text-[#4B1EB4] mb-6">
            Sign Up
          </Text>
          {/* Error Message */}
          {error ? (
            <Text className="text-red-500 text-sm mb-4">{error}</Text>
          ) : null}
          {/* Name */}
          <View className="flex-row items-center bg-white rounded-full px-4 mb-4 h-12 shadow border border-[#e0d7ff]">
            <Feather
              name="user"
              size={18}
              color="#A1A1AA"
              style={{ marginRight: 8 }}
            />
            <TextInput
              className="flex-1 text-base font-karla text-[#222]"
              placeholder="Name"
              placeholderTextColor="#A1A1AA"
              value={name}
              onChangeText={setName}
            />
          </View>
          {/* Email */}
          <View className="flex-row items-center bg-white rounded-full px-4 mb-4 h-12 shadow border border-[#e0d7ff]">
            <Feather
              name="mail"
              size={18}
              color="#A1A1AA"
              style={{ marginRight: 8 }}
            />
            <TextInput
              className="flex-1 text-base font-karla text-[#222]"
              placeholder="Email"
              placeholderTextColor="#A1A1AA"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>
          {/* Password */}
          <View className="flex-row items-center bg-white rounded-full px-4 mb-4 h-12 shadow border border-[#e0d7ff]">
            <Feather
              name="lock"
              size={18}
              color="#A1A1AA"
              style={{ marginRight: 8 }}
            />
            <TextInput
              className="flex-1 text-base font-karla text-[#222]"
              placeholder="Password"
              placeholderTextColor="#A1A1AA"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              keyboardType="default"
            />
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              className="p-1 ml-1"
              accessibilityLabel={
                showPassword ? "Hide password" : "Show password"
              }
              activeOpacity={1}
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#A1A1AA"
              />
            </TouchableOpacity>
          </View>
          {/* Confirm Password */}
          <View className="flex-row items-center bg-white rounded-full px-4 mb-4 h-12 shadow border border-[#e0d7ff]">
            <Feather
              name="lock"
              size={18}
              color="#A1A1AA"
              style={{ marginRight: 8 }}
            />
            <TextInput
              className="flex-1 text-base font-karla text-[#222]"
              placeholder="Confirm Password"
              placeholderTextColor="#A1A1AA"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              keyboardType="default"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword((prev) => !prev)}
              className="p-1 ml-1"
              accessibilityLabel={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              activeOpacity={1}
            >
              <Feather
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color="#A1A1AA"
              />
            </TouchableOpacity>
          </View>
          {/* Upload Proof Label */}
          <Text className="font-karla-bold text-[15px] text-[#4B1EB4] mb-1 mt-1">
            Upload Proof{" "}
            <Text className="font-karla text-xs text-[#A1A1AA]">
              (school ID, permit, letter etc.)
            </Text>
          </Text>
          {/* Upload File */}
          <TouchableOpacity onPress={pickDocument}>
            <View className="flex-row items-center bg-white rounded-full px-4 mb-4 h-12 shadow border border-[#e0d7ff]">
              <Feather
                name="upload"
                size={18}
                color="#A1A1AA"
                style={{ marginRight: 8 }}
              />
              <TextInput
                className="flex-1 text-base font-karla text-[#222]"
                placeholder="Upload File"
                placeholderTextColor="#A1A1AA"
                value={file ? file.name : ""}
                editable={false}
                keyboardType="default"
              />
            </View>
          </TouchableOpacity>
          {/* Terms Checkbox */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              className="mr-2"
              onPress={() => setAccepted((prev) => !prev)}
              activeOpacity={1}
              style={{
                width: 20,
                height: 20,
                borderWidth: 1.5,
                borderColor: "#4B1EB4",
                borderRadius: 4,
                backgroundColor: accepted ? "#4B1EB4" : "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {accepted && <Feather name="check" size={14} color="#fff" />}
            </TouchableOpacity>
            <Text className="text-xs text-[#4B1EB4] font-karla">
              I have accepted the terms and conditions
            </Text>
          </View>
          {/* Register Button */}
          <TouchableOpacity
            className="bg-[#4B1EB4] rounded-full py-3 items-center mb-6 shadow-md"
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text className="text-white text-base font-karla-bold">
              {loading ? "Registering..." : "Register"}
            </Text>
          </TouchableOpacity>
          {/* Or Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-secondary" />
            <Text className="mx-2 text-secondary font-karla text-sm">
              Or continue with
            </Text>
            <View className="flex-1 h-px bg-secondary" />
          </View>
          {/* Social Buttons */}
          <View className="flex-row justify-center mb-4">
            <TouchableOpacity
              className="bg-white rounded-xl p-2 shadow mr-4"
              onPress={handleFacebookSignUp}
              disabled={loading}
            >
              <Image
                source={require("../../assets/images/fb.png")}
                className="w-8 h-8"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white rounded-xl p-2 shadow"
              onPress={handleGoogleSignUp}
              disabled={loading}
            >
              <Image
                source={require("../../assets/images/google.png")}
                className="w-8 h-8"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          {/* Sign In Link */}
          <View className="flex-row justify-center items-center mb-2">
            <Text className="text-secondary font-karla text-sm">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() =>
                router.replace({
                  pathname: "/login",
                })
              }
            >
              <Text className="text-[#4B1EB4] font-karla-bold text-sm underline">
                Log in
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}
