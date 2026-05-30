import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RESERVATION_STATUS } from '../../../constants/reservationStatus';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { shadows } from '../../../theme/shadows';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { formatCurrencyBRL, formatSizeBR } from '../../../utils/formatters';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';

export default function ReservationCard({
  reservation,
  userId,
  onCancel,
  cancelLoading,
  onComplete,
  completeLoading
}: {
  reservation: any;
  userId: string;
  onCancel: (reservation: any) => void;
  cancelLoading?: boolean;
  onComplete?: (reservation: any) => void;
  completeLoading?: boolean;
}) {
  const isSeller = reservation.sellerId === userId;
  const isActive = reservation.status === RESERVATION_STATUS.ACTIVE;

  const date = reservation?.createdAt?.seconds
    ? new Date(reservation.createdAt.seconds * 1000).toLocaleDateString('pt-BR')
    : '-';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.productBlock}>
          <View style={styles.imageContainer}>
            {reservation?.productImageUrl ? (
              <Image source={{ uri: reservation.productImageUrl }} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={styles.placeholder}>
                <Ionicons name="image-outline" size={20} color={colors.textCaption} />
              </View>
            )}
          </View>
          <View style={styles.info}>
            <Text style={styles.brand}>{reservation?.productBrand?.toUpperCase() || 'SNEAKER'}</Text>
            <Text numberOfLines={1} style={styles.title}>{reservation?.productModel || 'Item'}</Text>
            <Text style={styles.price}>{formatCurrencyBRL(reservation?.productPrice)}</Text>
            <Text style={styles.metaProduct}>
              {formatSizeBR(reservation?.productSize)}{reservation?.productColor ? ` • ${reservation.productColor}` : ''}
            </Text>
          </View>
        </View>
        <Badge label={reservation.status} />
      </View>

      <View style={styles.meta}>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.textCaption} />
          <Text style={styles.metaText}>Iniciada em {date}</Text>
        </View>
        <Text style={styles.roleLabel}>
          {isSeller ? 'VOCÊ É O VENDEDOR' : 'VOCÊ É O COMPRADOR'}
        </Text>
      </View>

      {isActive && (
        <View style={styles.actions}>
          {onComplete ? (
            <>
              <Button
                title={isSeller ? 'Confirmar venda' : 'Finalizar compra'}
                variant="primary"
                onPress={() => onComplete?.(reservation)}
                loading={!!completeLoading}
                disabled={!!completeLoading || !!cancelLoading}
                style={styles.actionBtn}
              />
              <Button
                title="Liberar"
                variant="secondary"
                onPress={() => onCancel(reservation)}
                loading={!!cancelLoading}
                disabled={!!completeLoading || !!cancelLoading}
                style={styles.actionBtn}
              />
            </>
          ) : (
            <Button
              title="CANCELAR RESERVA"
              variant="secondary"
              onPress={() => onCancel(reservation)}
              loading={!!cancelLoading}
              disabled={!!completeLoading || !!cancelLoading}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productBlock: {
    flexDirection: 'row',
    flex: 1,
    marginRight: spacing.sm,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  brand: {
    fontSize: 10,
    color: colors.textCaption,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.white,
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary,
    marginTop: 4,
  },
  metaProduct: {
    fontSize: 11,
    color: colors.textCaption,
    fontWeight: '700',
    marginTop: 3
  },
  meta: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  roleLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.textCaption,
    letterSpacing: 0.5,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionBtn: {
    flex: 1,
    minHeight: 44,
  }
});
