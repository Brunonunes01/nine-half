import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ScreenContainer from '../../components/layout/ScreenContainer';
import Header from '../../components/layout/Header';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import ProductCard from '../../components/domain/ProductCard';
import { ProductCardSkeleton } from '../../components/ui/Skeleton/ProductCardSkeleton';
import { useAuth } from '../../hooks/useAuth';
import { useGlobalStock, DEFAULT_GLOBAL_FILTERS } from '../../hooks/useGlobalStock';
import { ROUTES } from '../../app/routes/routeNames';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { themeShadows } from '../../theme/themeShadows';
import { typography } from '../../theme/typography';

export default function GlobalStockScreen({ navigation }: any) {
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);

  const {
    products,
    loading,
    refreshing,
    error,
    filters,
    hasMore,
    loadInitialProducts,
    loadMoreProducts,
    refreshProducts,
    updateFilters,
    clearFilters
  } = useGlobalStock(user?.uid || '');

  useFocusEffect(
    useCallback(() => {
      loadInitialProducts();
    }, [loadInitialProducts])
  );

  const handleToggleFilters = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowFilters(!showFilters);
  };

  return (
    <ScreenContainer backgroundColor={colors.background}>
      <Header 
        title="ESTOQUE GLOBAL" 
        subtitle="Explore a coleção da rede"
        rightAction={
          <Pressable onPress={handleToggleFilters} style={styles.filterBtn}>
            <Ionicons name="options-outline" size={22} color={showFilters ? colors.primary : colors.white} />
          </Pressable>
        }
      />

      <FlatList
        data={loading && products.length === 0 ? [1, 2, 3, 4, 5, 6] : products}
        keyExtractor={(item, index) => (loading && products.length === 0 ? `skeleton-${index}` : item.id)}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        refreshing={refreshing}
        onRefresh={refreshProducts}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View style={styles.stickyHeader}>
            <View style={styles.searchRow}>
              <View style={styles.searchBarWrap}>
                <Ionicons name="search" size={18} color={colors.textCaption} style={styles.searchIcon} />
                <Input
                  value={filters.searchText}
                  onChangeText={(v) => updateFilters({ searchText: v })}
                  placeholder="Buscar modelo ou tamanho..."
                  style={styles.minimalSearch}
                  onSubmitEditing={() => loadInitialProducts()}
                />
              </View>
            </View>

            {error ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color={colors.white} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {showFilters && (
              <View style={styles.filtersPanel}>
                <Text style={styles.filterSectionTitle}>FILTROS AVANÇADOS</Text>
                <View style={styles.filterRow}>
                  <View style={styles.filterCol}>
                    <Input
                      label="MARCA"
                      value={filters.marca}
                      onChangeText={(v) => updateFilters({ marca: v })}
                      placeholder="Ex: Nike"
                    />
                  </View>
                  <View style={styles.filterCol}>
                    <Input
                      label="TAMANHO"
                      value={filters.numeracao}
                      onChangeText={(v) => updateFilters({ numeracao: v })}
                      placeholder="Ex: 42"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.filterRow}>
                  <View style={styles.filterCol}>
                    <Input
                      label="MÍNIMO"
                      value={filters.minPrice}
                      onChangeText={(v) => updateFilters({ minPrice: v })}
                      keyboardType="numeric"
                      placeholder="R$ 0"
                    />
                  </View>
                  <View style={styles.filterCol}>
                    <Input
                      label="MÁXIMO"
                      value={filters.maxPrice}
                      onChangeText={(v) => updateFilters({ maxPrice: v })}
                      keyboardType="numeric"
                      placeholder="R$ 9k"
                    />
                  </View>
                </View>

                <Text style={styles.filterSectionTitle}>ORIGEM</Text>
                <View style={styles.chipRow}>
                  {['todos', 'proprio', 'parceiro'].map((o) => (
                    <Pressable
                      key={o}
                      style={[styles.chip, filters.origem === o && styles.chipActive]}
                      onPress={() => updateFilters({ origem: o })}
                    >
                      <Text style={[styles.chipText, filters.origem === o && styles.chipTextActive]}>
                        {o.toUpperCase()}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Button
                  title="APLICAR FILTROS"
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    loadInitialProducts(filters);
                    setShowFilters(false);
                  }}
                />
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => {
          if (loading && products.length === 0) {
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
                onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAILS, { productId: item.id, source: 'global' })}
              />
            </View>
          );
        }}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore ? (
            <View style={styles.footer}>
              <Button
                title="CARREGAR MAIS"
                variant="secondary"
                onPress={loadMoreProducts}
                loading={loading}
                style={styles.loadMoreBtn}
              />
            </View>
          ) : products.length > 0 ? (
            <View style={styles.footer}>
              <Text style={styles.endText}>VOCÊ CHEGOU AO FIM DO ESTOQUE</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              title="NENHUM SNEAKER ENCONTRADO"
              description="Tente ajustar seus filtros ou busca."
              icon="search-outline"
              actionLabel="LIMPAR FILTROS"
              onAction={() => {
                clearFilters();
                loadInitialProducts(DEFAULT_GLOBAL_FILTERS);
              }}
            />
          ) : null
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filterBtn: {
    width: 44,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  stickyHeader: {
    backgroundColor: colors.background,
    paddingBottom: spacing.sm
  },
  searchRow: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs
  },
  searchBarWrap: {
    position: 'relative'
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 18,
    zIndex: 1
  },
  minimalSearch: {
    backgroundColor: colors.surface,
    paddingLeft: 44,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  errorBanner: {
    backgroundColor: colors.danger,
    padding: spacing.sm,
    borderRadius: 8,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs
  },
  errorText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800'
  },
  filtersPanel: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...themeShadows.medium
  },
  filterSectionTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.textCaption,
    marginBottom: spacing.sm,
    letterSpacing: 1.5
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.md
  },
  filterCol: {
    flex: 1
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  chip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center'
  },
  chipActive: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    borderColor: colors.primary
  },
  chipText: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.textSecondary
  },
  chipTextActive: {
    color: colors.primary
  },
  listContent: {
    paddingBottom: spacing.xxl
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md
  },
  cardWrapper: {
    width: '48.5%'
  },
  footer: {
    padding: spacing.xl,
    alignItems: 'center'
  },
  loadMoreBtn: {
    minWidth: 200
  },
  endText: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.textCaption,
    letterSpacing: 2
  }
});
