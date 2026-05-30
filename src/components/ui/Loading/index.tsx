import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

export default function Loading({ 
  text = 'Carregando...',
  size = 'large' 
}: { 
  text?: string;
  size?: 'small' | 'large';
}) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.secondary} />
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background
  },
  text: {
    ...typography.body,
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontWeight: '600'
  }
});
