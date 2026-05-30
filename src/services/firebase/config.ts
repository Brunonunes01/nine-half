import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

const getReactNativePersistenceSafe = () => {
  try {
    const authModule = require('firebase/auth');
    return authModule.getReactNativePersistence || null;
  } catch (err) {
    return null;
  }
};

const createAuth = () => {
  if (Platform.OS === 'web') {
    return getAuth(firebaseApp);
  }

  try {
    const persistenceFactory = getReactNativePersistenceSafe();
    if (persistenceFactory && AsyncStorage) {
      return initializeAuth(firebaseApp, {
        persistence: persistenceFactory(AsyncStorage),
      });
    }
    return getAuth(firebaseApp);
  } catch (error) {
    return getAuth(firebaseApp);
  }
};

const firebaseAuth = createAuth();
const firestore = getFirestore(firebaseApp);

export { firebaseApp, firebaseAuth, firestore };
