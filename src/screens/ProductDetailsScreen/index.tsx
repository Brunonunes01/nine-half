import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Header from '../../components/layout/Header';
import Loading from '../../components/ui/Loading';
import ScreenContainer from '../../components/layout/ScreenContainer';
import { ROUTES } from '../../app/routes/routeNames';
import { PRODUCT_STATUS } from '../../constants/productStatus';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import { useReservations } from '../../hooks/useReservations';
import { getUserById } from '../../services/userService';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';

export default function ProductDetailsScreen({ navigation, route }: any) {
  const productId = route.params?.productId;
  const source = route.params?.source;
  const { user } = useAuth();
  const { selectedProduct, loadProductById, loading } = useProducts();
  const { reserveProduct, loading: reserving } = useReservations();

  const [seller, setSeller] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!productId) return;
    loadProductById(productId);
  }, [productId]);

  useEffect(() => {
    if (!selectedProduct?.ownerId) return;
    getUserById(selectedProduct.ownerId).then(setSeller).catch(() => setSeller(null));
  }, [selectedProduct?.ownerId]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedProduct?.id]);

  if (loading && !selectedProduct) return <Loading text="Carregando produto..." />;
  if (!selectedProduct) return <EmptyState title="Produto nao encontrado" />;

  const productImages = Array.isArray(selectedProduct.imagens) && selectedProduct.imagens.length > 0
    ? selectedProduct.imagens
    : (selectedProduct.imagemUrl ? [selectedProduct.imagemUrl] : []);
  const selectedImage = productImages[selectedImageIndex] || '';

  const isOwner = selectedProduct.ownerId === user?.uid;
  const canReserve = source === 'global' && !isOwner && selectedProduct.status === PRODUCT_STATUS.AVAILABLE;
  const isProfileComplete = !!(user?.documento && user?.endereco && user?.whatsapp);

  async function handleReserve() {
    if (!isProfileComplete) {
      Alert.alert('Perfil incompleto', 'Complete CPF e endereco no perfil para reservar.', [
        { text: 'Ir para perfil', onPress: () => navigation.navigate(ROUTES.PROFILE) },
        { text: 'Agora nao', style: 'cancel' }
      ]);
      return;
    }

    try {
      await reserveProduct({ productId: selectedProduct.id, buyerId: user.uid });
      Alert.alert('Reserva criada', 'A reserva foi criada com sucesso.');
    } catch (_) {}
  }

  return (
    <ScreenContainer scroll>
      <Header title="Detalhes do produto" showBack />

      <View style={styles.imageArea}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={44} color={colors.textMuted} />
            <Text style={styles.placeholderText}>Sem imagem</Text>
          </View>
        )}
        <View style={styles.badgeWrap}>
          <Badge label={selectedProduct.status} />
        </View>
      </View>

      {productImages.length > 1 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gallery}>
          {productImages.map((uri: string, index: number) => (
            <Pressable
              key={`${uri}-${index}`}
              style={[styles.thumbWrap, selectedImageIndex === index && styles.thumbWrapActive]}
              onPress={() => setSelectedImageIndex(index)}
            >
              <Image source={{ uri }} style={styles.thumb} />
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      <View style={styles.infoCard}>
        <Text style={styles.brand}>{selectedProduct.marca}</Text>
        <Text style={styles.model}>{selectedProduct.modelo}</Text>
        <Text style={styles.price}>R$ {selectedProduct.preco}</Text>

        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Numeracao</Text>
            <Text style={styles.metaValue}>{selectedProduct.numeracao || '-'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Origem</Text>
            <Text style={styles.metaValue}>{selectedProduct.origem || '-'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Reserva</Text>
            <Text style={styles.metaValue}>{selectedProduct.tempoReserva || 24}h</Text>
          </View>
        </View>

        {!isOwner ? (
          <View style={styles.sellerBox}>
            <Text style={styles.sellerTitle}>Vendedor</Text>
            <Text style={styles.sellerName}>{seller?.nome || 'Lojista'}</Text>
            <Text style={styles.sellerMeta}>{seller?.cidade || 'Sem cidade definida'}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.actions}>
        {canReserve ? (
          <Button title="Reservar produto" variant="secondary" onPress={handleReserve} loading={reserving} />
        ) : isOwner ? (
          <Button
            title="Editar produto"
            variant="outline"
            onPress={() => navigation.navigate(ROUTES.PRODUCT_FORM, { mode: 'edit', productId: selectedProduct.id })}
          />
        ) : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  imageArea: {
    height: 320,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: '#EEF2F7',
    ...shadows.card
  },
  image: {
    width: '100%',
    height: '100%'
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholderText: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontWeight: '700'
  },
  badgeWrap: {
    position: 'absolute',
    right: spacing.sm,
    top: spacing.sm
  },
  gallery: {
    gap: spacing.xs,
    paddingTop: spacing.sm
  },
  thumbWrap: {
    width: 68,
    height: 68,
    borderRadius: radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border
  },
  thumbWrapActive: {
    borderColor: colors.secondary,
    borderWidth: 2
  },
  thumb: {
    width: '100%',
    height: '100%'
  },
  infoCard: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.soft
  },
  brand: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  model: {
    marginTop: 2,
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '900'
  },
  price: {
    marginTop: spacing.xs,
    color: colors.primary,
    fontSize: 30,
    fontWeight: '900'
  },
  metaGrid: {
    marginTop: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm
  },
  metaItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  metaValue: {
    marginTop: 2,
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '800'
  },
  sellerBox: {
    marginTop: spacing.md,
    backgroundColor: colors.secondarySoft,
    borderRadius: radius.md,
    padding: spacing.md
  },
  sellerTitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  sellerName: {
    marginTop: 2,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800'
  },
  sellerMeta: {
    marginTop: 2,
    color: colors.textSecondary,
    fontSize: 13
  },
  actions: {
    marginTop: spacing.md,
    marginBottom: spacing.xl
  }
});
