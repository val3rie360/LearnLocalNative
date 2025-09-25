import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Function to add or update user profile
export const createUserProfile = async (userId, profileData) => {
    return setDoc(doc(db, 'profiles', userId), profileData);
};