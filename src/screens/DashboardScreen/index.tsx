import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ScreenContainer from '../../components/layout/ScreenContainer';
import Header from '../../components/layout/Header';
import { useAuth } from '../../hooks/useAuth';
import { useReservations } from '../../hooks/useReservations';
import { useTransactions } from '../../hooks/useTransactions';
import { ROUTES } from '../../app/routes/routeNames';
import { USER_TYPES } from '../../constants/userTypes';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

function MetricCard({ 
  label, 
  value, 
  icon, 
  color = colors.primary 
}: { 
  label: string; 
  value: string | number; 
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
}) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel}>{label.toUpperCase()}</Text>
      </View>
    </View>
  );
}

function ActionCard({ 
  title, 
  icon, 
  onPress 
}: { 
  title: string; 
  icon: keyof typeof Ionicons.glyphMap; 
  onPress: () => void;
}) {
  return (
    <Pressable 
      style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]} 
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <View style={styles.actionIcon}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <Text style={styles.actionTitle}>{title.toUpperCase()}</Text>
    </Pressable>
  );
}

export default function DashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const { reservations } = useReservations();
  const { transactions } = useTransactions();
  const isAdmin = user?.tipo === USER_TYPES.ADMIN;

  const firstName = user?.nome?.split(' ')[0] || 'Usuário';
  const totalReservations = reservations?.length || 0;
  const totalTransactions = transactions?.length || 0;
  const now = new Date();
  const hour = now.getHours();
  const periodLabel = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const roleLabel = user?.tipo ? String(user.tipo).toUpperCase() : 'COMUM';
  const todayLabel = now.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  });

  return (
    <ScreenContainer scroll backgroundColor={colors.background}>
      <Header
        title={`${periodLabel}, ${firstName}`}
        subtitle="Seu painel de controle para vitrine, reservas e vendas."
        rightAction={
          <Pressable 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate(ROUTES.PROFILE);
            }} 
            style={styles.avatar}
          >
            <Ionicons name="person-circle" size={44} color={colors.white} />
          </Pressable>
        }
      />

      <View style={styles.contextRow}>
        <View style={styles.contextChip}>
          <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.contextText}>{todayLabel}</Text>
        </View>
        <View style={styles.contextChip}>
          <Ionicons name="shield-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.contextText}>{roleLabel}</Text>
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <MetricCard 
          label="Reservas" 
          value={totalReservations} 
          icon="bookmark" 
          color={colors.accent} 
        />
        <MetricCard 
          label="Vendas" 
          value={totalTransactions} 
          icon="receipt" 
          color={colors.success} 
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AÇÕES RÁPIDAS</Text>
        <View style={styles.grid}>
          <ActionCard
            title="Minha Vitrine"
            icon="storefront-outline"
            onPress={() => navigation.navigate(ROUTES.SHOWCASE)}
          />
          <ActionCard
            title="Estoque Global"
            icon="search-outline"
            onPress={() => navigation.navigate(ROUTES.GLOBAL_STOCK)}
          />
          <ActionCard
            title="Reservas Ativas"
            icon="bookmark-outline"
            onPress={() => navigation.navigate(ROUTES.MY_RESERVATIONS)}
          />
          <ActionCard
            title="Minhas Vendas"
            icon="card-outline"
            onPress={() => navigation.navigate(ROUTES.MY_TRANSACTIONS)}
          />
          {isAdmin ? (
            <ActionCard
              title="Painel Admin"
              icon="shield-checkmark-outline"
              onPress={() => navigation.navigate(ROUTES.ADMIN_DASHBOARD)}
            />
          ) : null}
        </View>
      </View>

      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>HYPE & CULTURE</Text>
          <Text style={styles.bannerText}>Gerencie seu estoque como um profissional do mercado.</Text>
        </View>
        <Ionicons name="trending-up" size={40} color={colors.primary} />
      </View>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  avatar: {
    padding: 4,
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  contextRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  contextChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  contextText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '800'
  },
  metricCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    ...typography.h3,
    fontSize: 20,
    fontWeight: '900',
    color: colors.white,
  },
  metricLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '800',
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '900',
    color: colors.textSecondary,
    marginBottom: spacing.md,
    letterSpacing: 1.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    width: '47.5%',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    borderColor: colors.primary,
    backgroundColor: colors.backgroundSecondary,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionTitle: {
    ...typography.body,
    fontSize: 12,
    fontWeight: '900',
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 0.5
  },
  banner: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    ...typography.h3,
    fontSize: 18,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.5
  },
  bannerText: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
