import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ScreenContainer from '../../components/layout/ScreenContainer';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { validateRequired } from '../../utils/validators';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function ProfileScreen() {
  const { user, logout, loading, updateProfile, updatePrivateProfile } = useAuth();
  const [showEditForm, setShowEditForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [documento, setDocumento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');

  useEffect(() => {
    setNome(user?.nome || '');
    setTelefone(user?.telefone || '');
    setDocumento(user?.documento || '');
    setEndereco(user?.endereco || '');
    setCep(user?.cep || '');
  }, [user]);

  const userInitial = useMemo(() => user?.nome?.charAt(0)?.toUpperCase() || 'U', [user?.nome]);

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    logout();
  };

  const handleOpenEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setError('');
    setShowEditForm(true);
  };

  const handleSaveProfile = async () => {
    if (!validateRequired(nome)) {
      setError('Informe seu nome.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await updateProfile({ nome: nome.trim() });
      await updatePrivateProfile({
        telefone: telefone.trim(),
        documento: documento.trim(),
        endereco: endereco.trim(),
        cep: cep.trim()
      });
      setShowEditForm(false);
      Alert.alert('Sucesso', 'Dados atualizados com sucesso.');
    } catch (err: any) {
      setError(err?.message || 'Erro ao atualizar perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer scroll backgroundColor={colors.background}>
      <Header title="Perfil" showBack />

      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </View>
          <Text style={styles.name}>{user?.nome || 'Usuario'}</Text>
          <Text style={styles.email}>{user?.email || '-'}</Text>

          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{user?.tipo?.toUpperCase() || 'MEMBRO'}</Text>
            </View>
            {user?.verificado ? (
              <View style={[styles.badge, styles.verifiedBadge]}>
                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                <Text style={[styles.badgeText, styles.verifiedText]}>VERIFICADO</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONFIGURACOES DA CONTA</Text>
          <Pressable style={styles.menuItem} onPress={handleOpenEdit}>
            <View style={styles.menuIcon}>
              <Ionicons name="person-outline" size={20} color={colors.white} />
            </View>
            <Text style={styles.menuText}>Dados pessoais</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textCaption} />
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => Alert.alert('Em breve', 'Notificacoes sera disponibilizado em breve.')}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="notifications-outline" size={20} color={colors.white} />
            </View>
            <Text style={styles.menuText}>Notificacoes</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textCaption} />
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => Alert.alert('Em breve', 'Privacidade e seguranca sera expandido em breve.')}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="shield-outline" size={20} color={colors.white} />
            </View>
            <Text style={styles.menuText}>Privacidade e seguranca</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textCaption} />
          </Pressable>
        </View>

        {showEditForm ? (
          <View style={styles.editCard}>
            <Text style={styles.editTitle}>Editar dados pessoais</Text>
            <Input label="Nome" value={nome} onChangeText={setNome} placeholder="Seu nome" />
            <Input
              label="Telefone"
              value={telefone}
              onChangeText={setTelefone}
              placeholder="(11) 99999-9999"
              keyboardType="phone-pad"
            />
            <Input label="Documento" value={documento} onChangeText={setDocumento} placeholder="CPF/CNPJ" />
            <Input
              label="Endereco"
              value={endereco}
              onChangeText={setEndereco}
              placeholder="Rua, numero, bairro"
            />
            <Input label="CEP" value={cep} onChangeText={setCep} placeholder="00000-000" keyboardType="number-pad" />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <View style={styles.editActions}>
              <Button
                title="Cancelar"
                variant="ghost"
                onPress={() => {
                  setShowEditForm(false);
                  setError('');
                }}
                fullWidth={false}
                style={styles.cancelBtn}
              />
              <Button
                title="Salvar"
                onPress={handleSaveProfile}
                loading={saving}
                disabled={saving || loading}
                fullWidth={false}
                style={styles.saveBtn}
              />
            </View>
          </View>
        ) : null}

        <View style={styles.footer}>
          <Button title="SAIR DA CONTA" onPress={handleLogout} loading={loading} disabled={loading} variant="secondary" />
          <Text style={styles.version}>NINE HALF - v1.0.0</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: spacing.lg
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xxl
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md
  },
  avatarText: {
    color: colors.white,
    fontSize: 40,
    fontWeight: '900'
  },
  name: {
    ...typography.h2,
    fontWeight: '900',
    color: colors.white
  },
  email: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 2
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border
  },
  verifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)'
  },
  badgeText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary
  },
  verifiedText: {
    color: colors.success
  },
  section: {
    marginTop: spacing.md
  },
  sectionTitle: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '900',
    color: colors.textSecondary,
    marginBottom: spacing.md,
    letterSpacing: 1.5
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  menuText: {
    ...typography.body,
    flex: 1,
    fontWeight: '800',
    color: colors.white
  },
  editCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md
  },
  editTitle: {
    ...typography.body,
    color: colors.white,
    fontWeight: '800',
    marginBottom: spacing.md
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  cancelBtn: {
    minWidth: 120
  },
  saveBtn: {
    minWidth: 120
  },
  errorText: {
    color: colors.danger,
    ...typography.caption,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm
  },
  footer: {
    marginTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    alignItems: 'center'
  },
  version: {
    ...typography.caption,
    marginTop: spacing.xl,
    color: colors.textCaption,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1
  }
});
