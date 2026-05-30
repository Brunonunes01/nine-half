import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/layout/Header';
import ScreenContainer from '../../components/layout/ScreenContainer';
import TransactionCard from '../../components/domain/TransactionCard';
import EmptyState from '../../components/ui/EmptyState';
import Loading from '../../components/ui/Loading';
import { ROUTES } from '../../app/routes/routeNames';
import { useAuth } from '../../hooks/useAuth';
import { useTransactions } from '../../hooks/useTransactions';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

export default function MyTransactionsScreen({ navigation }: any) {
  const { user } = useAuth();
  const { transactions, loadMyTransactions, loading, error } = useTransactions();

  useFocusEffect(
    useCallback(() => {
      if (!user?.uid) return;
      loadMyTransactions(user.uid);
    }, [user?.uid, loadMyTransactions])
  );

  if (loading && transactions.length === 0) {
    return <Loading text="Carregando transacoes..." />;
  }

  return (
    <ScreenContainer>
      <Header title="Minhas transacoes" subtitle="Historico de compras e vendas concluidas." showBack />

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={item}
            onPress={() => navigation.navigate(ROUTES.TRANSACTION_DETAILS, { transactionId: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Sem transacoes ainda"
            description="Finalize reservas para gerar seu historico de transacoes."
            icon="receipt-outline"
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
