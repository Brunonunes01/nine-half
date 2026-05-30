import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../../components/layout/ScreenContainer';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../app/routes/routeNames';
import { validateEmail, validatePassword, validateRequired } from '../../../utils/validators';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';
import { shadows } from '../../../theme/shadows';
import { typography } from '../../../theme/typography';

export default function RegisterScreen({ navigation }: any) {
  const { register, loading, error } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  async function handleRegister() {
    setFormError('');
    if (!validateRequired(nome)) {
      setFormError('Informe seu nome.');
      return;
    }
    if (!validateEmail(email)) {
      setFormError('E-mail invalido.');
      return;
    }
    if (!validatePassword(password)) {
      setFormError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      await register({
        nome: nome.trim(),
        email: email.trim(),
        password
      });
    } catch (_) {}
  }

  return (
    <ScreenContainer scroll>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Cadastre-se para publicar vitrine, reservar pares e fechar vendas.</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nome"
            icon="person-outline"
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome completo"
            autoCapitalize="words"
          />
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
            placeholder="Minimo 6 caracteres"
            secureTextEntry
          />

          {(formError || error) ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={styles.errorText}>{formError || error}</Text>
            </View>
          ) : null}

          <Button title="Cadastrar" onPress={handleRegister} loading={loading} disabled={loading} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Ja tem conta?</Text>
          <Pressable onPress={() => navigation.navigate(ROUTES.LOGIN)}>
            <Text style={styles.footerLink}> Entrar</Text>
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
    marginBottom: spacing.lg
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    ...shadows.soft
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
