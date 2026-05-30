import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { shadows } from '../../../theme/shadows';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { formatCurrencyBRL, formatSizeBR } from '../../../utils/formatters';
import Badge from '../../ui/Badge';

export default function ProductCard({ 
  product, 
  onPress 
}: { 
  product: any; 
  onPress: () => void;
}) {
  const mainImage = (Array.isArray(product.imagens) && product.imagens.length > 0)
    ? product.imagens[0]
    : product.imagemUrl;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed
      ]} 
      onPress={handlePress}
    >
      <View style={styles.imageBox}>
        {mainImage ? (
          <Image source={{ uri: mainImage }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={40} color={colors.textCaption} />
          </View>
        )}
        <View style={styles.badgeContainer}>
          <Badge label={product.status} />
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.textBlock}>
          <Text style={styles.brand}>{product.marca?.toUpperCase()}</Text>
          <Text style={styles.title} numberOfLines={1}>{product.modelo}</Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.price}>{formatCurrencyBRL(product.preco)}</Text>
          {product.numeracao && (
            <Text style={styles.size}>{formatSizeBR(product.numeracao)}</Text>
          )}
        </View>
        {product.cor ? <Text style={styles.colorText}>Cor: {product.cor}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    width: '100%',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  imageBox: {
    height: 180,
    backgroundColor: colors.backgroundSecondary,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  info: {
    padding: spacing.md,
  },
  textBlock: {
    marginBottom: 8,
  },
  brand: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textCaption,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    ...typography.h3,
    fontSize: 16,
    color: colors.white,
    fontWeight: '800',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  price: {
    ...typography.price,
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary,
  },
  size: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '800',
  },
  colorText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textCaption,
    marginTop: 4
  }
});
