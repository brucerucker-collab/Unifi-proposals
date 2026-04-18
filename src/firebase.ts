import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA_88O0L3vJ35Z0_NkdvTMcgK7smWS94Qg",
  authDomain: "unifi-proposals.firebaseapp.com",
  projectId: "unifi-proposals",
  storageBucket: "unifi-proposals.firebasestorage.app",
  messagingSenderId: "1004598907196",
  appId: "1:1004598907196:web:de1c2b9b6afb2b98bd8e39",
  measurementId: "G-5D2DEHF0QH"
};
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
