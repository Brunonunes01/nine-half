import { useCallback, useState } from 'react';
import { getGlobalProducts, refreshGlobalProducts } from '../services/globalStockService';

const DEFAULT_FILTERS = {
  searchText: '',
  marca: '',
  numeracao: '',
  origem: 'todos',
  minPrice: '',
  maxPrice: '',
  orderByField: 'createdAt',
  orderDirection: 'desc'
};

export function useGlobalStock(userId: string) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadInitialProducts = useCallback(async (nextFilters = filters) => {
    setLoading(true);
    setError('');
    try {
      console.log('--- DEBUG ESTOQUE GLOBAL ---');
      console.log('User ID logado:', userId);
      console.log('Filtros aplicados:', nextFilters);
      
      const result = await refreshGlobalProducts({
        userId,
        filters: nextFilters,
        pageSize: 10
      });
      
      console.log('Sucesso! Produtos encontrados no Firestore:', result.products.length);
      if (result.products.length > 0) {
        console.log('Primeiro produto encontrado:', result.products[0].modelo);
      } else {
        console.log('Aviso: A consulta retornou ZERO produtos. Verifique se existem produtos com status "disponivel" e showcaseVisible: true');
      }
      console.log('-----------------------------');

      setProducts(result.products);
      setLastVisible(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err: any) {
      console.error('--- ERRO NO ESTOQUE GLOBAL ---');
      console.error('Mensagem:', err?.message);
      console.error('Código:', err?.code);
      console.log('-------------------------------');
      setError(err?.message || 'Erro ao carregar estoque global.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const loadMoreProducts = useCallback(async () => {
    if (!hasMore || loadingMore || !lastVisible) return;
    setLoadingMore(true);
    setError('');
    try {
      const result = await getGlobalProducts({
        userId,
        filters,
        pageSize: 10,
        lastVisible
      });
      setProducts((prev) => [...prev, ...result.products]);
      setLastVisible(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar mais produtos.');
    } finally {
      setLoadingMore(false);
    }
  }, [filters, hasMore, lastVisible, loadingMore, userId]);

  const refreshProducts = useCallback(async () => {
    setRefreshing(true);
    setError('');
    try {
      const result = await refreshGlobalProducts({
        userId,
        filters,
        pageSize: 10
      });
      setProducts(result.products);
      setLastVisible(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err: any) {
      setError(err?.message || 'Erro ao atualizar produtos.');
    } finally {
      setRefreshing(false);
    }
  }, [filters, userId]);

  const updateFilters = useCallback((partial: any) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    products,
    loading,
    loadingMore,
    refreshing,
    error,
    filters,
    hasMore,
    loadInitialProducts,
    loadMoreProducts,
    refreshProducts,
    updateFilters,
    clearFilters
  };
}
