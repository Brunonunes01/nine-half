import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../components/layout/Header';
import ScreenContainer from '../../../components/layout/ScreenContainer';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import Input from '../../../components/ui/Input';
import Loading from '../../../components/ui/Loading';
import { USER_TYPES } from '../../../constants/userTypes';
import { useAdminUsers } from '../../../hooks/useAdminUsers';
import { useAuth } from '../../../hooks/useAuth';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

function RoleBadge({ tipo }: { tipo: string }) {
  const styleByRole: Record<string, { bg: string; border: string; text: string }> = {
    [USER_TYPES.ADMIN]: { bg: 'rgba(249, 115, 22, 0.18)', border: colors.primary, text: colors.primary },
    [USER_TYPES.STORE_OWNER]: { bg: 'rgba(16, 185, 129, 0.18)', border: colors.success, text: colors.success },
    [USER_TYPES.COMMON]: { bg: 'rgba(148, 163, 184, 0.18)', border: colors.border, text: colors.textSecondary }
  };

  const current = styleByRole[tipo] || styleByRole[USER_TYPES.COMMON];

  return (
    <View style={[styles.roleBadge, { backgroundColor: current.bg, borderColor: current.border }]}>
      <Text style={[styles.roleText, { color: current.text }]}>{String(tipo || USER_TYPES.COMMON).toUpperCase()}</Text>
    </View>
  );
}

export default function AdminUsersScreen({ navigation }: any) {
  const { user } = useAuth();
  const {
    filteredUsers,
    loading,
    loadingMore,
    error,
    hasMore,
    searchText,
    setSearchText,
    loadInitialUsers,
    loadMoreUsers,
    changeUserRole,
    changeUserActiveStatus
  } = useAdminUsers();

  const [roleModalUser, setRoleModalUser] = useState<any>(null);
  const [roleUpdating, setRoleUpdating] = useState(false);

  const isAdmin = user?.tipo === USER_TYPES.ADMIN;

  useFocusEffect(
    useCallback(() => {
      if (!isAdmin) return;
      loadInitialUsers();
    }, [isAdmin, loadInitialUsers])
  );

  const roleOptions = useMemo(
    () => [USER_TYPES.ADMIN, USER_TYPES.STORE_OWNER, USER_TYPES.COMMON],
    []
  );

  async function handleChangeRole(nextRole: string) {
    if (!roleModalUser?.id) return;
    setRoleUpdating(true);
    try {
      await changeUserRole(roleModalUser.id, nextRole);
      setRoleModalUser(null);
    } finally {
      setRoleUpdating(false);
    }
  }

  function handleToggleActive(targetUser: any) {
    const currentlyActive = targetUser?.ativo !== false;
    if (targetUser?.id === user?.uid && currentlyActive) {
      Alert.alert('Acao bloqueada', 'Voce nao pode se bloquear.');
      return;
    }

    Alert.alert(
      currentlyActive ? 'Bloquear usuario' : 'Desbloquear usuario',
      currentlyActive
        ? 'Deseja bloquear este usuario?'
        : 'Deseja desbloquear este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: currentlyActive ? 'Bloquear' : 'Desbloquear',
          style: currentlyActive ? 'destructive' : 'default',
          onPress: async () => {
            await changeUserActiveStatus(
              targetUser.id,
              !currentlyActive,
              currentlyActive ? 'Bloqueado por administrador.' : ''
            );
          }
        }
      ]
    );
  }

  if (!isAdmin) {
    return (
      <ScreenContainer backgroundColor={colors.background}>
        <Header title="Usuarios" showBack />
        <EmptyState
          title="Acesso restrito"
          description="Somente administradores podem acessar esta tela."
          actionLabel="Voltar"
          onAction={() => navigation.goBack()}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll={false} backgroundColor={colors.background}>
      <Header title="Usuarios" subtitle="Gestao administrativa de contas." showBack />

      <Input
        label="BUSCAR"
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Nome, email ou tipo..."
        icon="search-outline"
      />

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading && filteredUsers.length === 0 ? (
        <Loading text="CARREGANDO USUÁRIOS..." />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onEndReached={loadMoreUsers}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            hasMore ? (
              <View style={styles.footerLoad}>
                <Button
                  title={loadingMore ? 'CARREGANDO...' : 'CARREGAR MAIS'}
                  onPress={loadMoreUsers}
                  loading={loadingMore}
                  variant="secondary"
                  fullWidth={false}
                />
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const isActive = item?.ativo !== false;
            return (
              <View style={styles.userCard}>
                <View style={styles.userTop}>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item?.nome || 'Sem nome'}</Text>
                    <Text style={styles.userEmail}>{item?.email || '-'}</Text>
                  </View>
                  <RoleBadge tipo={item?.tipo} />
                </View>

                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, { backgroundColor: isActive ? colors.success : colors.danger }]} />
                  <Text style={styles.statusText}>{isActive ? 'Ativo' : 'Bloqueado'}</Text>
                  {!isActive && item?.blockedReason ? (
                    <Text style={styles.reasonText}>• {item.blockedReason}</Text>
                  ) : null}
                </View>

                <View style={styles.actionsRow}>
                  <Button
                    title="ALTERAR TIPO"
                    variant="secondary"
                    onPress={() => setRoleModalUser(item)}
                    fullWidth={false}
                    style={styles.actionBtn}
                  />
                  <Button
                    title={isActive ? 'BLOQUEAR' : 'DESBLOQUEAR'}
                    variant={isActive ? 'danger' : 'secondary'}
                    onPress={() => handleToggleActive(item)}
                    fullWidth={false}
                    style={styles.actionBtn}
                  />
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <EmptyState
              title="Sem usuários"
              description="Nenhum usuário encontrado para o filtro informado."
              actionLabel="LIMPAR BUSCA"
              onAction={() => setSearchText('')}
            />
          }
        />
      )}

      <Modal
        visible={!!roleModalUser}
        transparent
        animationType="fade"
        onRequestClose={() => setRoleModalUser(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Alterar tipo</Text>
            <Text style={styles.modalSubtitle}>{roleModalUser?.nome || '-'}</Text>
            {roleOptions.map((option) => (
              <Pressable
                key={option}
                style={styles.modalOption}
                onPress={() => handleChangeRole(option)}
                disabled={roleUpdating}
              >
                <Text style={styles.modalOptionText}>{option.toUpperCase()}</Text>
              </Pressable>
            ))}
            <Pressable style={[styles.modalOption, styles.modalCancel]} onPress={() => setRoleModalUser(null)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm
  },
  errorText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 12
  },
  listContent: {
    paddingBottom: spacing.xxl
  },
  userCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md
  },
  userTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userInfo: {
    flex: 1,
    marginRight: spacing.sm
  },
  userName: {
    ...typography.body,
    color: colors.white,
    fontWeight: '800'
  },
  userEmail: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2
  },
  roleBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1
  },
  roleText: {
    fontSize: 10,
    fontWeight: '800'
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  statusText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700'
  },
  reasonText: {
    ...typography.caption,
    color: colors.textCaption,
    marginLeft: 6
  },
  actionsRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm
  },
  actionBtn: {
    flex: 1
  },
  footerLoad: {
    alignItems: 'center',
    marginTop: spacing.sm
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: spacing.lg
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg
  },
  modalTitle: {
    ...typography.body,
    color: colors.white,
    fontWeight: '800'
  },
  modalSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.sm
  },
  modalOption: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm
  },
  modalOptionText: {
    color: colors.white,
    fontWeight: '700'
  },
  modalCancel: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(239,68,68,0.12)'
  },
  modalCancelText: {
    color: colors.danger,
    fontWeight: '800'
  }
});
