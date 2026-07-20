import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { auth } from "../config/firebase";
import { theme } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function PrivateTodayScreen() {
  const today = new Date().toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Oggi</Text>
        <TouchableOpacity onPress={() => auth.signOut()}>
          <Ionicons
            name="log-out-outline"
            size={28}
            color={theme.colors.error}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.bentoCard}>
          <Text style={styles.dateText}>{today}</Text>
          <Text style={styles.emptyText}>
            Nessun task per oggi (In attesa del Task 4.2)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.privateBackground,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.l,
    paddingBottom: theme.spacing.s,
    paddingTop: theme.spacing.l * 2, // Spazio per la status bar
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.primaryPrivate,
  },
  scrollContent: {
    padding: theme.spacing.l,
  },
  bentoCard: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.card,
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.textMain,
    textTransform: "capitalize",
    marginBottom: theme.spacing.m,
  },
  emptyText: {
    color: theme.colors.textSecondary,
  },
});
