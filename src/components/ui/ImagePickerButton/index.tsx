import React from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';
import Loading from '../Loading';

export default function ImagePickerButton({
  onPress,
  loading
}: {
  onPress: () => void;
  loading?: boolean;
}) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]} 
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <Loading size="small" text="Selecionando..." />
      ) : (
        <View style={styles.content}>
          <Ionicons name="camera-outline" size={24} color={colors.primary} />
          <Text style={styles.text}>Selecionar Imagem</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  pressed: {
    backgroundColor: colors.background,
    opacity: 0.7,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: spacing.sm,
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  }
});
