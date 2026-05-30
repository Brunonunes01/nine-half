import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Badge from '../../ui/Badge';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { shadows } from '../../../theme/shadows';
import { spacing } from '../../../theme/spacing';
import { getUserById } from '../../../services/userService';

export default function ShowcaseCard({ showcase }: { showcase: any }) {
  const [owner, setOwner] = useState<any>(null);

  useEffect(() => {
    if (showcase?.userId) {
      getUserById(showcase.userId).then(setOwner);
    }
  }, [showcase?.userId]);

  if (!showcase) return null;

  const isVisible = !!showcase.visivel;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="storefront" size={24} color={colors.secondary} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{showcase.nome}</Text>
          <Text style={styles.ownerText}>
            Dono: <Text style={styles.ownerName}>{owner?.nome || 'Carregando...'}</Text>
          </Text>
          <Text style={styles.subtitle}>
            {isVisible ? 'Visível para a comunidade' : 'Privada apenas para você'}
          </Text>
        </View>
        <View style={styles.right}>
          <Badge label={isVisible ? 'publica' : 'privada'} />
          {owner?.cidade ? (
            <View style={styles.location}>
              <Ionicons name="location-outline" size={10} color={colors.textSecondary} />
              <Text style={styles.locationText}>{owner.cidade}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.secondarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  ownerText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ownerName: {
    fontWeight: '700',
    color: colors.secondary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    fontWeight: '500',
  },
  right: {
    alignItems: 'flex-end',
    gap: 8,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  locationText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  }
});
