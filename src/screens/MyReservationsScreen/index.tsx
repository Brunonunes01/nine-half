import React, { useCallback } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/layout/Header';
import ScreenContainer from '../../components/layout/ScreenContainer';
import ReservationCard from '../../components/domain/ReservationCard';
import EmptyState from '../../components/ui/EmptyState';
import Loading from '../../components/ui/Loading';
import { useAuth } from '../../hooks/useAuth';
import { useReservations } from '../../hooks/useReservations';
import { useTransactions } from '../../hooks/useTransactions';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

export default function MyReservationsScreen() {
  const { user } = useAuth();
  const { reservations, loadMyReservations, cancelReservation, loading, error } = useReservations();
  const { completeTransaction, loading: completing, error: transactionError } = useTransactions();

  const refresh = useCallback(() => {
    if (!user?.uid) return;
    loadMyReservations(user.uid);
  }, [user?.uid, loadMyReservations]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  async function handleCancel(reservation: any) {
    if (!user?.uid) return;
    Alert.alert('Cancelar reserva', 'Deseja realmente cancelar esta reserva?', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar reserva',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelReservation({
              reservationId: reservation.id,
              userId: user.uid,
              cancelReason: 'Cancelada pelo usuario'
            });
            refresh();
          } catch (_) {}
        }
      }
    ]);
  }

  async function handleComplete(reservation: any) {
    if (!user?.uid) return;
    Alert.alert('Finalizar negociacao', 'Confirmar venda e marcar produto como vendido?', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Finalizar',
        onPress: async () => {
          try {
            await completeTransaction({ reservationId: reservation.id, userId: user.uid });
            refresh();
          } catch (_) {}
        }
      }
    ]);
  }

  if (loading && reservations.length === 0) {
    return <Loading text="Carregando reservas..." />;
  }

  return (
    <ScreenContainer>
      <Header title="Minhas reservas" subtitle="Acompanhe todas as negociacoes em andamento." showBack />

      {(error || transactionError) ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
          <Text style={styles.errorText}>{error || transactionError}</Text>
        </View>
      ) : null}

      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ReservationCard
            reservation={item}
            userId={user?.uid}
            onCancel={handleCancel}
            cancelLoading={loading}
            onComplete={handleComplete}
            completeLoading={completing}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Nenhuma reserva ativa"
            description="Quando voce reservar um produto, ele aparecera aqui."
            icon="bookmark-outline"
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#FEE2E2',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm
  },
  errorText: {
    color: colors.danger,
    fontWeight: '600'
  },
  listContent: {
    paddingBottom: spacing.xxl
  }
});
