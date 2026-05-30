import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ScreenContainer from '../../../components/layout/ScreenContainer';
import Header from '../../../components/layout/Header';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../app/routes/routeNames';
import { validateEmail, validatePassword, validateRequired } from '../../../utils/validators';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';
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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setFormError('Informe seu nome completo.');
      return;
    }
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
      await register({
        nome: nome.trim(),
        email: email.trim(),
        password
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  return (
    <ScreenContainer scroll backgroundColor={colors.background}>
      <Header title="Criar Conta" showBack />
      
      <View style={styles.content}>
        <View style={styles.form}>
          <Input
            label="NOME COMPLETO"
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Matheus Silva"
            autoCapitalize="words"
          />
          <Input
            label="E-MAIL"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="SENHA"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
          />

          {(formError || error) ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={styles.errorText}>{formError || error}</Text>
            </View>
          ) : null}

          <Button 
            title="CADASTRAR AGORA" 
            onPress={handleRegister} 
            loading={loading} 
            disabled={loading} 
            style={styles.registerButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já faz parte do time?</Text>
          <Pressable onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate(ROUTES.LOGIN);
          }}>
            <Text style={styles.footerLink}> FAZER LOGIN</Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  form: {
    marginTop: spacing.md,
  },
  registerButton: {
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
