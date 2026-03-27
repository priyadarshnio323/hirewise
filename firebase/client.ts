// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getApps , getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAd5neZFSi5ByI3wcPhkmycQ-eXRXZCunI",
  authDomain: "hirewise-9b329.firebaseapp.com",
  projectId: "hirewise-9b329",
  storageBucket: "hirewise-9b329.firebasestorage.app",
  messagingSenderId: "879077161111",
  appId: "1:879077161111:web:51c8893e2b4de3354811d2",
  measurementId: "G-1G6E08Q2VR"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);