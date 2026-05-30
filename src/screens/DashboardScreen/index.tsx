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
import { themeShadows } from '../../theme/themeShadows';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

function Metric({ 
  label, 
  value, 
  icon,
  color = colors.primary
}: { 
  label: string; 
  value: number; 
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
}) {
  return (
    <View style={styles.metricItem}>
      <View style={[styles.metricIconWrap, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel}>{label.toUpperCase()}</Text>
      </View>
    </View>
  );
}

function HubAction({ 
  title, 
  subtitle,
  icon, 
  onPress,
  variant = 'default'
}: { 
  title: string; 
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap; 
  onPress: () => void;
  variant?: 'default' | 'primary' | 'outline'
}) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.hubBtn, 
        variant === 'primary' && styles.hubBtnPrimary,
        pressed && styles.pressed
      ]} 
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
    >
      <View style={[styles.hubIconBox, variant === 'primary' && { backgroundColor: 'rgba(0,0,0,0.2)' }]}>
        <Ionicons name={icon} size={24} color={variant === 'primary' ? colors.black : colors.primary} />
      </View>
      <View style={styles.hubTextContent}>
        <Text style={[styles.hubTitle, variant === 'primary' && { color: colors.black }]}>{title.toUpperCase()}</Text>
        <Text style={[styles.hubSubtitle, variant === 'primary' && { color: 'rgba(0,0,0,0.6)' }]}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={variant === 'primary' ? 'rgba(0,0,0,0.3)' : colors.textCaption} />
    </Pressable>
  );
}

export default function DashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const { reservations } = useReservations();
  const { transactions } = useTransactions();
  const isAdmin = user?.tipo === USER_TYPES.ADMIN;

  const firstName = user?.nome?.split(' ')[0] || 'Sneakerhead';
  const totalReservations = reservations?.length || 0;
  const totalTransactions = transactions?.length || 0;

  return (
    <ScreenContainer scroll backgroundColor={colors.background}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brandLogo}>NINE HALF</Text>
          <Text style={styles.brandTagline}>COMMAND CENTER</Text>
        </View>
        <Pressable 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate(ROUTES.PROFILE);
          }} 
          style={styles.profileButton}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.statsPanel}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>PERFORMANCE GERAL</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>AO VIVO</Text>
          </View>
        </View>
        
        <View style={styles.metricsRow}>
          <Metric label="Reservas" value={totalReservations} icon="bookmark" color={colors.accent} />
          <View style={styles.vDivider} />
          <Metric label="Vendas" value={totalTransactions} icon="checkmark-done" color={colors.success} />
          <View style={styles.vDivider} />
          <Metric label="Estoque" value={0} icon="cube" />
        </View>
      </View>

      <View style={styles.hubSection}>
        <Text style={styles.sectionHeader}>GESTÃO DE INVENTÁRIO</Text>
        <HubAction
          title="Minha Vitrine"
          subtitle="Gerenciar seus sneakers e anúncios"
          icon="storefront"
          variant="primary"
          onPress={() => navigation.navigate(ROUTES.SHOWCASE)}
        />
        <HubAction
          title="Estoque Global"
          subtitle="Explorar sneakers de toda a rede"
          icon="search"
          onPress={() => navigation.navigate(ROUTES.GLOBAL_STOCK)}
        />
      </View>

      <View style={styles.hubSection}>
        <Text style={styles.sectionHeader}>NEGOCIAÇÕES</Text>
        <View style={styles.hubGrid}>
          <Pressable 
            style={[styles.miniHubCard, { flex: 1 }]}
            onPress={() => navigation.navigate(ROUTES.MY_RESERVATIONS)}
          >
            <Ionicons name="bookmark-outline" size={20} color={colors.white} />
            <Text style={styles.miniHubTitle}>RESERVAS</Text>
          </Pressable>
          <Pressable 
            style={[styles.miniHubCard, { flex: 1 }]}
            onPress={() => navigation.navigate(ROUTES.MY_TRANSACTIONS)}
          >
            <Ionicons name="receipt-outline" size={20} color={colors.white} />
            <Text style={styles.miniHubTitle}>VENDAS</Text>
          </Pressable>
        </View>
      </View>

      {isAdmin && (
        <View style={styles.hubSection}>
          <Text style={styles.sectionHeader}>ADMINISTRAÇÃO</Text>
          <HubAction
            title="Painel Administrativo"
            subtitle="Controle total da plataforma"
            icon="shield-checkmark"
            onPress={() => navigation.navigate(ROUTES.ADMIN_DASHBOARD)}
          />
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.xs
  },
  brandLogo: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 1
  },
  brandTagline: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 2,
    marginTop: -2
  },
  profileButton: {
    padding: 2
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: colors.primary,
    fontWeight: '900',
    fontSize: 18
  },
  statsPanel: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...themeShadows.medium
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg
  },
  statsTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.textCaption,
    letterSpacing: 1.5
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.danger
  },
  liveText: {
    fontSize: 8,
    fontWeight: '900',
    color: colors.danger
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8
  },
  metricIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.white,
    textAlign: 'center'
  },
  metricLabel: {
    fontSize: 8,
    color: colors.textCaption,
    fontWeight: '800',
    textAlign: 'center'
  },
  vDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    opacity: 0.5
  },
  hubSection: {
    marginTop: spacing.xl,
    gap: spacing.sm
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    letterSpacing: 1,
    paddingHorizontal: 4
  },
  hubBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md
  },
  hubBtnPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  hubIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  hubTextContent: {
    flex: 1
  },
  hubTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.5
  },
  hubSubtitle: {
    fontSize: 11,
    color: colors.textCaption,
    marginTop: 2,
    fontWeight: '600'
  },
  hubGrid: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  miniHubCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: spacing.xs
  },
  miniHubTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.white,
    marginTop: 4
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }]
  },
  bottomSpacer: {
    height: spacing.xxl
  }
});
