import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
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

const AUTH_STORAGE_KEY_PREFIX = 'nine_half_auth_';

const asyncStoragePersistence: any = {
  type: 'LOCAL',
  async _isAvailable() {
    return true;
  },
  async _set(key: string, value: any) {
    await AsyncStorage.setItem(`${AUTH_STORAGE_KEY_PREFIX}${key}`, JSON.stringify(value));
  },
  async _get<T>(key: string) {
    const raw = await AsyncStorage.getItem(`${AUTH_STORAGE_KEY_PREFIX}${key}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as any;
    }
  },
  async _remove(key: string) {
    await AsyncStorage.removeItem(`${AUTH_STORAGE_KEY_PREFIX}${key}`);
  },
  _addListener() {
    return undefined;
  },
  _removeListener() {
    return undefined;
  }
};

let firebaseAuth;

try {
  firebaseAuth = initializeAuth(firebaseApp, {
    persistence: asyncStoragePersistence
  });
} catch {
  firebaseAuth = getAuth(firebaseApp);
}

const firestore = getFirestore(firebaseApp);

export { firebaseApp, firebaseAuth, firestore };
