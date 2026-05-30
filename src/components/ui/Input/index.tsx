import React, { useState } from 'react';
import { KeyboardTypeOptions, Pressable, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

type InputProps = {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  style?: ViewStyle;
  icon?: keyof typeof Ionicons.glyphMap;
};

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
  error = '',
  style,
  icon
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = secureTextEntry;

  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, focused && styles.fieldFocused, !!error && styles.fieldError]}>
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={focused ? colors.primary : colors.textMuted}
            style={styles.leading}
          />
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          style={styles.input}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {isPassword ? (
          <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.trailing}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xxs
  },
  field: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md
  },
  fieldFocused: {
    borderColor: colors.secondary
  },
  fieldError: {
    borderColor: colors.danger
  },
  leading: {
    marginRight: spacing.xs
  },
  trailing: {
    marginLeft: spacing.xs
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
    paddingVertical: spacing.sm
  },
  error: {
    marginTop: spacing.xxs,
    color: colors.danger,
    fontSize: 12,
    fontWeight: '600'
  }
});
