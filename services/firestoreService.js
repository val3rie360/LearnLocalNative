import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseconfig";

// Function to add or update user profile
export const createUserProfile = async (userId, profileData) => {
  return setDoc(doc(db, "profiles", userId), profileData);
};

// Function to get user profile data
export const getUserProfile = async (userId) => {
  try {
    const profileDoc = await getDoc(doc(db, "profiles", userId));
    if (profileDoc.exists()) {
      return profileDoc.data();
    } else {
      console.log("No profile document found for user:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Function to update user profile data
export const updateUserProfile = async (userId, profileData) => {
  try {
    await setDoc(doc(db, "profiles", userId), profileData, { merge: true });
    console.log("Profile updated successfully");
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
