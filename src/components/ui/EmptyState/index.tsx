import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../Button';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

export default function EmptyState({
  title = 'Sem resultados',
  description = '',
  actionLabel,
  onAction,
  icon = 'cube-outline'
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={34} color={colors.textMuted} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.desc}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button title={actionLabel} variant="secondary" onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center'
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.secondarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center'
  },
  desc: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs
  },
  action: {
    marginTop: spacing.lg,
    width: '100%'
  }
});
