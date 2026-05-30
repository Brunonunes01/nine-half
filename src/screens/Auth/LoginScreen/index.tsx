import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ScreenContainer from '../../../components/layout/ScreenContainer';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../app/routes/routeNames';
import { validateEmail, validatePassword } from '../../../utils/validators';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

export default function LoginScreen({ navigation }: any) {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  async function handleLogin() {
    setFormError('');

    if (!validateEmail(email)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setFormError('E-mail inválido.');
      return;
    }

    if (!validatePassword(password)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setFormError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      await login(email.trim(), password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  return (
    <ScreenContainer scroll backgroundColor={colors.background}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>9/2</Text>
          </View>
          <Text style={styles.title}>NINE HALF</Text>
          <Text style={styles.subtitle}>Gerenciamento premium de sneakers para revendedores.</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="E-MAIL"
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="SENHA"
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

          <Button 
            title="ENTRAR NA CONTA" 
            onPress={handleLogin} 
            loading={loading} 
            disabled={loading} 
            style={styles.loginButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Ainda não tem conta?</Text>
          <Pressable onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate(ROUTES.REGISTER);
          }}>
            <Text style={styles.footerLink}> CRIAR CONTA AGORA</Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoText: {
    color: colors.black,
    fontSize: 28,
    fontWeight: '900',
  },
  title: {
    ...typography.h1,
    fontSize: 32,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 1,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  form: {
    marginTop: spacing.xl,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.xs,
    marginBottom: spacing.md,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 13,
  },
  footer: {
    marginTop: spacing.xxl,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 14,
  },
  footerLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  }
});
