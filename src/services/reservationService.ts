import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  where
} from 'firebase/firestore';
import { PRODUCT_STATUS } from '../constants/productStatus';
import { RESERVATION_STATUS } from '../constants/reservationStatus';
import { firestore } from './firebase/firestore';

const PRODUCTS_COLLECTION = 'products';
const SHOWCASES_COLLECTION = 'showcases';
const RESERVATIONS_COLLECTION = 'reservations';

export async function reserveProduct({ productId, buyerId }: { productId: string; buyerId: string }) {
  try {
    const result = await runTransaction(firestore, async (transaction) => {
      const productRef = doc(firestore, PRODUCTS_COLLECTION, productId);
      const productSnap = await transaction.get(productRef);

      if (!productSnap.exists()) {
        throw new Error('Produto não encontrado.');
      }

      const product = productSnap.data() as any;

      if (product.ownerId === buyerId) {
        throw new Error('Você não pode reservar seu próprio produto.');
      }

      if (product.status !== PRODUCT_STATUS.AVAILABLE) {
        throw new Error('Produto já reservado ou vendido.');
      }

      // Cálculo da data de expiração baseada na configuração do PRODUTO
      const horasValidade = product.tempoReserva || 24; // Usa a config do vendedor ou padrão 24h
      const now = new Date();
      const expiresAt = new Date(now.getTime() + horasValidade * 60 * 60 * 1000);

      const showcaseRef = doc(firestore, SHOWCASES_COLLECTION, product.showcaseId);
      const showcaseSnap = await transaction.get(showcaseRef);
      if (!showcaseSnap.exists() || showcaseSnap.data()?.visivel !== true) {
        throw new Error('Produto indisponível para reserva.');
      }

      const reservationRef = doc(collection(firestore, RESERVATIONS_COLLECTION));

      transaction.set(reservationRef, {
        id: reservationRef.id,
        productId: product.id,
        buyerId,
        sellerId: product.ownerId,
        showcaseId: product.showcaseId,
        productModel: product.modelo || '',
        productBrand: product.marca || '',
        productPrice: String(product.preco || ''),
        productImageUrl: product.imagemUrl || '',
        status: RESERVATION_STATUS.ACTIVE,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(expiresAt), // Validade personalizada aqui
        cancelReason: null
      });

      transaction.update(productRef, {
        status: PRODUCT_STATUS.RESERVED,
        reservedBy: buyerId,
        reservedAt: serverTimestamp(),
        reservationId: reservationRef.id,
        updatedAt: serverTimestamp()
      });

      return { reservationId: reservationRef.id };
    });

    return result;
  } catch (error: any) {
    if (error?.message) throw error;
    throw new Error('Erro ao reservar produto.');
  }
}

export async function cancelReservation({
  reservationId,
  userId,
  cancelReason
}: {
  reservationId: string;
  userId: string;
  cancelReason?: string;
}) {
  try {
    await runTransaction(firestore, async (transaction) => {
      const reservationRef = doc(firestore, RESERVATIONS_COLLECTION, reservationId);
      const reservationSnap = await transaction.get(reservationRef);

      if (!reservationSnap.exists()) {
        throw new Error('Reserva não encontrada.');
      }

      const reservation = reservationSnap.data() as any;

      if (reservation.status !== RESERVATION_STATUS.ACTIVE) {
        throw new Error('Reserva não está ativa.');
      }

      if (reservation.buyerId !== userId && reservation.sellerId !== userId) {
        throw new Error('Você não tem permissão para cancelar esta reserva.');
      }

      const productRef = doc(firestore, PRODUCTS_COLLECTION, reservation.productId);
      const productSnap = await transaction.get(productRef);

      if (!productSnap.exists()) {
        throw new Error('Produto não encontrado.');
      }

      transaction.update(reservationRef, {
        status: RESERVATION_STATUS.CANCELED,
        cancelReason: cancelReason || 'Cancelada pelo usuário.',
        updatedAt: serverTimestamp()
      });

      transaction.update(productRef, {
        status: PRODUCT_STATUS.AVAILABLE,
        reservedBy: null,
        reservedAt: null,
        reservationId: null,
        updatedAt: serverTimestamp()
      });
    });
  } catch (error: any) {
    if (error?.message) throw error;
    throw new Error('Erro ao cancelar reserva.');
  }
}

export async function getReservationsByUser(userId: string) {
  const qBuyer = query(collection(firestore, RESERVATIONS_COLLECTION), where('buyerId', '==', userId));
  const qSeller = query(collection(firestore, RESERVATIONS_COLLECTION), where('sellerId', '==', userId));
  
  const [snapBuyer, snapSeller] = await Promise.all([getDocs(qBuyer), getDocs(qSeller)]);
  
  const all = [...snapBuyer.docs, ...snapSeller.docs].map(doc => ({ id: doc.id, ...doc.data() }));
  const unique = Array.from(new Map(all.map(item => [item.id, item])).values());
  
  return unique.sort((a: any, b: any) => (b?.createdAt?.seconds || 0) - (a?.createdAt?.seconds || 0));
}

export async function getReservationById(reservationId: string) {
  const reservationRef = doc(firestore, RESERVATIONS_COLLECTION, reservationId);
  const snap = await getDoc(reservationRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}
