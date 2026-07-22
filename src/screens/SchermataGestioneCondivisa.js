import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs, // <- IL BUG ERA QUI! Mancava l'import!
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  onSnapshot,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { theme } from "../constants/theme";
import { useAuthStore } from "../store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";

export default function SchermataGestioneCondivisa() {
  const { user, activeSharedCalendarId, setActiveSharedCalendarId } =
    useAuthStore();

  const [mySharedCalendars, setMySharedCalendars] = useState([]);
  const [activeCalendarData, setActiveCalendarCardData] = useState(null);

  const [newCalendarName, setNewCalendarName] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "shared_calendars"),
      where("members", "array-contains", user.uid),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const calendars = [];
      snapshot.forEach((document) =>
        calendars.push({ id: document.id, ...document.data() }),
      );
      setMySharedCalendars(calendars);

      if (calendars.length > 0) {
        const isStillValid = calendars.some(
          (c) => c.id === activeSharedCalendarId,
        );
        if (!activeSharedCalendarId || !isStillValid) {
          setActiveSharedCalendarId(calendars[0].id);
        }
      } else {
        setActiveSharedCalendarId(null);
      }
    });
    return () => unsubscribe();
  }, [user, activeSharedCalendarId]);

  useEffect(() => {
    if (activeSharedCalendarId && mySharedCalendars.length > 0) {
      const current = mySharedCalendars.find(
        (c) => c.id === activeSharedCalendarId,
      );
      setActiveCalendarCardData(current || null);
    } else {
      setActiveCalendarCardData(null);
    }
  }, [activeSharedCalendarId, mySharedCalendars]);

  const handleCreateCalendar = async () => {
    if (!newCalendarName.trim()) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const docRef = await addDoc(collection(db, "shared_calendars"), {
        name: newCalendarName.trim(),
        ownerId: user.uid,
        members: [user.uid],
        createdAt: new Date().toISOString(),
      });
      setNewCalendarName("");
      setActiveSharedCalendarId(docRef.id);
    } catch (error) {
      setErrorMsg("Errore durante la creazione del calendario.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCalendar = async () => {
    const cleanOtp = otpInput.trim();
    if (!cleanOtp) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const calRef = doc(db, "shared_calendars", cleanOtp);
      const calSnap = await getDoc(calRef);

      if (!calSnap.exists()) {
        setErrorMsg("Codice OTP non valido");
        setLoading(false);
        return;
      }

      const calData = calSnap.data();
      if (calData.members && calData.members.includes(user.uid)) {
        setErrorMsg("Sei già membro");
        setActiveSharedCalendarId(cleanOtp);
        setOtpInput("");
        setLoading(false);
        return;
      }

      await updateDoc(calRef, { members: arrayUnion(user.uid) });
      setOtpInput("");
      setActiveSharedCalendarId(cleanOtp);
    } catch (error) {
      setErrorMsg("Impossibile unirse al calendario.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveOrDeleteCalendar = async () => {
    if (!activeSharedCalendarId || !activeCalendarData) return;

    const isOwner = activeCalendarData.ownerId === user.uid;

    if (isOwner) {
      if (
        window.confirm(
          "Sei il proprietario di questo calendario. Vuoi ELIMINARE definitivamente il calendario e tutti i suoi task per tutti i membri?",
        )
      ) {
        try {
          // Elimina tutti i task collegati al calendario
          const qTasks = query(
            collection(db, "shared_tasks"),
            where("calendarId", "==", activeSharedCalendarId),
          );
          const snapTasks = await getDocs(qTasks);
          const batch = writeBatch(db);
          snapTasks.forEach((t) => batch.delete(doc(db, "shared_tasks", t.id)));
          await batch.commit();

          // Elimina il calendario stesso
          await deleteDoc(doc(db, "shared_calendars", activeSharedCalendarId));
        } catch (error) {
          console.error("Errore eliminazione calendario:", error);
          setErrorMsg("Errore durante l'eliminazione.");
        }
      }
    } else {
      if (
        window.confirm(
          "Vuoi USCIRE da questo calendario condiviso? Non vedrai più i suoi eventi.",
        )
      ) {
        try {
          const calRef = doc(db, "shared_calendars", activeSharedCalendarId);
          await updateDoc(calRef, { members: arrayRemove(user.uid) });
        } catch (error) {
          console.error("Errore uscita calendario:", error);
          setErrorMsg("Errore durante l'uscita dal calendario.");
        }
      }
    }
  };

  const copyOtpToClipboard = () => {
    if (activeSharedCalendarId) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(activeSharedCalendarId);
        alert("Codice OTP copiato negli appunti!");
      } else {
        alert(`Codice OTP: ${activeSharedCalendarId}`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestione</Text>
      </View>

      {errorMsg !== "" ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {mySharedCalendars.length > 0 ? (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionLabel}>I Tuoi Calendari Condivisi:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsRow}
            >
              {mySharedCalendars.map((cal) => (
                <TouchableOpacity
                  key={cal.id}
                  style={[
                    styles.chip,
                    activeSharedCalendarId === cal.id && styles.chipActive,
                  ]}
                  onPress={() => setActiveSharedCalendarId(cal.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      activeSharedCalendarId === cal.id &&
                        styles.chipTextActive,
                    ]}
                  >
                    {cal.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {activeCalendarData ? (
          <View style={styles.activeCard}>
            <View style={styles.activeCardHeader}>
              <View>
                <Text style={styles.activeCardTitle}>
                  {activeCalendarData.name}
                </Text>
                <Text style={styles.activeCardSub}>
                  Membri: {activeCalendarData.members?.length || 1}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleLeaveOrDeleteCalendar}
                style={styles.deleteButton}
              >
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color={theme.colors.error}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.otpBox}
              onPress={copyOtpToClipboard}
            >
              <Text style={styles.otpLabel}>
                Codice OTP (Tocca per copiare):
              </Text>
              <View style={styles.otpCodeRow}>
                <Text style={styles.otpCodeText}>{activeSharedCalendarId}</Text>
                <Ionicons
                  name="copy-outline"
                  size={20}
                  color={theme.colors.primaryShared}
                />
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Non sei collegato a nessun calendario condiviso.
            </Text>
          </View>
        )}

        <View style={styles.actionCard}>
          <Text style={styles.cardHeaderTitle}>Crea Nuovo Calendario</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome calendario (es. Casa, Lavoro...)"
            value={newCalendarName}
            onChangeText={setNewCalendarName}
          />
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={handleCreateCalendar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Crea e Genera OTP</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.actionCard}>
          <Text style={styles.cardHeaderTitle}>Unisciti con Codice OTP</Text>
          <TextInput
            style={styles.input}
            placeholder="Incolla qui il codice OTP..."
            value={otpInput}
            onChangeText={setOtpInput}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={handleJoinCalendar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonTextSecondary}>Unisciti</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.sharedBackground,
    paddingTop: theme.spacing.l * 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.l,
    marginBottom: theme.spacing.m,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.primaryShared,
  },
  errorBanner: {
    backgroundColor: "#FFE5E5",
    padding: theme.spacing.m,
    marginHorizontal: theme.spacing.l,
    borderRadius: theme.borderRadius.input,
    marginBottom: theme.spacing.m,
  },
  errorText: {
    color: theme.colors.error,
    fontWeight: "bold",
    textAlign: "center",
  },
  scrollContent: { paddingHorizontal: theme.spacing.l, paddingBottom: 100 },
  sectionBox: { marginBottom: theme.spacing.m },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.s,
  },
  chipsRow: { flexDirection: "row" },
  chip: {
    backgroundColor: theme.colors.cardBackground,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipActive: {
    borderColor: theme.colors.primaryShared,
    backgroundColor: "#FFE0B2",
  },
  chipText: { fontSize: 14, color: theme.colors.textMain },
  chipTextActive: { fontWeight: "bold", color: theme.colors.primaryShared },
  activeCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.m,
  },
  activeCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#FFE5E5",
    borderRadius: 12,
  },
  activeCardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.textMain,
  },
  activeCardSub: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
    marginBottom: theme.spacing.m,
  },
  otpBox: {
    backgroundColor: theme.colors.sharedBackground,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.input,
  },
  otpLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  otpCodeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  otpCodeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primaryShared,
  },
  emptyCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.m,
    alignItems: "center",
  },
  emptyText: {
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
  },
  actionCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.m,
  },
  cardHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.textMain,
    marginBottom: theme.spacing.m,
  },
  input: {
    backgroundColor: theme.colors.sharedBackground,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.input,
    fontSize: 16,
    marginBottom: theme.spacing.m,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primaryShared,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.button,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  buttonSecondary: {
    backgroundColor: theme.colors.sharedBackground,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.button,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.primaryShared,
  },
  buttonTextSecondary: {
    color: theme.colors.primaryShared,
    fontWeight: "bold",
    fontSize: 16,
  },
});
