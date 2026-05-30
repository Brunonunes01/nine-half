import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Header from '../../../components/layout/Header';
import ScreenContainer from '../../../components/layout/ScreenContainer';
import EmptyState from '../../../components/ui/EmptyState';
import Loading from '../../../components/ui/Loading';
import { ROUTES } from '../../../app/routes/routeNames';
import { USER_TYPES } from '../../../constants/userTypes';
import { useAdmin } from '../../../hooks/useAdmin';
import { useAuth } from '../../../hooks/useAuth';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

function Metric({
  label,
  value,
  icon
}: {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricTop}>
        <Ionicons name={icon} size={16} color={colors.primary} />
        <Text style={styles.metricValue}>{value}</Text>
      </View>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export default function AdminDashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const { metrics, loading, error, loadMetrics } = useAdmin();
  const isAdmin = user?.tipo === USER_TYPES.ADMIN;

  useFocusEffect(
    useCallback(() => {
      if (!isAdmin) return;
      loadMetrics();
    }, [isAdmin, loadMetrics])
  );

  if (!isAdmin) {
    return (
      <ScreenContainer backgroundColor={colors.background}>
        <Header title="Painel Admin" showBack />
        <EmptyState
          title="Acesso restrito"
          description="Somente administradores podem acessar este painel."
          actionLabel="Voltar"
          onAction={() => navigation.goBack()}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll backgroundColor={colors.background}>
      <Header
        title="Painel Admin"
        subtitle="Visão geral da plataforma."
        showBack
        rightAction={
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              loadMetrics();
            }}
            style={styles.refreshBtn}
          >
            <Ionicons name="refresh-outline" size={22} color={colors.white} />
          </Pressable>
        }
      />

      {loading ? <Loading text="CARREGANDO METRICAS..." /> : null}

      {!loading ? (
        <>
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.metricsGrid}>
            <Metric label="Usuarios" value={metrics.totalUsers} icon="people-outline" />
            <Metric label="Lojistas" value={metrics.totalStoreOwners} icon="storefront-outline" />
            <Metric label="Produtos disponiveis" value={metrics.totalProductsAvailable} icon="pricetag-outline" />
            <Metric label="Reservas ativas" value={metrics.totalActiveReservations} icon="bookmark-outline" />
            <Metric label="Transacoes concluidas" value={metrics.totalCompletedTransactions} icon="checkmark-done-outline" />
          </View>

          <View style={styles.roadmapBox}>
            <Text style={styles.roadmapTitle}>Proximos modulos</Text>
            <Text style={styles.roadmapItem}>1. Gestao de usuarios</Text>
            <Text style={styles.roadmapItem}>2. Moderacao de vitrines</Text>
            <Text style={styles.roadmapItem}>3. Moderacao de produtos</Text>
            <Text style={styles.roadmapItem}>4. Auditoria de transacoes</Text>
            <Pressable
              style={styles.manageUsersBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate(ROUTES.ADMIN_USERS);
              }}
            >
              <Ionicons name="people-outline" size={16} color={colors.black} />
              <Text style={styles.manageUsersText}>Abrir Gestao de Usuarios</Text>
            </Pressable>
          </View>
        </>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  refreshBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm
  },
  errorText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 12
  },
  metricsGrid: {
    marginTop: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md
  },
  metricCard: {
    width: '48%',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md
  },
  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  metricValue: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '900'
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '800',
    marginTop: spacing.xs,
    fontSize: 11
  },
  roadmapBox: {
    marginTop: spacing.xl,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md
  },
  roadmapTitle: {
    ...typography.body,
    color: colors.white,
    fontWeight: '800',
    marginBottom: spacing.sm
  },
  roadmapItem: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs
  },
  manageUsersBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs
  },
  manageUsersText: {
    color: colors.black,
    fontWeight: '800',
    fontSize: 12
  }
});
