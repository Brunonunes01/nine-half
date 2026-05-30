import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { firebaseAuth } from './firebase/auth';
import { createUserProfile, getUserById } from './userService';
import { USER_TYPES } from '../constants/userTypes';

export async function login(email, password) {
  const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
  const profile = await getUserById(credential.user.uid);

  return {
    authUser: credential.user,
    profile
  };
}

export async function register({ nome, email, password }) {
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  const authUser = credential.user;

  const profile = await createUserProfile({
    id: authUser.uid,
    nome,
    email: authUser.email || email,
    tipo: USER_TYPES.COMMON
  });

  return {
    authUser,
    profile
  };
}

export async function logout() {
  await signOut(firebaseAuth);
}

export function getCurrentUser() {
  return firebaseAuth.currentUser;
}

export function onAuthStateChangedListener(callback) {
  return onAuthStateChanged(firebaseAuth, callback);
}
