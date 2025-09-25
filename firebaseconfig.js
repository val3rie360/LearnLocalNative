// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBanWwBpR0CcSPaVlltG6f3L8G9DlwgLoE",
  authDomain: "learnlocal-nat.firebaseapp.com",
  databaseURL: "https://learnlocal-nat-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "learnlocal-nat",
  storageBucket: "learnlocal-nat.firebasestorage.app",
  messagingSenderId: "231794248283",
  appId: "1:231794248283:web:b33a2eae0191ee85f84d7e",
  measurementId: "G-VTWTGEE3KH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);