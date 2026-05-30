import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { shadows } from '../../../theme/shadows';
import { spacing } from '../../../theme/spacing';
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

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageBox}>
        {mainImage ? (
          <Image source={{ uri: mainImage }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={32} color={colors.textMuted} />
          </View>
        )}
        <View style={styles.topBadge}>
          <Badge label={product.status} />
        </View>
        <View style={styles.sizeTag}>
          <Text style={styles.sizeText}>{product.numeracao}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.brand}>{product.marca}</Text>
        <Text style={styles.title} numberOfLines={2}>{product.modelo}</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>R$ {product.preco}</Text>
          <View style={styles.goBtn}>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </View>
        </View>

        <View style={styles.footer}>
          <Ionicons name="location-outline" size={12} color={colors.textMuted} />
          <Text style={styles.location}>{product.localizacao}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
    overflow: 'hidden',
  },
  imageBox: {
    height: 180,
    backgroundColor: '#F9FAFB',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  sizeTag: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sizeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '900',
  },
  info: {
    padding: spacing.md,
  },
  brand: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
    height: 44,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  price: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
  },
  goBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  location: {
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 4,
    fontWeight: '600',
  }
});
