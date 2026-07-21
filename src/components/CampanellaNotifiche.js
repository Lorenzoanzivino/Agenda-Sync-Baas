import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { theme } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/useAuthStore";

export default function CampanellaNotifiche({ onNavigateToDate }) {
  const { user, activeSharedCalendarId } = useAuthStore();
  const [notifiche, setNotifiche] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (!user || !activeSharedCalendarId) return;

    const q = query(
      collection(db, "inapp_notifications"),
      where("userId", "==", user.uid),
      where("calendarId", "==", activeSharedCalendarId),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dati = [];
      snapshot.forEach((document) => {
        dati.push({ id: document.id, ...document.data() });
      });
      // Ordina per data di creazione decrescente (più recenti in alto)
      dati.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifiche(dati);
    });

    return () => unsubscribe();
  }, [user, activeSharedCalendarId]);

  const notificheNonLette = notifiche.filter((n) => !n.isRead).length;

  const handlePressNotifica = async (notifica) => {
    if (!notifica.isRead) {
      await updateDoc(doc(db, "inapp_notifications", notifica.id), {
        isRead: true,
      });
    }
    setIsModalVisible(false);
    if (onNavigateToDate && notifica.targetDate) {
      onNavigateToDate(notifica.targetDate);
    }
  };

  const handleEliminaNotifica = async (id) => {
    await deleteDoc(doc(db, "inapp_notifications", id));
  };

  const handleSvuotaTutte = async () => {
    if (notifiche.length === 0) return;
    if (
      window.confirm("Vuoi eliminare tutte le notifiche di questo calendario?")
    ) {
      const batch = writeBatch(db);
      notifiche.forEach((n) => {
        batch.delete(doc(db, "inapp_notifications", n.id));
      });
      await batch.commit();
    }
  };

  return (
    <View style={styles.bellContainer}>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <Ionicons
          name="notifications-outline"
          size={28}
          color={theme.colors.textMain}
        />
        {notificheNonLette > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {notificheNonLette > 99 ? "99+" : notificheNonLette}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <View style={styles.header}>
              <Text style={styles.title}>Notifiche</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons
                  name="close-circle"
                  size={28}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {notifiche.length > 0 ? (
              <TouchableOpacity
                style={styles.clearAllButton}
                onPress={handleSvuotaTutte}
              >
                <Text style={styles.clearAllText}>Svuota tutte</Text>
              </TouchableOpacity>
            ) : null}

            <ScrollView style={styles.scrollArea}>
              {notifiche.length === 0 ? (
                <Text style={styles.emptyText}>Nessuna notifica presente.</Text>
              ) : (
                notifiche.map((notif) => (
                  <View
                    key={notif.id}
                    style={[
                      styles.notifItem,
                      !notif.isRead && styles.notifUnread,
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.notifContent}
                      onPress={() => handlePressNotifica(notif)}
                    >
                      <Text style={styles.notifTitle}>{notif.title}</Text>
                      <Text style={styles.notifMessage}>{notif.message}</Text>
                      {notif.targetDate ? (
                        <Text style={styles.notifDate}>
                          Data evento:{" "}
                          {new Date(notif.targetDate).toLocaleDateString(
                            "it-IT",
                          )}
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleEliminaNotifica(notif.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={theme.colors.error}
                      />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bellContainer: {
    position: "relative",
    marginRight: theme.spacing.m,
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: theme.colors.sharedBackground,
  },
  badgeText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: theme.spacing.l,
  },
  modalCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.l,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.m,
  },
  title: { fontSize: 22, fontWeight: "bold", color: theme.colors.textMain },
  clearAllButton: { alignSelf: "flex-end", marginBottom: theme.spacing.s },
  clearAllText: { color: theme.colors.error, fontWeight: "bold", fontSize: 14 },
  scrollArea: { marginTop: theme.spacing.s },
  emptyText: {
    color: theme.colors.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: theme.spacing.m,
  },
  notifItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.privateBackground,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.card,
    marginBottom: theme.spacing.s,
  },
  notifUnread: {
    backgroundColor: "#FFE0B2",
    borderWidth: 1,
    borderColor: theme.colors.primaryShared,
  },
  notifContent: { flex: 1 },
  notifTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.textMain,
    marginBottom: 2,
  },
  notifMessage: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  notifDate: {
    fontSize: 12,
    color: theme.colors.primaryShared,
    fontWeight: "bold",
  },
  deleteButton: { padding: 8, marginLeft: theme.spacing.s },
});
