import React from 'react';
import { 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  View, 
  ViewStyle, 
  StatusBar 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

type ScreenContainerProps = {
  children: React.ReactNode;
  scroll?: boolean;
  withPadding?: boolean;
  style?: ViewStyle;
  backgroundColor?: string;
};

export default function ScreenContainer({
  children,
  scroll = false,
  withPadding = true,
  style,
  backgroundColor = colors.background, // Pure Black
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    { backgroundColor },
    style
  ];

  const contentStyle = [
    styles.content,
    withPadding && styles.padding,
    !scroll && { flex: 1 }
  ];

  return (
    <View style={containerStyle}>
      <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scroll ? (
          <ScrollView 
            contentContainerStyle={[contentStyle, { paddingBottom: insets.bottom + spacing.xl }]} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={{ paddingTop: insets.top }}>
              {children}
            </View>
          </ScrollView>
        ) : (
          <View style={[contentStyle, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            {children}
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    width: '100%',
  },
  padding: {
    paddingHorizontal: spacing.md,
  }
});
