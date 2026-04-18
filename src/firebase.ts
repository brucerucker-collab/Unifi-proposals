// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_88O0L3vJ35Z0_NkdvTMcgK7smWS94Qg",
  authDomain: "unifi-proposals.firebaseapp.com",
  projectId: "unifi-proposals",
  storageBucket: "unifi-proposals.firebasestorage.app",
  messagingSenderId: "1004598907196",
  appId: "1:1004598907196:web:de1c2b9b6afb2b98bd8e39",
  measurementId: "G-5D2DEHF0QH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
