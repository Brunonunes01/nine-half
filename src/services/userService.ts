import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { createUserModel, createUserPrivateModel } from '../models/UserModel';
import { firestore } from './firebase/firestore';

const USERS_COLLECTION = 'users';
const USERS_PRIVATE_COLLECTION = 'users_private';

export async function createUserProfile(userData: any) {
  const publicUser = createUserModel(userData);
  const privateUser = createUserPrivateModel({
    id: publicUser.id,
    documento: userData?.documento || '',
    endereco: userData?.endereco || '',
    cep: userData?.cep || '',
    telefone: userData?.telefone || ''
  });

  const userRef = doc(firestore, USERS_COLLECTION, publicUser.id);
  const userPrivateRef = doc(firestore, USERS_PRIVATE_COLLECTION, privateUser.id);

  await Promise.all([
    setDoc(userRef, {
      ...publicUser,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }),
    setDoc(userPrivateRef, {
      ...privateUser,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  ]);

  return publicUser;
}

export async function getUserById(userId: string) {
  const userRef = doc(firestore, USERS_COLLECTION, userId);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data()
  } as any;
}

export async function getMyPrivateProfile(userId: string) {
  const userPrivateRef = doc(firestore, USERS_PRIVATE_COLLECTION, userId);
  const snapshot = await getDoc(userPrivateRef);
  if (!snapshot.exists()) return null;
  return {
    id: snapshot.id,
    ...snapshot.data()
  } as any;
}

export async function updateUserProfile(userId: string, data: any) {
  const userRef = doc(firestore, USERS_COLLECTION, userId);
  const payload: Record<string, any> = { ...data };

  delete payload.id;
  delete payload.email;
  delete payload.createdAt;
  delete payload.tipo;
  delete payload.documento;
  delete payload.telefone;
  delete payload.endereco;
  delete payload.cep;

  await updateDoc(userRef, {
    ...payload,
    updatedAt: serverTimestamp()
  });
}

export async function updateMyPrivateProfile(userId: string, data: any) {
  const userPrivateRef = doc(firestore, USERS_PRIVATE_COLLECTION, userId);
  const payload: Record<string, any> = { ...data };

  delete payload.id;
  delete payload.createdAt;
  delete payload.email;
  delete payload.nome;
  delete payload.tipo;
  delete payload.bio;
  delete payload.whatsapp;
  delete payload.cidade;
  delete payload.pagamentos;
  delete payload.verificado;

  await updateDoc(userPrivateRef, {
    ...payload,
    updatedAt: serverTimestamp()
  });
}
