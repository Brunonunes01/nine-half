import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { shadows } from '../../../theme/shadows';
import { spacing } from '../../../theme/spacing';

type Variant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'action';

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  fullWidth?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
};

export default function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  fullWidth = true,
  style,
  icon
}: ButtonProps) {
  const isBlocked = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isBlocked}
      style={({ pressed }) => [
        styles.button,
        fullWidth && styles.fullWidth,
        variantStyles[variant],
        isBlocked && styles.disabled,
        pressed && !isBlocked && styles.pressed,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white} />
      ) : (
        <View style={styles.content}>
          {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
          <Text style={[styles.text, textStyles[variant]]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderWidth: 1,
    ...shadows.card
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
    borderWidth: 1,
    ...shadows.card
  },
  danger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
    borderWidth: 1
  },
  outline: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 1
  },
  action: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    borderWidth: 1,
    ...shadows.soft
  }
});

const textStyles = StyleSheet.create({
  primary: { color: colors.white },
  secondary: { color: colors.white },
  danger: { color: colors.white },
  outline: { color: colors.primary },
  ghost: { color: colors.secondary },
  action: { color: colors.white }
});

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg
  },
  fullWidth: {
    width: '100%'
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconWrap: {
    marginRight: spacing.xs
  },
  text: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2
  },
  disabled: {
    opacity: 0.55
  },
  pressed: {
    transform: [{ scale: 0.985 }]
  }
});
