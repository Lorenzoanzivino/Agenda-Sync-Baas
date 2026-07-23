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
import { PaletteColori } from "../palette_e_testi/PaletteColori";
import { Testi } from "../palette_e_testi/Testi";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/useAuthStore";

// Importiamo l'utility di conferma nativa
import { confermaAzione } from "../utils/alertUtils";

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

  const handleSvuotaTutte = () => {
    if (notifiche.length === 0) return;
    
    // Utilizziamo il nuovo alert cross-platform
    confermaAzione("Vuoi eliminare tutte le notifiche di questo calendario?", async () => {
      const batch = writeBatch(db);
      notifiche.forEach((n) => {
        batch.delete(doc(db, "inapp_notifications", n.id));
      });
      await batch.commit();
    });
  };

  return (
    <View style={styles.bellContainer}>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <Ionicons
          name="notifications-outline"
          size={28}
          color={PaletteColori.condiviso.textMain}
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
                  color={PaletteColori.condiviso.textSecondary}
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
                        color={PaletteColori.condiviso.error}
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
    marginRight: PaletteColori.spacing.m,
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: PaletteColori.condiviso.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: PaletteColori.condiviso.background,
  },
  badgeText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: PaletteColori.spacing.l,
  },
  modalCard: {
    backgroundColor: PaletteColori.condiviso.cardBackground,
    borderRadius: PaletteColori.borderRadius.card,
    padding: PaletteColori.spacing.l,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: PaletteColori.spacing.m,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: PaletteColori.condiviso.textMain,
  },
  clearAllButton: {
    alignSelf: "flex-end",
    marginBottom: PaletteColori.spacing.s,
  },
  clearAllText: {
    color: PaletteColori.condiviso.error,
    fontWeight: "bold",
    fontSize: 14,
  },
  scrollArea: { marginTop: PaletteColori.spacing.s },
  emptyText: {
    color: PaletteColori.condiviso.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: PaletteColori.spacing.m,
  },
  notifItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PaletteColori.condiviso.background,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.card,
    marginBottom: PaletteColori.spacing.s,
  },
  notifUnread: {
    backgroundColor: "#FFE0B2",
    borderWidth: 1,
    borderColor: PaletteColori.condiviso.primary,
  },
  notifContent: { flex: 1 },
  notifTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: PaletteColori.condiviso.textMain,
    marginBottom: 2,
  },
  notifMessage: {
    fontSize: 13,
    color: PaletteColori.condiviso.textSecondary,
    marginBottom: 4,
  },
  notifDate: {
    fontSize: 12,
    color: PaletteColori.condiviso.primary,
    fontWeight: "bold",
  },
  deleteButton: { padding: 8, marginLeft: PaletteColori.spacing.s },
});