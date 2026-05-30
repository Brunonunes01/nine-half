import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';

const SkeletonPiece = ({ style }: any) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return <Animated.View style={[styles.piece, style, { opacity }]} />;
};

export const ProductCardSkeleton = () => {
  return (
    <View style={styles.card}>
      <SkeletonPiece style={styles.imageBox} />
      <View style={styles.info}>
        <SkeletonPiece style={{ width: '40%', height: 10, borderRadius: 4 }} />
        <SkeletonPiece style={{ width: '80%', height: 20, borderRadius: 4, marginTop: 8 }} />
        <SkeletonPiece style={{ width: '60%', height: 20, borderRadius: 4, marginTop: 4 }} />
        <View style={styles.footer}>
          <SkeletonPiece style={{ width: '50%', height: 24, borderRadius: 4 }} />
          <SkeletonPiece style={{ width: 32, height: 32, borderRadius: 16 }} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  piece: {
    backgroundColor: colors.border,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  imageBox: {
    height: 180,
  },
  info: {
    padding: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
});
