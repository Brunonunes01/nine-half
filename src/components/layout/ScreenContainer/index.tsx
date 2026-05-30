import React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export default function ScreenContainer({
  children,
  scroll = false
}: {
  children: React.ReactNode;
  scroll?: boolean;
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.bgOrbTop} />
      <View style={styles.bgOrbBottom} />
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scroll ? (
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        ) : (
          <View style={styles.content}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background
  },
  bgOrbTop: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(252, 76, 2, 0.08)',
    top: -80,
    right: -60
  },
  bgOrbBottom: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(17, 24, 39, 0.06)',
    bottom: -100,
    left: -80
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl
  }
});
