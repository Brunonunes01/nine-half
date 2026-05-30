import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Header from '../../components/layout/Header';
import ScreenContainer from '../../components/layout/ScreenContainer';
import ProductCard from '../../components/domain/ProductCard';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Input from '../../components/ui/Input';
import { ProductCardSkeleton } from '../../components/ui/Skeleton/ProductCardSkeleton';
import { ROUTES } from '../../app/routes/routeNames';
import { PRODUCT_STATUS } from '../../constants/productStatus';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import { useShowcase } from '../../hooks/useShowcase';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function ShowcaseScreen({ navigation }: any) {
  const { user } = useAuth();
  const showcaseApi = useShowcase();
  const productsApi = useProducts();
  const loadingRef = React.useRef(false);

  const [newShowcaseName, setNewShowcaseName] = React.useState('Minha Vitrine');
  const [editingName, setEditingName] = React.useState('');
  const [showSettings, setShowSettings] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [productTab, setProductTab] = React.useState<'active' | 'sold'>('active');

  const loadData = React.useCallback(async () => {
    if (!user?.uid) return;
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const found: any = await showcaseApi.loadShowcase(user.uid);
      if (found?.id) {
        setEditingName(found.nome || '');
        await productsApi.loadProductsByShowcase(found.id, user.uid);
      }
    } finally {
      loadingRef.current = false;
    }
  }, [user?.uid, showcaseApi.loadShowcase, productsApi.loadProductsByShowcase]);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [loadData])
  );

  const isProfileComplete = !!(user?.documento && user?.endereco && user?.whatsapp);

  const activeProducts = React.useMemo(
    () => productsApi.products.filter((p: any) => p.status !== PRODUCT_STATUS.SOLD),
    [productsApi.products]
  );
  const soldProducts = React.useMemo(
    () => productsApi.products.filter((p: any) => p.status === PRODUCT_STATUS.SOLD),
    [productsApi.products]
  );
  const tabProducts = productTab === 'sold' ? soldProducts : activeProducts;
  const filteredProducts = React.useMemo(
    () =>
      tabProducts.filter(
        (p: any) =>
          p.modelo?.toLowerCase().includes(search.toLowerCase()) ||
          p.marca?.toLowerCase().includes(search.toLowerCase())
      ),
    [tabProducts, search]
  );

  async function handleCreateShowcase() {
    if (!user?.uid) return;
    try {
      const created = await showcaseApi.createShowcase({
        userId: user.uid,
        nome: newShowcaseName.trim() || 'Minha Vitrine',
        visivel: false
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setEditingName(created.nome || '');
      await productsApi.loadProductsByShowcase(created.id, user.uid);
    } catch (_) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  async function handleToggleVisibility() {
    if (!showcaseApi.showcase?.id) return;
    if (!isProfileComplete) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Perfil incompleto', 'Preencha CPF, endereco e WhatsApp no perfil para ativar vitrine publica.');
      return;
    }
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await showcaseApi.toggleVisibility(showcaseApi.showcase.id, !showcaseApi.showcase.visivel);
    } catch (_) {}
  }

  async function handleSaveSettings() {
    if (!showcaseApi.showcase?.id) return;
    try {
      await showcaseApi.updateShowcase(showcaseApi.showcase.id, { nome: editingName.trim() || 'Minha Vitrine' });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowSettings(false);
    } catch (_) {}
  }

  if (!showcaseApi.showcase && !showcaseApi.loading) {
    return (
      <ScreenContainer scroll backgroundColor={colors.background}>
        <Header title="Minha Vitrine" showBack subtitle="Anuncie seus pares para a comunidade." />
        <View style={styles.createForm}>
          <Input
            label="NOME DA VITRINE"
            value={newShowcaseName}
            onChangeText={setNewShowcaseName}
            placeholder="Ex: Hype Store"
          />
          <Button title="CRIAR MINHA VITRINE" onPress={handleCreateShowcase} loading={showcaseApi.loading} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer withPadding={false} backgroundColor={colors.background}>
      <View style={styles.headerPadding}>
        <Header
          title="Minha Vitrine"
          showBack
          rightAction={
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowSettings(!showSettings);
              }}
              style={styles.iconBtn}
            >
              <Ionicons name={showSettings ? 'close' : 'settings-outline'} size={24} color={colors.white} />
            </Pressable>
          }
        />
      </View>

      <FlatList
        data={showcaseApi.loading ? [1, 2, 3, 4] : filteredProducts}
        keyExtractor={(item, index) => (showcaseApi.loading ? `skeleton-${index}` : item.id)}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View style={styles.stickyHeader}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={colors.textCaption} style={styles.searchIcon} />
              <Input value={search} onChangeText={setSearch} placeholder="Buscar em meu estoque..." style={styles.searchInput} />
            </View>

            {showSettings ? (
              <View style={styles.settingsPanel}>
                <Input label="NOME DA VITRINE" value={editingName} onChangeText={setEditingName} />
                <View style={styles.switchRow}>
                  <View style={styles.switchText}>
                    <Text style={styles.switchTitle}>Vitrine Publica</Text>
                    <Text style={styles.switchSubtitle}>Visivel no Estoque Global</Text>
                  </View>
                  <Switch
                    value={!!showcaseApi.showcase?.visivel}
                    onValueChange={handleToggleVisibility}
                    trackColor={{ true: colors.primary, false: colors.border }}
                    thumbColor={colors.white}
                  />
                </View>
                <Button title="SALVAR CONFIGURACOES" onPress={handleSaveSettings} style={styles.saveBtn} />
              </View>
            ) : (
              <>
                <View style={styles.statsRow}>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>{productsApi.products.length}</Text>
                    <Text style={styles.statLabel}>TOTAL</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>{activeProducts.length}</Text>
                    <Text style={styles.statLabel}>ATIVOS</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.stat}>
                    <Text style={[styles.statValue, { color: colors.warning }]}>{soldProducts.length}</Text>
                    <Text style={styles.statLabel}>VENDIDOS</Text>
                  </View>
                </View>

                <View style={styles.tabRow}>
                  <Pressable
                    style={[styles.tabBtn, productTab === 'active' && styles.tabBtnActive]}
                    onPress={() => setProductTab('active')}
                  >
                    <Text style={[styles.tabText, productTab === 'active' && styles.tabTextActive]}>
                      Ativos ({activeProducts.length})
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[styles.tabBtn, productTab === 'sold' && styles.tabBtnActive]}
                    onPress={() => setProductTab('sold')}
                  >
                    <Text style={[styles.tabText, productTab === 'sold' && styles.tabTextActive]}>
                      Vendidos ({soldProducts.length})
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        }
        renderItem={({ item }) => {
          if (showcaseApi.loading) {
            return (
              <View style={styles.cardWrapper}>
                <ProductCardSkeleton />
              </View>
            );
          }
          return (
            <View style={styles.cardWrapper}>
              <ProductCard
                product={item}
                onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAILS, { productId: item.id })}
              />
            </View>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            title={productTab === 'sold' ? 'Nenhum produto vendido' : 'Sua vitrine esta vazia'}
            description={
              productTab === 'sold'
                ? 'Os produtos vendidos aparecerao aqui separados para voce.'
                : 'Comece adicionando seu primeiro sneaker ao estoque.'
            }
            actionLabel={productTab === 'sold' ? 'VER ATIVOS' : 'ADICIONAR PRODUTO'}
            onAction={() => {
              if (productTab === 'sold') {
                setProductTab('active');
                return;
              }
              navigation.navigate(ROUTES.PRODUCT_FORM, { mode: 'create', showcaseId: showcaseApi.showcase?.id });
            }}
          />
        }
      />

      <Pressable
        style={styles.fab}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigation.navigate(ROUTES.PRODUCT_FORM, { mode: 'create', showcaseId: showcaseApi.showcase?.id });
        }}
      >
        <Ionicons name="add" size={32} color={colors.black} />
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerPadding: {
    paddingHorizontal: spacing.md
  },
  createForm: {
    marginTop: spacing.xl
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  stickyHeader: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  searchContainer: {
    position: 'relative',
    marginTop: spacing.sm
  },
  searchIcon: {
    position: 'absolute',
    left: spacing.md,
    top: 18,
    zIndex: 1
  },
  searchInput: {
    marginBottom: 0
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  stat: {
    flex: 1,
    alignItems: 'center'
  },
  statValue: {
    ...typography.h3,
    fontSize: 18,
    fontWeight: '900',
    color: colors.white
  },
  statLabel: {
    ...typography.caption,
    fontSize: 9,
    color: colors.textCaption,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 2
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border
  },
  tabRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm
  },
  tabBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center'
  },
  tabBtnActive: {
    borderColor: colors.primary
  },
  tabText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '800',
    fontSize: 11
  },
  tabTextActive: {
    color: colors.white
  },
  settingsPanel: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md
  },
  switchText: {
    flex: 1
  },
  switchTitle: {
    ...typography.body,
    fontWeight: '800',
    color: colors.white
  },
  switchSubtitle: {
    ...typography.caption,
    fontSize: 12
  },
  saveBtn: {
    height: 48
  },
  listContent: {
    paddingBottom: 100
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md
  },
  cardWrapper: {
    width: '48%'
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.heavy
  }
});
