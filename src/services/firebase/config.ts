import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

let firebaseAuth;

try {
  // Use official getReactNativePersistence for correct async storage handling
  firebaseAuth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error: any) {
  // If initializeAuth throws because it was already initialized, fallback to getAuth
  if (error?.code === 'auth/already-initialized') {
    const { getAuth } = require('firebase/auth');
    firebaseAuth = getAuth(firebaseApp);
  } else {
    // Other errors should just grab the auth instance as a last resort
    const { getAuth } = require('firebase/auth');
    firebaseAuth = getAuth(firebaseApp);
  }
}

const firestore = getFirestore(firebaseApp);

export { firebaseApp, firebaseAuth, firestore };
