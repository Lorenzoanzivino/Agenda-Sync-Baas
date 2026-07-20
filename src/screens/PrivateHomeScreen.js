import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { auth } from "../config/firebase";
import { theme } from "../constants/theme";

export default function PrivateHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Area Privata</Text>
      <Text style={styles.subtitle}>
        Fai swipe verso sinistra per la Condivisa ➔
      </Text>

      <TouchableOpacity
        onPress={() => auth.signOut()}
        style={styles.logoutButton}
      >
        <Text style={styles.logoutText}>Esci / Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.privateBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.primaryPrivate,
  },
  subtitle: {
    marginTop: theme.spacing.m,
    color: theme.colors.textSecondary,
  },
  logoutButton: {
    marginTop: theme.spacing.l,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.button,
  },
  logoutText: {
    color: theme.colors.error,
    fontWeight: "bold",
  },
});
