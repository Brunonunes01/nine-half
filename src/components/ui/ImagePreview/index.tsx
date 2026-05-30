import React from 'react';
import { Image, StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';
import { shadows } from '../../../theme/shadows';

export default function ImagePreview({
  uri,
  onRemove
}: {
  uri?: string;
  onRemove?: () => void;
}) {
  if (!uri) {
    return (
      <View style={styles.placeholder}>
        <Ionicons name="image-outline" size={40} color={colors.textMuted} />
        <Text style={styles.placeholderText}>Nenhuma imagem selecionada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      {onRemove && (
        <Pressable style={styles.removeButton} onPress={onRemove}>
          <Ionicons name="close-circle" size={32} color={colors.danger} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: spacing.md,
    ...shadows.soft,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: colors.white,
    borderRadius: 16,
    ...shadows.card,
  },
  placeholder: {
    width: '100%',
    height: 120,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.background,
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontSize: 14,
    fontWeight: '500',
  }
});
