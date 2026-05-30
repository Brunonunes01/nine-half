import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ScreenContainer from '../../components/layout/ScreenContainer';
import Header from '../../components/layout/Header';
import EmptyState from '../../components/ui/EmptyState';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ProductCard from '../../components/domain/ProductCard';
import { ProductCardSkeleton } from '../../components/ui/Skeleton/ProductCardSkeleton';
import { ROUTES } from '../../app/routes/routeNames';
import { useAuth } from '../../hooks/useAuth';
import { DEFAULT_GLOBAL_FILTERS, useGlobalStock } from '../../hooks/useGlobalStock';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function GlobalStockScreen({ navigation }: any) {
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);

  const {
    products,
    loading,
    refreshing,
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
      if (user?.uid) loadInitialProducts();
    }, [user?.uid, loadInitialProducts])
  );

  const handleToggleFilters = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowFilters(!showFilters);
  };

  return (
    <ScreenContainer withPadding={false} backgroundColor={colors.background}>
      <View style={styles.headerPadding}>
        <Header
          title="Estoque Global"
          subtitle="Explore os melhores sneakers do mercado."
          showBack
          rightAction={
            <Pressable onPress={handleToggleFilters} style={styles.filterBtn}>
              <Ionicons name={showFilters ? 'close' : 'options-outline'} size={24} color={colors.white} />
            </Pressable>
          }
        />
      </View>

      <FlatList
        data={loading && products.length === 0 ? [1, 2, 3, 4, 5, 6] : products}
        keyExtractor={(item, index) => (loading && products.length === 0 ? `skeleton-${index}` : item.id)}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        refreshing={refreshing}
        onRefresh={refreshProducts}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.stickyHeader}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={colors.textCaption} style={styles.searchIcon} />
              <Input
                value={filters.searchText}
                onChangeText={(v) => updateFilters({ searchText: v })}
                placeholder="Modelo, marca ou cor..."
                style={styles.searchInput}
                onSubmitEditing={() => loadInitialProducts()}
              />
            </View>

            {showFilters ? (
              <View style={styles.filtersPanel}>
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
                      label="PRECO MIN"
                      value={filters.minPrice}
                      onChangeText={(v) => updateFilters({ minPrice: v })}
                      keyboardType="numeric"
                      placeholder="R$ 0"
                    />
                  </View>
                  <View style={styles.filterCol}>
                    <Input
                      label="PRECO MAX"
                      value={filters.maxPrice}
                      onChangeText={(v) => updateFilters({ maxPrice: v })}
                      keyboardType="numeric"
                      placeholder="R$ 9999"
                    />
                  </View>
                </View>

                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Ocultar meus produtos</Text>
                  <Switch
                    value={filters.hideMyProducts !== false}
                    onValueChange={(value) => updateFilters({ hideMyProducts: value })}
                    thumbColor={filters.hideMyProducts !== false ? colors.primary : colors.textCaption}
                    trackColor={{ false: colors.border, true: 'rgba(249, 115, 22, 0.35)' }}
                  />
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
            ) : null}
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
                fullWidth={false}
                style={styles.loadMoreBtn}
              />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            title="Nenhum par encontrado"
            description="Tente ajustar sua busca ou filtros para encontrar o que procura."
            actionLabel="LIMPAR FILTROS"
            onAction={() => {
              clearFilters();
              loadInitialProducts(DEFAULT_GLOBAL_FILTERS);
            }}
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerPadding: {
    paddingHorizontal: spacing.md
  },
  filterBtn: {
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
  filtersPanel: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.md
  },
  filterCol: {
    flex: 1
  },
  switchRow: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  switchLabel: {
    ...typography.body,
    color: colors.white,
    fontWeight: '700'
  },
  listContent: {
    paddingBottom: spacing.xxl
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md
  },
  cardWrapper: {
    width: '48%'
  },
  footer: {
    padding: spacing.xl,
    alignItems: 'center'
  },
  loadMoreBtn: {
    minWidth: 200
  }
});
