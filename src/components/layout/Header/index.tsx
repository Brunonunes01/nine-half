import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { radius } from '../../../theme/radius';

export default function Header({
  title,
  subtitle,
  onBack,
  rightAction,
  showBack = false
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  showBack?: boolean;
}) {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        {showBack || onBack ? (
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </Pressable>
        ) : null}
        <View style={styles.rightActionContainer}>
          {rightAction}
        </View>
      </View>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    marginBottom: spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  rightActionContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  titleContainer: {
    marginTop: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    lineHeight: 30,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  }
});
