import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDneCdgJqQHSiet2m85xN4pAkmjFcsPFE",
  authDomain: "appfoto-7659e.firebaseapp.com",
  databaseURL: "https://appfoto-7659e-default-rtdb.firebaseio.com",
  projectId: "appfoto-7659e",
  storageBucket: "appfoto-7659e.firebasestorage.app",
  messagingSenderId: "383809388991",
  appId: "1:383809388991:web:a403afe28dab13ee70c90a",
  measurementId: "G-0P47LZ222F"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
