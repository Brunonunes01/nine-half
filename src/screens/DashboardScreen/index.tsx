import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/layout/ScreenContainer';
import Header from '../../components/layout/Header';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../app/routes/routeNames';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';

function MenuCard({
  title,
  subtitle,
  icon,
  onPress
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={onPress}>
      <View style={styles.cardIcon}>
        <Ionicons name={icon} size={22} color={colors.white} />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

export default function DashboardScreen({ navigation }: any) {
  const { user, logout, loading } = useAuth();

  return (
    <ScreenContainer scroll>
      <Header
        title="Painel"
        subtitle={`Bem-vindo, ${user?.nome?.split(' ')[0] || 'usuario'}.`}
        rightAction={
          <Pressable onPress={() => navigation.navigate(ROUTES.PROFILE)} style={styles.profileBtn}>
            <Ionicons name="person-circle-outline" size={30} color={colors.primary} />
          </Pressable>
        }
      />

      <View style={styles.hero}>
        <Text style={styles.heroLabel}>NINE HALF</Text>
        <Text style={styles.heroTitle}>Gerencie estoque e negocie sneakers em um fluxo unico.</Text>
      </View>

      <View style={styles.menu}>
        <MenuCard
          title="Minha vitrine"
          subtitle="Cadastrar e organizar seus produtos"
          icon="storefront"
          onPress={() => navigation.navigate(ROUTES.SHOWCASE)}
        />
        <MenuCard
          title="Estoque global"
          subtitle="Buscar pares disponiveis no marketplace"
          icon="globe-outline"
          onPress={() => navigation.navigate(ROUTES.GLOBAL_STOCK)}
        />
        <MenuCard
          title="Minhas reservas"
          subtitle="Acompanhar negociacoes em andamento"
          icon="bookmark-outline"
          onPress={() => navigation.navigate(ROUTES.MY_RESERVATIONS)}
        />
        <MenuCard
          title="Minhas transacoes"
          subtitle="Historico de vendas e compras concluido"
          icon="receipt-outline"
          onPress={() => navigation.navigate(ROUTES.MY_TRANSACTIONS)}
        />
      </View>

      <Pressable style={styles.logout} onPress={logout} disabled={loading}>
        <Ionicons name="log-out-outline" size={18} color={colors.textMuted} />
        <Text style={styles.logoutText}>{loading ? 'Saindo...' : 'Sair da conta'}</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  profileBtn: {
    padding: 2
  },
  hero: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    backgroundColor: colors.primary,
    marginBottom: spacing.lg,
    ...shadows.floating
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.secondarySoft,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  heroTitle: {
    marginTop: spacing.xs,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '900',
    color: colors.white
  },
  menu: {
    gap: spacing.sm
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadows.soft
  },
  cardPressed: {
    opacity: 0.92
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardBody: {
    flex: 1
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800'
  },
  cardSubtitle: {
    marginTop: 2,
    color: colors.textSecondary,
    fontSize: 12
  },
  logout: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs
  },
  logoutText: {
    color: colors.textMuted,
    fontWeight: '700'
  }
});
