import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { useAuthStore } from '../store/useAuthStore';

export default function SharedHomeScreen() {
  const { activeSharedCalendarId } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Area Condivisa</Text>
      <Text style={styles.subtitle}>
        {activeSharedCalendarId ? `Calendario: ${activeSharedCalendarId}` : 'Nessun calendario condiviso attivo'}
      </Text>
      <Text style={styles.hint}>← Fai swipe verso destra per la Privata</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.sharedBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primaryShared,
  },
  subtitle: {
    marginTop: theme.spacing.m,
    color: theme.colors.textMain,
    fontWeight: 'bold',
  },
  hint: {
    marginTop: theme.spacing.l,
    color: theme.colors.textSecondary,
  }
});