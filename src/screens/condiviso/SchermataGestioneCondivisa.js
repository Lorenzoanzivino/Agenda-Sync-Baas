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
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  onSnapshot,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { PaletteColori } from "../../palette_e_testi/PaletteColori";
import { Testi } from "../../palette_e_testi/Testi";
import { useAuthStore } from "../../store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";

// Importiamo l'utility di conferma
import { confermaAzione } from "../../utils/alertUtils";

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

  const handleLeaveOrDeleteCalendar = () => {
    if (!activeSharedCalendarId || !activeCalendarData) return;

    const isOwner = activeCalendarData.ownerId === user.uid;

    if (isOwner) {
      confermaAzione(Testi.condiviso.alertEliminaCalendario, async () => {
        try {
          const qTasks = query(
            collection(db, "shared_tasks"),
            where("calendarId", "==", activeSharedCalendarId),
          );
          const snapTasks = await getDocs(qTasks);
          const batch = writeBatch(db);
          snapTasks.forEach((t) => batch.delete(doc(db, "shared_tasks", t.id)));
          await batch.commit();

          await deleteDoc(doc(db, "shared_calendars", activeSharedCalendarId));
        } catch (error) {
          console.error("Errore eliminazione calendario:", error);
          setErrorMsg("Errore durante l'eliminazione.");
        }
      });
    } else {
      confermaAzione(Testi.condiviso.alertEsciCalendario, async () => {
        try {
          const calRef = doc(db, "shared_calendars", activeSharedCalendarId);
          await updateDoc(calRef, { members: arrayRemove(user.uid) });
        } catch (error) {
          console.error("Errore uscita calendario:", error);
          setErrorMsg("Errore durante l'uscita dal calendario.");
        }
      });
    }
  };

  const copyOtpToClipboard = () => {
    if (activeSharedCalendarId) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(activeSharedCalendarId);
        alert(Testi.alert.otpCopiato);
      } else {
        alert(`${Testi.alert.otpCode} ${activeSharedCalendarId}`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{Testi.condiviso.gestioneTitle}</Text>
      </View>

      {errorMsg !== "" ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {mySharedCalendars.length > 0 ? (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionLabel}>{Testi.condiviso.sezioneITuoiCalendari}</Text>
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
                  {Testi.condiviso.membri} {activeCalendarData.members?.length || 1}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleLeaveOrDeleteCalendar}
                style={styles.deleteButton}
              >
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color={PaletteColori.condiviso.error}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.otpBox}
              onPress={copyOtpToClipboard}
            >
              <Text style={styles.otpLabel}>
                {Testi.condiviso.otpLabel}
              </Text>
              <View style={styles.otpCodeRow}>
                <Text style={styles.otpCodeText}>{activeSharedCalendarId}</Text>
                <Ionicons
                  name="copy-outline"
                  size={20}
                  color={PaletteColori.condiviso.primary}
                />
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              {Testi.condiviso.nessunCalendario}
            </Text>
          </View>
        )}

        <View style={styles.actionCard}>
          <Text style={styles.cardHeaderTitle}>{Testi.condiviso.creaNuovoTitle}</Text>
          <TextInput
            style={styles.input}
            placeholder={Testi.condiviso.nomeCalendarioPlaceholder}
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
              <Text style={styles.buttonText}>{Testi.condiviso.btnCreaGenera}</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.actionCard}>
          <Text style={styles.cardHeaderTitle}>{Testi.condiviso.uniscitiTitle}</Text>
          <TextInput
            style={styles.input}
            placeholder={Testi.condiviso.otpPlaceholder}
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
              <Text style={styles.buttonTextSecondary}>{Testi.condiviso.btnUnisciti}</Text>
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
    backgroundColor: PaletteColori.condiviso.background,
    paddingTop: PaletteColori.spacing.l * 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: PaletteColori.spacing.l,
    marginBottom: PaletteColori.spacing.m,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: PaletteColori.condiviso.primary,
  },
  errorBanner: {
    backgroundColor: "#FFE5E5",
    padding: PaletteColori.spacing.m,
    marginHorizontal: PaletteColori.spacing.l,
    borderRadius: PaletteColori.borderRadius.input,
    marginBottom: PaletteColori.spacing.m,
  },
  errorText: {
    color: PaletteColori.condiviso.error,
    fontWeight: "bold",
    textAlign: "center",
  },
  scrollContent: { paddingHorizontal: PaletteColori.spacing.l, paddingBottom: 100 },
  sectionBox: { marginBottom: PaletteColori.spacing.m },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: PaletteColori.condiviso.textSecondary,
    marginBottom: PaletteColori.spacing.s,
  },
  chipsRow: { flexDirection: "row" },
  chip: {
    backgroundColor: PaletteColori.condiviso.cardBackground,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipActive: {
    borderColor: PaletteColori.condiviso.primary,
    backgroundColor: "#FFE0B2",
  },
  chipText: { fontSize: 14, color: PaletteColori.condiviso.textMain },
  chipTextActive: { fontWeight: "bold", color: PaletteColori.condiviso.primary },
  activeCard: {
    backgroundColor: PaletteColori.condiviso.cardBackground,
    borderRadius: PaletteColori.borderRadius.card,
    padding: PaletteColori.spacing.l,
    marginBottom: PaletteColori.spacing.m,
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
    color: PaletteColori.condiviso.textMain,
  },
  activeCardSub: {
    fontSize: 14,
    color: PaletteColori.condiviso.textSecondary,
    marginTop: 2,
    marginBottom: PaletteColori.spacing.m,
  },
  otpBox: {
    backgroundColor: PaletteColori.condiviso.background,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.input,
  },
  otpLabel: {
    fontSize: 12,
    color: PaletteColori.condiviso.textSecondary,
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
    color: PaletteColori.condiviso.primary,
  },
  emptyCard: {
    backgroundColor: PaletteColori.condiviso.cardBackground,
    borderRadius: PaletteColori.borderRadius.card,
    padding: PaletteColori.spacing.l,
    marginBottom: PaletteColori.spacing.m,
    alignItems: "center",
  },
  emptyText: {
    color: PaletteColori.condiviso.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
  },
  actionCard: {
    backgroundColor: PaletteColori.condiviso.cardBackground,
    borderRadius: PaletteColori.borderRadius.card,
    padding: PaletteColori.spacing.l,
    marginBottom: PaletteColori.spacing.m,
  },
  cardHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: PaletteColori.condiviso.textMain,
    marginBottom: PaletteColori.spacing.m,
  },
  input: {
    backgroundColor: PaletteColori.condiviso.background,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.input,
    fontSize: 16,
    marginBottom: PaletteColori.spacing.m,
  },
  buttonPrimary: {
    backgroundColor: PaletteColori.condiviso.primary,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.button,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  buttonSecondary: {
    backgroundColor: PaletteColori.condiviso.background,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.button,
    alignItems: "center",
    borderWidth: 1,
    borderColor: PaletteColori.condiviso.primary,
  },
  buttonTextSecondary: {
    color: PaletteColori.condiviso.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
});