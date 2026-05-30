import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';

const statusStyles: Record<string, { bg: string; text: string }> = {
  disponivel: { bg: 'rgba(16, 185, 129, 0.15)', text: colors.success },
  reservado: { bg: 'rgba(245, 158, 11, 0.15)', text: colors.warning },
  vendido: { bg: colors.border, text: colors.textSecondary },
  ativa: { bg: 'rgba(16, 185, 129, 0.15)', text: colors.success },
  cancelada: { bg: 'rgba(239, 68, 68, 0.15)', text: colors.danger },
  concluida: { bg: 'rgba(16, 185, 129, 0.15)', text: colors.success },
  expirada: { bg: colors.border, text: colors.textSecondary },
  pendente: { bg: 'rgba(245, 158, 11, 0.15)', text: colors.warning },
  publica: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6' },
  privada: { bg: colors.border, text: colors.textSecondary },
  novo: { bg: 'rgba(249, 115, 22, 0.2)', text: colors.accent },
  usado: { bg: colors.border, text: colors.textSecondary }
};

type BadgeProps = {
  label: string;
  style?: ViewStyle;
};

export default function Badge({ label, style }: BadgeProps) {
  const normalizedLabel = String(label || '').toLowerCase();
  const badgeStyle = statusStyles[normalizedLabel] || {
    bg: colors.border,
    text: colors.textSecondary
  };

  return (
    <View style={[styles.badge, { backgroundColor: badgeStyle.bg }, style]}>
      <Text style={[styles.text, { color: badgeStyle.text }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)'
  },
  text: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2
  }
});
