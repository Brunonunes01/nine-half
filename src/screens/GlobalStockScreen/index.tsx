import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/layout/ScreenContainer';
import EmptyState from '../../components/ui/EmptyState';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ProductCard from '../../components/domain/ProductCard';
import Loading from '../../components/ui/Loading';
import { ROUTES } from '../../app/routes/routeNames';
import { useAuth } from '../../hooks/useAuth';
import { useGlobalStock } from '../../hooks/useGlobalStock';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';

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
    updateFilters
  } = useGlobalStock(user?.uid || '');

  useFocusEffect(
    useCallback(() => {
      if (user?.uid) loadInitialProducts();
    }, [user?.uid, loadInitialProducts])
  );

  return (
    <ScreenContainer>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          placeholder="Buscar por modelo ou marca"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          value={filters.searchText}
          onChangeText={(v) => updateFilters({ searchText: v })}
          onSubmitEditing={() => loadInitialProducts()}
        />
        <Pressable onPress={() => setShowFilters((v) => !v)} style={styles.filterBtn}>
          <Ionicons name="options-outline" size={18} color={showFilters ? colors.secondary : colors.primary} />
        </Pressable>
      </View>

      {showFilters ? (
        <View style={styles.filters}>
          <Text style={styles.filtersTitle}>Filtros</Text>
          <View style={styles.row}>
            <View style={styles.col}><Input label="Marca" value={filters.marca} onChangeText={(v) => updateFilters({ marca: v })} /></View>
            <View style={styles.col}><Input label="Numeracao" value={filters.numeracao} onChangeText={(v) => updateFilters({ numeracao: v })} /></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}><Input label="Preco min" value={filters.minPrice} onChangeText={(v) => updateFilters({ minPrice: v })} keyboardType="numeric" /></View>
            <View style={styles.col}><Input label="Preco max" value={filters.maxPrice} onChangeText={(v) => updateFilters({ maxPrice: v })} keyboardType="numeric" /></View>
          </View>
          <Button title="Aplicar filtros" variant="secondary" onPress={() => { loadInitialProducts(); setShowFilters(false); }} />
        </View>
      ) : null}

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading && products.length === 0 ? (
        <Loading text="Carregando estoque global..." />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={refreshProducts}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAILS, { productId: item.id, source: 'global' })}
            />
          )}
          onEndReached={loadMoreProducts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={hasMore ? <Button title="Carregar mais" variant="outline" onPress={loadMoreProducts} /> : null}
          ListEmptyComponent={
            <EmptyState
              title="Nenhum produto encontrado"
              description="Ajuste os filtros ou tente outra busca."
            />
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    minHeight: 52,
    marginBottom: spacing.md,
    ...shadows.soft
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600'
  },
  filterBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center'
  },
  filters: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.soft
  },
  filtersTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase'
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md
  },
  col: {
    flex: 1
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#FEE2E2',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm
  },
  errorText: {
    color: colors.danger,
    fontWeight: '600'
  },
  listContent: {
    paddingBottom: spacing.xxl,
    gap: spacing.sm
  }
});
