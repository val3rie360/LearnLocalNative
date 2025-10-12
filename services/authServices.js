import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../firebaseconfig";
import { createUserProfile } from "./firestoreService";

// Sign up function for user registration
export const signUp = async (email, password, role, extrData = {}) => {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    let verificationFileUrl = null;
    const { name, verificationFile } = extrData;
    if (
      role === "organization" &&
      extrData.verificationFile &&
      extrData.verificationFile.uri
    ) {
      try {
        const file = extrData.verificationFile;
        console.log(
          "Uploading verification file:",
          file.name,
          "Size:",
          file.size
        );

        // create a unique path for the file in firebase storage
        const storageRef = ref(
          storage,
          `verifications/${user.uid}/${file.name}`
        );

        // fetching file content as a blob for uploading
        const response = await fetch(file.uri);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        const blob = await response.blob();
        console.log("File blob created, size:", blob.size);

        await uploadBytes(storageRef, blob);
        verificationFileUrl = await getDownloadURL(storageRef);
        console.log("File uploaded successfully. URL:", verificationFileUrl);
      } catch (storageError) {
        console.error("Storage upload error:", storageError);
        // Don't throw the error, just log it and continue without the file
        console.log("Continuing registration without file upload");
      }
    }

    // Create user profile in Firestore
    const profileData = {
      email: user.email,
      role: role,
      name: name || null,
      createdAt: new Date(),

      verificationFileUrl: verificationFileUrl || null,
    };

    await createUserProfile(user.uid, { ...profileData, ...extrData });

    return user;
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
};

// Sign in function for user login
export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign out function for user logout
export const logOut = () => {
  return signOut(auth);
};

// Listener for authentication state changes
export const authStateListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};
