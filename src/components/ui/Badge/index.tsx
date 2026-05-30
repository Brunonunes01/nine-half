import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

const statusStyles: Record<string, { bg: string; text: string }> = {
  disponivel: { bg: '#DCFCE7', text: '#166534' }, // Success Light
  reservado: { bg: '#FEF3C7', text: '#92400E' }, // Warning Light
  vendido: { bg: '#F3F4F6', text: '#374151' }, // Muted
  ativa: { bg: '#DBEAFE', text: '#1E40AF' }, // Blue
  cancelada: { bg: '#FEE2E2', text: '#991B1B' }, // Danger
  concluida: { bg: '#DCFCE7', text: '#166534' },
  expirada: { bg: '#F3F4F6', text: '#374151' },
  pendente: { bg: '#FEF3C7', text: '#92400E' },
  publica: { bg: '#E0E7FF', text: '#3730A3' }, // Indigo
  privada: { bg: '#F3F4F6', text: '#374151' }
};

export default function Badge({ label }: { label: string }) {
  const normalizedLabel = String(label || '').toLowerCase();
  const style = statusStyles[normalizedLabel] || {
    bg: '#F3F4F6',
    text: '#374151'
  };

  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.text, { color: style.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.xs,
    alignSelf: 'flex-start'
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  }
});
