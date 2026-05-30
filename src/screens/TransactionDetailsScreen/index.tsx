import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/layout/ScreenContainer';
import Header from '../../components/layout/Header';
import Loading from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { getPaymentMethodLabel } from '../../constants/paymentMethods';
import { useTransactions } from '../../hooks/useTransactions';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { shadows } from '../../theme/shadows';
import { formatCurrencyBRL, formatSizeBR } from '../../utils/formatters';

export default function TransactionDetailsScreen({ route }: any) {
  const transactionId = route.params?.transactionId;
  const { selectedTransaction, loadTransactionById, loading, error } = useTransactions();

  useEffect(() => {
    if (!transactionId) return;
    loadTransactionById(transactionId);
  }, [transactionId, loadTransactionById]);

  if (loading && !selectedTransaction) return <Loading text="GERANDO COMPROVANTE..." />;

  if (!selectedTransaction) {
    return (
      <ScreenContainer backgroundColor={colors.background}>
        <Header title="Comprovante" showBack />
        <EmptyState title="Nao encontrado" description={error || 'Nao foi possivel recuperar esta transacao.'} />
      </ScreenContainer>
    );
  }

  const date = selectedTransaction?.completedAt?.seconds
    ? new Date(selectedTransaction.completedAt.seconds * 1000).toLocaleString('pt-BR')
    : '-';

  return (
    <ScreenContainer scroll backgroundColor={colors.background}>
      <Header title="Comprovante" showBack subtitle="Prova digital da negociacao concluida." />

      <View style={styles.receipt}>
        <View style={styles.receiptHeader}>
          <View style={styles.iconBox}>
            <Ionicons name="checkmark-seal" size={44} color={colors.black} />
          </View>
          <Text style={styles.statusTitle}>VENDA CONCLUIDA</Text>
          <Text style={styles.receiptDate}>{date}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ITEM TRANSACIONADO</Text>
          <View style={styles.productCard}>
            {selectedTransaction.productImageUrl ? (
              <Image source={{ uri: selectedTransaction.productImageUrl }} style={styles.productImage} resizeMode="cover" />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="image-outline" size={24} color={colors.textCaption} />
              </View>
            )}
            <View style={styles.productInfo}>
              <Text style={styles.brand}>{selectedTransaction.productBrand?.toUpperCase() || 'SNEAKER'}</Text>
              <Text style={styles.model}>{selectedTransaction.productModel || 'Item sem nome'}</Text>
              <Badge label="vendido" />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETALHES DA OPERACAO</Text>
          <View style={styles.detailsList}>
            <DetailRow label="ID TRANSACAO" value={`#${selectedTransaction.id.toUpperCase()}`} />
            <DetailRow label="COMPRADOR" value={`ID: ${selectedTransaction.buyerId.slice(0, 12)}...`} />
            <DetailRow label="VENDEDOR" value={`ID: ${selectedTransaction.sellerId.slice(0, 12)}...`} />
            <DetailRow label="TAMANHO" value={formatSizeBR(selectedTransaction.productSize)} />
            <DetailRow label="COR" value={selectedTransaction.productColor || '-'} />
            <DetailRow label="LOCAL" value={selectedTransaction.productLocation || '-'} />
            <DetailRow label="PAGAMENTO" value={getPaymentMethodLabel(selectedTransaction.paymentMethod)} />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>VALOR FINAL</Text>
          <Text style={styles.totalValue}>{formatCurrencyBRL(selectedTransaction.valor)}</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  receipt: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.medium
  },
  statusTitle: {
    ...typography.h2,
    fontWeight: '900',
    letterSpacing: -0.5,
    color: colors.white
  },
  receiptDate: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xl
  },
  section: {
    marginBottom: spacing.xl
  },
  sectionTitle: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '900',
    color: colors.textCaption,
    marginBottom: spacing.md,
    letterSpacing: 1.5
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  productInfo: {
    flex: 1,
    marginLeft: spacing.md,
    gap: 4
  },
  brand: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '900',
    color: colors.textSecondary
  },
  model: {
    ...typography.body,
    fontWeight: '900',
    color: colors.white
  },
  detailsList: {
    gap: spacing.sm
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  detailLabel: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary
  },
  detailValue: {
    ...typography.body,
    fontSize: 12,
    fontWeight: '700',
    color: colors.white
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  totalLabel: {
    ...typography.body,
    fontWeight: '900',
    color: colors.textSecondary
  },
  totalValue: {
    ...typography.h2,
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary
  }
});
