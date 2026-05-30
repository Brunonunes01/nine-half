import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../../components/layout/ScreenContainer';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../app/routes/routeNames';
import { validateEmail, validatePassword } from '../../../utils/validators';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';
import { shadows } from '../../../theme/shadows';
import { typography } from '../../../theme/typography';

export default function LoginScreen({ navigation }: any) {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  async function handleLogin() {
    setFormError('');

    if (!validateEmail(email)) {
      setFormError('E-mail invalido.');
      return;
    }

    if (!validatePassword(password)) {
      setFormError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      await login(email.trim(), password);
    } catch (_) {}
  }

  return (
    <ScreenContainer scroll>
      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>N9H</Text>
          </View>
          <Text style={styles.title}>Nine Half</Text>
          <Text style={styles.subtitle}>Estoque compartilhado de sneakers para operacao profissional.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Acessar conta</Text>
          <Input
            label="E-mail"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
          />
          <Input
            label="Senha"
            icon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            placeholder="Digite sua senha"
            secureTextEntry
          />

          {(formError || error) ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={styles.errorText}>{formError || error}</Text>
            </View>
          ) : null}

          <Button title="Entrar" onPress={handleLogin} loading={loading} disabled={loading} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Ainda nao tem conta?</Text>
          <Pressable onPress={() => navigation.navigate(ROUTES.REGISTER)}>
            <Text style={styles.footerLink}> Criar conta</Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: spacing.xl
  },
  hero: {
    marginBottom: spacing.xl
  },
  logoBox: {
    width: 74,
    height: 74,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.floating
  },
  logoText: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '900'
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    maxWidth: 320
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    ...shadows.soft
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.md
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: spacing.xs,
    marginBottom: spacing.md
  },
  errorText: {
    color: colors.danger,
    fontWeight: '600'
  },
  footer: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  footerText: {
    color: colors.textSecondary
  },
  footerLink: {
    color: colors.secondary,
    fontWeight: '800'
  }
});
