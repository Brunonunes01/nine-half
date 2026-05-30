import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/layout/ScreenContainer';
import Header from '../../components/layout/Header';
import Loading from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { useTransactions } from '../../hooks/useTransactions';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { typography } from '../../theme/typography';

export default function TransactionDetailsScreen({ navigation, route }: any) {
  const transactionId = route.params?.transactionId;
  const { selectedTransaction, loadTransactionById, loading, error } = useTransactions();

  useEffect(() => {
    if (!transactionId) return;
    loadTransactionById(transactionId);
  }, [transactionId]);

  if (loading && !selectedTransaction) return <Loading text="Carregando Comprovante..." />;
  
  if (!selectedTransaction) {
    return (
      <ScreenContainer>
        <Header title="Comprovante" showBack />
        <EmptyState 
          title="Transação não encontrada" 
          description={error || 'Não foi possível recuperar o registro desta transação.'} 
        />
      </ScreenContainer>
    );
  }

  const date = selectedTransaction?.completedAt?.seconds
    ? new Date(selectedTransaction.completedAt.seconds * 1000).toLocaleString('pt-BR')
    : '-';

  return (
    <ScreenContainer scroll>
      <Header title="Comprovante de Venda" subtitle="Prova de negociação bem-sucedida." showBack />

      <View style={styles.receiptCard}>
        <View style={styles.receiptHeader}>
          <View style={styles.logoCircle}>
            <Ionicons name="receipt" size={32} color={colors.white} />
          </View>
          <Text style={styles.receiptTitle}>Transação Concluída</Text>
          <Text style={styles.receiptSubtitle}>{date}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.productInfo}>
          {selectedTransaction.productImageUrl ? (
            <Image 
              source={{ uri: selectedTransaction.productImageUrl }} 
              style={styles.productImage} 
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="image-outline" size={32} color={colors.textMuted} />
            </View>
          )}
          <View style={styles.productDetails}>
            <Text style={styles.brand}>{selectedTransaction.productBrand || 'Sneaker'}</Text>
            <Text style={styles.model}>{selectedTransaction.productModel || 'Item sem nome'}</Text>
            <Badge label={selectedTransaction.status} />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsList}>
          <DetailRow label="ID da Transação" value={`#${selectedTransaction.id.slice(-8).toUpperCase()}`} />
          <DetailRow label="ID do Comprador" value={`...${selectedTransaction.buyerId.slice(-6)}`} />
          <DetailRow label="ID do Vendedor" value={`...${selectedTransaction.sellerId.slice(-6)}`} />
          <DetailRow label="Vitrine" value={selectedTransaction.showcaseId} />
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Valor Total</Text>
          <Text style={styles.totalValue}>R$ {selectedTransaction.valor}</Text>
        </View>

        <View style={styles.decorativeDashes} />
        
        <Text style={styles.footerNote}>
          Este é um registro oficial do ecossistema Nine Half.
        </Text>
      </View>
    </ScreenContainer>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  receiptCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.floating,
    marginBottom: spacing.xxl,
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  receiptTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  receiptSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    borderStyle: 'dashed',
    marginVertical: spacing.lg,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },
  placeholderImage: {
    width: 70,
    height: 70,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  productDetails: {
    flex: 1,
    paddingLeft: spacing.md,
  },
  brand: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
  },
  model: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginVertical: 2,
  },
  detailsList: {
    gap: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.lg,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
  },
  decorativeDashes: {
    height: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginVertical: spacing.xl,
  },
  footerNote: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  }
});
