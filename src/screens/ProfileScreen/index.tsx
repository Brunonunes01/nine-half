import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/layout/ScreenContainer';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function ProfileScreen() {
  const { user, logout, loading } = useAuth();

  return (
    <ScreenContainer scroll>
      <Header title="Meu perfil" showBack />

      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color={colors.primary} />
        </View>
        <Text style={styles.name}>{user?.nome || 'Usuario'}</Text>
        <Text style={styles.email}>{user?.email || '-'}</Text>

        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{user?.tipo || 'membro'}</Text>
          </View>
          {user?.verificado ? (
            <View style={[styles.tag, styles.verifiedTag]}>
              <Ionicons name="shield-checkmark" size={12} color={colors.success} />
              <Text style={[styles.tagText, { color: colors.success }]}>Verificado</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.actions}>
        <Button title="Sair da conta" onPress={logout} loading={loading} disabled={loading} variant="outline" />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.secondarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border
  },
  name: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.md
  },
  email: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500'
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.secondarySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.round
  },
  verifiedTag: {
    backgroundColor: 'rgba(5, 150, 105, 0.1)'
  },
  tagText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  actions: {
    gap: spacing.sm
  }
});
