import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Badge from '../../ui/Badge';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { shadows } from '../../../theme/shadows';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { getUserById } from '../../../services/userService';

export default function ShowcaseCard({ showcase }: { showcase: any }) {
  const [owner, setOwner] = useState<any>(null);

  useEffect(() => {
    if (showcase?.userId) {
      getUserById(showcase.userId).then(setOwner);
    }
  }, [showcase?.userId]);

  if (!showcase) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Ionicons name="storefront" size={24} color={colors.primary} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{showcase.nome?.toUpperCase()}</Text>
          <Text style={styles.owner}>
            DONO: <Text style={styles.ownerName}>{owner?.nome?.toUpperCase() || '...'}</Text>
          </Text>
        </View>
        <Badge label={showcase.visivel ? 'publica' : 'privada'} />
      </View>
      
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="location-outline" size={14} color={colors.textCaption} />
          <Text style={styles.footerText}>{owner?.cidade || 'Local não informado'}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="cube-outline" size={14} color={colors.textCaption} />
          <Text style={styles.footerText}>Ver vitrine</Text>
          <Ionicons name="chevron-forward" size={12} color={colors.primary} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.h3,
    fontSize: 16,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.5
  },
  owner: {
    fontSize: 10,
    color: colors.textCaption,
    marginTop: 2,
    fontWeight: '800',
  },
  ownerName: {
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
  }
});
