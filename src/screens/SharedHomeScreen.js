import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { theme } from "../constants/theme";
import { useAuthStore } from "../store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";

export default function SharedHomeScreen() {
  const { user, activeSharedCalendarId, setActiveSharedCalendarId } =
    useAuthStore();

  const [mySharedCalendars, setMySharedCalendars] = useState([]);
  const [activeCalendarData, setActiveCalendarCardData] = useState(null);

  const [newCalendarName, setNewCalendarName] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

  // 1. Ascolto in tempo reale dei calendari condivisi di cui l'utente è membro
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "shared_calendars"),
      where("members", "array-contains", user.uid),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const calendars = [];
      snapshot.forEach((document) => {
        calendars.push({ id: document.id, ...document.data() });
      });

      setMySharedCalendars(calendars);

      // Se non c'è un calendario attivo selezionato ma ne esiste almeno uno, seleziona il primo
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

  // 2. Mantiene aggiornati i dettagli del calendario attivo
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

  // Creazione di un nuovo calendario condiviso
  const handleCreateCalendar = async () => {
    if (!newCalendarName.trim()) {
      setErrorMsg("Inserisci un nome per il calendario");
      return;
    }

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
      console.error("Errore creazione calendario:", error);
      setErrorMsg("Errore durante la creazione del calendario.");
    } finally {
      setLoading(false);
    }
  };

  // Partecipazione a un calendario tramite OTP
  const handleJoinCalendar = async () => {
    const cleanOtp = otpInput.trim();
    if (!cleanOtp) {
      setErrorMsg("Inserisci il codice OTP");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const calRef = doc(db, "shared_calendars", cleanOtp);
      const calSnap = await getDoc(calRef);

      if (!calSnap.exists()) {
        setErrorMsg("Codice OTP non valido o calendario inesistente");
        setLoading(false);
        return;
      }

      const calData = calSnap.data();
      if (calData.members && calData.members.includes(user.uid)) {
        setErrorMsg("Sei già membro di questo calendario");
        setActiveSharedCalendarId(cleanOtp);
        setOtpInput("");
        setLoading(false);
        return;
      }

      // Aggiunge l'utente all'array dei membri
      await updateDoc(calRef, {
        members: arrayUnion(user.uid),
      });

      setOtpInput("");
      setActiveSharedCalendarId(cleanOtp);
    } catch (error) {
      console.error("Errore partecipazione calendario:", error);
      setErrorMsg("Impossibile unirse al calendario.");
    } finally {
      setLoading(false);
    }
  };

  // Abbandono del calendario condiviso
  const handleLeaveCalendar = async () => {
    if (!activeSharedCalendarId) return;

    if (
      window.confirm(
        "Sei sicuro di voler uscire da questo calendario condiviso?",
      )
    ) {
      try {
        const calRef = doc(db, "shared_calendars", activeSharedCalendarId);
        await updateDoc(calRef, {
          members: arrayRemove(user.uid),
        });
        setIsInfoModalVisible(false);
      } catch (error) {
        console.error("Errore abbandono calendario:", error);
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
      {/* Header Schermata Condivisa */}
      <View style={styles.header}>
        <Text style={styles.title}>Area Condivisa</Text>
        {activeCalendarData ? (
          <TouchableOpacity
            onPress={() => setIsInfoModalVisible(true)}
            style={styles.infoButton}
          >
            <Ionicons
              name="information-circle-outline"
              size={28}
              color={theme.colors.primaryShared}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {errorMsg !== "" ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      <ScrollView style={styles.scrollContent}>
        {/* Selettore Calendario Attivo (se ce n'è più di uno) */}
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

        {/* Card Dettaglio Calendario Corrente */}
        {activeCalendarData ? (
          <View style={styles.activeCard}>
            <Text style={styles.activeCardTitle}>
              {activeCalendarData.name}
            </Text>
            <Text style={styles.activeCardSub}>
              Membri collegati: {activeCalendarData.members?.length || 1}
            </Text>

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
              Non sei ancora collegato a nessun calendario condiviso. Creane uno
              o inserisci un codice OTP.
            </Text>
          </View>
        )}

        {/* Box per Creare o Partecipare */}
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
              <Text style={styles.buttonTextSecondary}>
                Unisciti al Calendario
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Text style={styles.hint}>
        ← Fai swipe verso destra per l'Area Privata
      </Text>

      {/* Modale Informazioni Calendario */}
      <Modal
        visible={isInfoModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Info Calendario</Text>
            {activeCalendarData ? (
              <>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>Nome:</Text>{" "}
                  {activeCalendarData.name}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>Codice OTP:</Text>{" "}
                  {activeSharedCalendarId}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={{ fontWeight: "bold" }}>Totale Membri:</Text>{" "}
                  {activeCalendarData.members?.length || 1}
                </Text>
              </>
            ) : null}

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.leaveButton}
                onPress={handleLeaveCalendar}
              >
                <Text style={styles.leaveButtonText}>Esci dal Calendario</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setIsInfoModalVisible(false)}
              >
                <Text style={styles.closeModalButtonText}>Chiudi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  infoButton: {
    padding: 4,
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
  scrollContent: {
    paddingHorizontal: theme.spacing.l,
  },
  sectionBox: {
    marginBottom: theme.spacing.m,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.s,
  },
  chipsRow: {
    flexDirection: "row",
  },
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
  chipText: {
    fontSize: 14,
    color: theme.colors.textMain,
  },
  chipTextActive: {
    fontWeight: "bold",
    color: theme.colors.primaryShared,
  },
  activeCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.m,
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
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
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
  hint: {
    textAlign: "center",
    marginVertical: theme.spacing.m,
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: theme.spacing.l,
  },
  modalCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.l,
    gap: theme.spacing.m,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.textMain,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: theme.colors.textMain,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.m,
    gap: theme.spacing.m,
  },
  leaveButton: {
    backgroundColor: "#FFE5E5",
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.button,
    flex: 1,
    alignItems: "center",
  },
  leaveButtonText: {
    color: theme.colors.error,
    fontWeight: "bold",
  },
  closeModalButton: {
    backgroundColor: theme.colors.sharedBackground,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.button,
    flex: 1,
    alignItems: "center",
  },
  closeModalButtonText: {
    color: theme.colors.textMain,
    fontWeight: "bold",
  },
});
