import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RESERVATION_STATUS } from '../../../constants/reservationStatus';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { shadows } from '../../../theme/shadows';
import { spacing } from '../../../theme/spacing';
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

  const expiresAt = reservation?.expiresAt?.seconds;
  const now = Math.floor(Date.now() / 1000);
  const remainingHours = expiresAt ? Math.max(0, Math.floor((expiresAt - now) / 3600)) : 0;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {reservation?.productImageUrl ? (
          <Image source={{ uri: reservation.productImageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={26} color={colors.textMuted} />
          </View>
        )}

        <View style={styles.info}>
          <View style={styles.top}>
            <Text style={styles.brand}>{reservation?.productBrand || 'Sneaker'}</Text>
            <Badge label={reservation.status} />
          </View>
          <Text numberOfLines={1} style={styles.title}>{reservation?.productModel || 'Produto'}</Text>
          <Text style={styles.price}>R$ {reservation?.productPrice || '0,00'}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
            <Text style={styles.metaText}>{date}</Text>
          </View>
          {isActive ? (
            <View style={styles.timerRow}>
              <Ionicons name="time-outline" size={12} color={remainingHours < 2 ? colors.danger : colors.secondary} />
              <Text style={[styles.timerText, remainingHours < 2 && { color: colors.danger }]}>
                Expira em aprox. {remainingHours}h
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {isActive ? (
        <View style={styles.actions}>
          <Text style={styles.role}>{isSeller ? 'Voce e o vendedor' : 'Voce e o comprador'}</Text>
          {isSeller ? (
            <View style={styles.rowActions}>
              <Button
                title="Finalizar venda"
                variant="secondary"
                onPress={() => onComplete?.(reservation)}
                loading={!!completeLoading}
                disabled={!!completeLoading || !!cancelLoading}
                style={styles.primaryAction}
              />
              <Button
                title="Liberar"
                variant="outline"
                onPress={() => onCancel(reservation)}
                loading={!!cancelLoading}
                disabled={!!completeLoading || !!cancelLoading}
                style={styles.secondaryAction}
              />
            </View>
          ) : (
            <Button
              title="Cancelar reserva"
              variant="outline"
              onPress={() => onCancel(reservation)}
              loading={!!cancelLoading}
              disabled={!!completeLoading || !!cancelLoading}
            />
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.soft
  },
  row: {
    flexDirection: 'row',
    padding: spacing.md
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: radius.md
  },
  placeholder: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  info: {
    flex: 1,
    paddingLeft: spacing.md
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  brand: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  title: {
    marginTop: 2,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800'
  },
  price: {
    marginTop: 4,
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900'
  },
  metaRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metaText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600'
  },
  timerRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  timerText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '700'
  },
  actions: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#F8FAFC',
    padding: spacing.md
  },
  role: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: spacing.sm
  },
  rowActions: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  primaryAction: {
    flex: 1.4
  },
  secondaryAction: {
    flex: 1
  }
});
