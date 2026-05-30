import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { typography } from '../../theme/typography';
import { formatCurrencyBRL, formatSizeBR } from '../../utils/formatters';

export default function ProductDetailsScreen({ navigation, route }: any) {
  const productId = route.params?.productId;
  const source = route.params?.source;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
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

  if (loading && !selectedProduct) return <Loading text="CARREGANDO DETALHES..." />;
  if (!selectedProduct) return <EmptyState title="PRODUTO NÃO ENCONTRADO" />;

  const productImages = Array.isArray(selectedProduct.imagens) && selectedProduct.imagens.length > 0
    ? selectedProduct.imagens
    : (selectedProduct.imagemUrl ? [selectedProduct.imagemUrl] : []);
  const selectedImage = productImages[selectedImageIndex] || '';

  const isOwner = selectedProduct.ownerId === user?.uid;
  const canReserve = !isOwner && selectedProduct.status === PRODUCT_STATUS.AVAILABLE;
  const isProfileComplete = !!(user?.documento && user?.endereco && user?.whatsapp);

  async function handleReserve() {
    if (!isProfileComplete) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Perfil Incompleto', 'Complete seus dados no perfil para realizar uma reserva.', [
        { text: 'Ir para Perfil', onPress: () => navigation.navigate(ROUTES.PROFILE) },
        { text: 'Agora não', style: 'cancel' }
      ]);
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      navigation.navigate(ROUTES.CHECKOUT, { productId: selectedProduct.id });
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Erro na Reserva', err?.message || 'Não foi possível completar a reserva.');
    }
  }

  return (
    <View style={styles.flex}>
      <ScreenContainer scroll withPadding={false} backgroundColor={colors.background}>
        <View style={styles.headerPadding}>
          <Header title="Detalhes" showBack />
        </View>

        <View style={[styles.hero, { height: width * 0.9 }]}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.heroImage} resizeMode="contain" />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="image-outline" size={64} color={colors.border} />
            </View>
          )}
          <View style={styles.heroBadge}>
            <Badge label={selectedProduct.status} />
          </View>
        </View>

        {productImages.length > 1 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.gallery}
          >
            {productImages.map((uri: string, index: number) => (
              <Pressable
                key={`${uri}-${index}`}
                style={[styles.thumb, selectedImageIndex === index && styles.thumbActive]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedImageIndex(index);
                }}
              >
                <Image source={{ uri }} style={styles.thumbImage} />
              </Pressable>
            ))}
          </ScrollView>
        )}

        <View style={styles.content}>
          <View style={styles.mainInfo}>
            <View style={styles.brandRow}>
              <Text style={styles.brand}>{selectedProduct.marca?.toUpperCase()}</Text>
              <Text style={styles.origem}>{selectedProduct.origem?.toUpperCase()}</Text>
            </View>
            <Text style={styles.model}>{selectedProduct.modelo}</Text>
            <Text style={styles.price}>{formatCurrencyBRL(selectedProduct.preco)}</Text>
          </View>

          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>TAMANHO</Text>
              <Text style={styles.gridValue}>{formatSizeBR(selectedProduct.numeracao)}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>COR</Text>
              <Text style={styles.gridValue}>{selectedProduct.cor || '-'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>RESERVA</Text>
              <Text style={styles.gridValue}>{selectedProduct.tempoReserva || 24}H</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>CONDIÇÃO</Text>
              <Badge label={selectedProduct.condicao || 'novo'} />
            </View>
          </View>

          <View style={styles.divider} />

          {!isOwner && seller && (
            <View style={styles.sellerSection}>
              <Text style={styles.sectionTitle}>VENDEDOR</Text>
              <View style={styles.sellerCard}>
                <View style={styles.sellerAvatar}>
                  <Text style={styles.avatarText}>{seller.nome?.charAt(0)}</Text>
                </View>
                <View style={styles.sellerInfo}>
                  <Text style={styles.sellerName}>{seller.nome?.toUpperCase()}</Text>
                  <Text style={styles.sellerLocation}>
                    <Ionicons name="location-outline" size={12} color={colors.textSecondary} /> {seller.cidade || 'Brasil'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {selectedProduct.descricao && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>SOBRE O PRODUTO</Text>
              <Text style={styles.description}>{selectedProduct.descricao}</Text>
            </View>
          )}
          
          <View style={styles.spacer} />
        </View>
      </ScreenContainer>

      <View style={[styles.fixedFooter, { paddingBottom: insets.bottom + spacing.md }]}>
        {canReserve && user ? (
          <Button title="RESERVAR SNEAKER" onPress={handleReserve} loading={reserving} />
        ) : isOwner ? (
          <Button
            title="EDITAR ANÚNCIO"
            variant="secondary"
            onPress={() => navigation.navigate(ROUTES.PRODUCT_FORM, { mode: 'edit', productId: selectedProduct.id })}
          />
        ) : (
          <Button
            title={!user ? "LOGAR PARA RESERVAR" : selectedProduct.status === PRODUCT_STATUS.AVAILABLE ? "RESERVAR" : "INDISPONÍVEL"}
            variant="secondary"
            disabled={selectedProduct.status !== PRODUCT_STATUS.AVAILABLE}
            onPress={() => {
              if (!user) {
                navigation.navigate(ROUTES.LOGIN);
              }
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerPadding: {
    paddingHorizontal: spacing.md,
  },
  hero: {
    width: '100%',
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  heroImage: {
    width: '85%',
    height: '85%',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  gallery: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.transparent,
    overflow: 'hidden',
  },
  thumbActive: {
    borderColor: colors.primary,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  mainInfo: {
    marginBottom: spacing.xl,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '900',
    color: colors.textSecondary,
    letterSpacing: 1.5,
  },
  origem: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '800',
    color: colors.accent,
  },
  model: {
    ...typography.h1,
    fontSize: 34,
    fontWeight: '900',
    marginTop: 4,
    lineHeight: 38,
    color: colors.white
  },
  price: {
    ...typography.price,
    fontSize: 30,
    marginTop: spacing.sm,
    color: colors.primary,
    fontWeight: '900'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  gridItem: {
    width: '48%',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  gridLabel: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '900',
    color: colors.textCaption,
    marginBottom: 4,
    letterSpacing: 1
  },
  gridValue: {
    ...typography.body,
    fontWeight: '900',
    color: colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '900',
    color: colors.textSecondary,
    marginBottom: spacing.md,
    letterSpacing: 1.5,
  },
  sellerSection: {
    marginBottom: spacing.xl,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.black,
    fontSize: 20,
    fontWeight: '900',
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    ...typography.body,
    fontWeight: '900',
    color: colors.white,
  },
  sellerLocation: {
    ...typography.caption,
    marginTop: 2,
    fontSize: 11
  },
  descriptionSection: {
    marginBottom: spacing.xxl,
  },
  description: {
    ...typography.body,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  spacer: {
    height: 120,
  },
  fixedFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface, // #1E1E1E
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  }
});
