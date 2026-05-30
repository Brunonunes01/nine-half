import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { shadows } from '../../../theme/shadows';
import { spacing } from '../../../theme/spacing';
import Badge from '../../ui/Badge';

export default function TransactionCard({
  transaction,
  onPress
}: {
  transaction: any;
  onPress?: (transaction: any) => void;
}) {
  const date = transaction?.completedAt?.seconds
    ? new Date(transaction.completedAt.seconds * 1000).toLocaleDateString('pt-BR')
    : '-';

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={() => onPress?.(transaction)}>
      <View style={styles.row}>
        {transaction?.productImageUrl ? (
          <Image source={{ uri: transaction.productImageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={24} color={colors.textMuted} />
          </View>
        )}
        <View style={styles.info}>
          <View style={styles.top}>
            <Text style={styles.brand}>{transaction?.productBrand || 'Sneaker'}</Text>
            <Badge label={transaction.status} />
          </View>
          <Text style={styles.title} numberOfLines={1}>{transaction?.productModel || 'Produto'}</Text>
          <Text style={styles.price}>R$ {transaction?.valor || '0,00'}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="checkmark-circle-outline" size={12} color={colors.success} />
            <Text style={styles.metaText}>{date}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    ...shadows.soft
  },
  pressed: {
    opacity: 0.92
  },
  row: {
    flexDirection: 'row',
    padding: spacing.md
  },
  image: {
    width: 82,
    height: 82,
    borderRadius: radius.md
  },
  placeholder: {
    width: 82,
    height: 82,
    borderRadius: radius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  info: {
    flex: 1,
    paddingLeft: spacing.md
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  }
});
