import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Header from '../../components/layout/Header';
import ScreenContainer from '../../components/layout/ScreenContainer';
import ReservationCard from '../../components/domain/ReservationCard';
import EmptyState from '../../components/ui/EmptyState';
import Loading from '../../components/ui/Loading';
import { PAYMENT_METHODS, getPaymentMethodLabel } from '../../constants/paymentMethods';
import { useAuth } from '../../hooks/useAuth';
import { useReservations } from '../../hooks/useReservations';
import { useTransactions } from '../../hooks/useTransactions';
import { RESERVATION_STATUS } from '../../constants/reservationStatus';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export default function MyReservationsScreen() {
  const { user } = useAuth();
  const { reservations, loadMyReservations, cancelReservation, loading, error } = useReservations();
  const { completeTransaction, loading: completing, error: transactionError } = useTransactions();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pendingReservation, setPendingReservation] = useState<any>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const refresh = useCallback(() => {
    if (!user?.uid) return;
    loadMyReservations(user.uid);
  }, [user?.uid, loadMyReservations]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeReservations = useMemo(
    () => reservations.filter(r => r.status === RESERVATION_STATUS.ACTIVE),
    [reservations]
  );

  async function handleCancel(reservation: any) {
    if (!user?.uid) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Cancelar reserva', 'Deseja realmente cancelar esta reserva?', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar agora',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelReservation({
              reservationId: reservation.id,
              userId: user.uid,
              cancelReason: 'Cancelada pelo usuario'
            });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            refresh();
          } catch (_) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
        }
      }
    ]);
  }

  const paymentOptions = useMemo(
    () => [
      PAYMENT_METHODS.PIX,
      PAYMENT_METHODS.TRANSFERENCIA,
      PAYMENT_METHODS.DINHEIRO,
      PAYMENT_METHODS.CARTAO,
      PAYMENT_METHODS.OUTRO
    ],
    []
  );

  function handleComplete(reservation: any) {
    if (!user?.uid) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPendingReservation(reservation);
    setPickerVisible(true);
  }

  function confirmComplete(paymentMethod: string) {
    if (!user?.uid) return;
    if (!pendingReservation?.id) return;
    setPickerVisible(false);

    Alert.alert(
      'Finalizar negocio',
      `Confirmar venda e marcar produto como vendido?\nMetodo: ${getPaymentMethodLabel(paymentMethod)}`,
      [
        { text: 'Voltar', style: 'cancel' },
        {
          text: 'Confirmar venda',
          onPress: async () => {
            try {
              await completeTransaction({
                reservationId: pendingReservation.id,
                userId: user.uid,
                paymentMethod
              });
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setPendingReservation(null);
              refresh();
            } catch (_) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
          }
        }
      ]
    );
  }

  return (
    <ScreenContainer scroll={false} backgroundColor={colors.background}>
      <Header title="Reservas" subtitle="Controle suas negociacoes em andamento." showBack />

      {(error || transactionError) ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
          <Text style={styles.errorText}>{error || transactionError}</Text>
        </View>
      ) : null}

      {loading && activeReservations.length === 0 ? (
        <Loading text="ATUALIZANDO..." />
      ) : (
        <FlatList
          data={activeReservations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ReservationCard
              reservation={item}
              userId={user?.uid}
              nowMs={nowMs}
              onCancel={handleCancel}
              cancelLoading={loading}
              onComplete={handleComplete}
              completeLoading={completing}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title="Sem reservas ativas"
              description="Quando você ou um comprador iniciar uma negociação, ela aparecerá aqui."
              icon="bookmark-outline"
            />
          }
        />
      )}

      <Modal visible={pickerVisible} transparent animationType="fade" onRequestClose={() => setPickerVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Metodo de pagamento</Text>
            <Text style={styles.modalSubtitle}>Selecione o metodo usado nesta negociacao</Text>
            {paymentOptions.map((method) => (
              <Pressable key={method} style={styles.methodBtn} onPress={() => confirmComplete(method)}>
                <Text style={styles.methodText}>{getPaymentMethodLabel(method)}</Text>
              </Pressable>
            ))}
            <Pressable
              style={[styles.methodBtn, styles.cancelMethodBtn]}
              onPress={() => {
                setPickerVisible(false);
                setPendingReservation(null);
              }}
            >
              <Text style={styles.cancelMethodText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.danger
  },
  errorText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 13
  },
  listContent: {
    paddingBottom: spacing.xxl
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: spacing.lg
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.white
  },
  modalSubtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    color: colors.textSecondary
  },
  methodBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm
  },
  methodText: {
    color: colors.white,
    fontWeight: '700'
  },
  cancelMethodBtn: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(239,68,68,0.12)'
  },
  cancelMethodText: {
    color: colors.danger,
    fontWeight: '800'
  }
});
