import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
  updateDoc,
  where
} from 'firebase/firestore';
import { firestore } from './firebase/firestore';
import { createShowcaseModel } from '../models/ShowcaseModel';

const SHOWCASES_COLLECTION = 'showcases';

export async function createShowcase({ userId, nome, visivel = false }) {
  const docRef = doc(collection(firestore, SHOWCASES_COLLECTION));
  const showcase = createShowcaseModel({ id: docRef.id, userId, nome, visivel });
  await setDoc(docRef, {
    ...showcase,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return showcase;
}

export async function getShowcaseByUserId(userId) {
  const q = query(
    collection(firestore, SHOWCASES_COLLECTION),
    where('userId', '==', userId),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const first = snapshot.docs[0];
  return { id: first.id, ...first.data() };
}

export async function updateShowcase(showcaseId, data) {
  const showcaseRef = doc(firestore, SHOWCASES_COLLECTION, showcaseId);
  await updateDoc(showcaseRef, { ...data, updatedAt: serverTimestamp() });
}

export async function toggleShowcaseVisibility(showcaseId: string, visivel: boolean, userId: string) {
  try {
    console.log(`[showcaseService] Iniciando sincronização para Vitrine: ${showcaseId}, Usuário: ${userId}`);
    const showcaseRef = doc(firestore, SHOWCASES_COLLECTION, showcaseId);
    
    // 1. Atualiza a vitrine
    await updateDoc(showcaseRef, { visivel, updatedAt: serverTimestamp() });

    // 2. Busca apenas os produtos que PERTENCEM ao usuário nesta vitrine
    // É crucial filtrar por ownerId para satisfazer as regras de segurança do Firestore
    const q = query(
      collection(firestore, 'products'), 
      where('showcaseId', '==', showcaseId)
    );
    
    const productsSnapshot = await getDocs(q);
    
    if (productsSnapshot.empty) {
      console.log('[showcaseService] Nenhum produto do usuário encontrado para sincronizar.');
      return;
    }

    console.log(`[showcaseService] Sincronizando ${productsSnapshot.size} produtos...`);

    // 3. Batch update
    const batch = writeBatch(firestore);
    productsSnapshot.docs.forEach((item) => {
      const data = item.data() as any;
      if (data?.ownerId !== userId) return;
      batch.update(item.ref, {
        showcaseVisible: visivel,
        updatedAt: serverTimestamp()
      });
    });

    await batch.commit();
    console.log('[showcaseService] Sincronização concluída com sucesso.');
  } catch (error: any) {
    console.error('[showcaseService] Erro na sincronização:', error);
    throw error;
  }
}

export async function getPublicShowcases() {
  const q = query(collection(firestore, SHOWCASES_COLLECTION), where('visivel', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}
