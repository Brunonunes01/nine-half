import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.left}>
          {showBack || onBack ? (
            <Pressable onPress={handleBack} style={styles.backButton} hitSlop={15}>
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </Pressable>
          ) : null}
        </View>
        <View style={styles.right}>
          {rightAction}
        </View>
      </View>
      
      <View style={styles.titleArea}>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
  },
  left: {
    width: 48,
    height: 48,
    justifyContent: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  titleArea: {
    marginTop: spacing.xs,
  },
  title: {
    ...typography.h1,
    fontSize: 28,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.5,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
    fontWeight: '500',
  }
});
