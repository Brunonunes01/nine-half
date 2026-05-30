import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/layout/Header';
import ScreenContainer from '../../components/layout/ScreenContainer';
import ProductCard from '../../components/domain/ProductCard';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Input from '../../components/ui/Input';
import Loading from '../../components/ui/Loading';
import { ROUTES } from '../../app/routes/routeNames';
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

  const [newShowcaseName, setNewShowcaseName] = React.useState('Minha vitrine');
  const [editingName, setEditingName] = React.useState('');
  const [showSettings, setShowSettings] = React.useState(false);

  const loadData = React.useCallback(() => {
    if (!user?.uid) return;
    showcaseApi.loadShowcase(user.uid).then((found: any) => {
      if (found?.id) {
        setEditingName(found.nome || '');
        productsApi.loadProductsByShowcase(found.id, user.uid);
      }
    });
  }, [user?.uid]);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [loadData])
  );

  const isProfileComplete = !!(user?.documento && user?.endereco && user?.whatsapp);

  async function handleCreateShowcase() {
    if (!user?.uid) return;
    try {
      const created = await showcaseApi.createShowcase({
        userId: user.uid,
        nome: newShowcaseName.trim() || 'Minha vitrine',
        visivel: false
      });
      setEditingName(created.nome || '');
      await productsApi.loadProductsByShowcase(created.id, user.uid);
    } catch (_) {}
  }

  async function handleToggleVisibility() {
    if (!showcaseApi.showcase?.id) return;
    if (!isProfileComplete) {
      Alert.alert('Perfil incompleto', 'Preencha CPF e endereco no perfil para ativar vitrine publica.');
      return;
    }
    try {
      await showcaseApi.toggleVisibility(showcaseApi.showcase.id, !showcaseApi.showcase.visivel);
    } catch (_) {}
  }

  async function handleSaveSettings() {
    if (!showcaseApi.showcase?.id) return;
    try {
      await showcaseApi.updateShowcase(showcaseApi.showcase.id, { nome: editingName.trim() || 'Minha vitrine' });
      setShowSettings(false);
    } catch (_) {}
  }

  if (showcaseApi.loading && !showcaseApi.showcase) {
    return <Loading text="Carregando vitrine..." />;
  }

  if (!showcaseApi.showcase) {
    return (
      <ScreenContainer>
        <Header title="Minha vitrine" showBack subtitle="Crie sua vitrine para anunciar seus pares." />
        <View style={styles.createCard}>
          <Input label="Nome da vitrine" value={newShowcaseName} onChangeText={setNewShowcaseName} />
          <Button title="Criar vitrine" onPress={handleCreateShowcase} loading={showcaseApi.loading} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header
        title="Minha vitrine"
        subtitle="Controle seu inventario, visibilidade e anuncios."
        showBack
        rightAction={
          <Pressable onPress={() => setShowSettings((v) => !v)} style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={21} color={colors.primary} />
          </Pressable>
        }
      />

      <View style={styles.kpis}>
        <View style={styles.kpiItem}>
          <Text style={styles.kpiValue}>{productsApi.products.length}</Text>
          <Text style={styles.kpiLabel}>Produtos</Text>
        </View>
        <View style={styles.kpiDivider} />
        <View style={styles.kpiItem}>
          <Text style={[styles.kpiValue, { color: showcaseApi.showcase.visivel ? colors.success : colors.danger }]}>
            {showcaseApi.showcase.visivel ? 'Publica' : 'Privada'}
          </Text>
          <Text style={styles.kpiLabel}>Visibilidade</Text>
        </View>
      </View>

      {showSettings ? (
        <View style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>Configuracoes da vitrine</Text>
          <Input label="Nome" value={editingName} onChangeText={setEditingName} />
          <View style={styles.switchRow}>
            <View style={styles.switchTextBlock}>
              <Text style={styles.switchTitle}>Vitrine publica</Text>
              <Text style={styles.switchDesc}>Permite aparecer no estoque global</Text>
            </View>
            <Switch value={!!showcaseApi.showcase.visivel} onValueChange={handleToggleVisibility} trackColor={{ true: colors.secondary }} />
          </View>
          <Button title="Salvar alteracoes" onPress={handleSaveSettings} />
        </View>
      ) : null}

      <View style={styles.inventoryHeader}>
        <Text style={styles.inventoryTitle}>Inventario</Text>
        <Pressable
          style={styles.addBtn}
          onPress={() => navigation.navigate(ROUTES.PRODUCT_FORM, { mode: 'create', showcaseId: showcaseApi.showcase.id })}
        >
          <Ionicons name="add" size={20} color={colors.white} />
        </Pressable>
      </View>

      <FlatList
        data={productsApi.products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAILS, { productId: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Nenhum produto cadastrado"
            description="Toque no botao de adicionar para cadastrar seu primeiro sneaker."
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  createCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.soft
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  kpis: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.soft
  },
  kpiItem: {
    flex: 1,
    alignItems: 'center'
  },
  kpiValue: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '900'
  },
  kpiLabel: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  kpiDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border
  },
  settingsCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.soft
  },
  settingsTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  switchTextBlock: {
    flex: 1,
    paddingRight: spacing.sm
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary
  },
  switchDesc: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary
  },
  inventoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm
  },
  inventoryTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.textPrimary
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    ...shadows.card
  },
  listContent: {
    paddingBottom: spacing.xxl
  }
});
