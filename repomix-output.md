This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching these patterns are excluded: node_modules/**, .git/**, .expo/**, assets/**, package-lock.json, docs/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>

<directory_structure>
.claude/
  settings.json
src/
  components/
    CampanellaNotifiche.js
    DayDetailsModal.js
    FixedTaskModal.js
    ModaleDettagliCondiviso.js
    ModaleTaskCondiviso.js
    TaskModal.js
    TimePickerModal.js
  config/
    firebase.js
  navigation/
    MainNavigator.js
    NavigatoreCondiviso.js
    PrivateNavigator.js
  palette_e_testi/
    PaletteColori.js
    Testi.js
  screens/
    condiviso/
      SchermataCalendarioCondiviso.js
      SchermataGestioneCondivisa.js
      SchermataOggiCondivisa.js
    privato/
      PrivateCalendarScreen.js
      PrivateTodayScreen.js
    LoginScreen.js
    RegisterScreen.js
  store/
    useAuthStore.js
  utils/
    notificheUtils.js
.env.example
.gitignore
App.js
app.json
firestore.rules
index.js
LICENSE
package.json
README.md
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path=".claude/settings.json">
{
  "enabledPlugins": {
    "expo@claude-plugins-official": true
  }
}
</file>

<file path="src/config/firebase.js">
import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const auth = Platform.OS === 'web'
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });

const db = getFirestore(app);

export { auth, db };
</file>

<file path="src/palette_e_testi/PaletteColori.js">
export const PaletteColori = {
  // 1. Palette per Schermate di Login e Registrazione
  auth: {
    background: "#F2F2F7",
    cardBackground: "#FFFFFF",
    primary: "#0A84FF",
    textMain: "#1C1C1E",
    textSecondary: "#8E8E93",
    error: "#FF3B30",
  },

  // 2. Palette per Area Privata (Oggi e Calendario)
  privato: {
    background: "#F2F2F7",
    cardBackground: "#FFFFFF",
    primary: "#0A84FF",
    textMain: "#1C1C1E",
    textSecondary: "#8E8E93",
    error: "#FF3B30",
    birthdayBadge: "#FF69B4", // Aggiunto per il modulo compleanno
    birthdayBackground: "#FFF0F5",
  },

  // 3. Palette per Area Condivisa (Gestione, Oggi, Calendario)
  condiviso: {
    background: "#FFF3E0",
    cardBackground: "#FFFFFF",
    primary: "#FF9500",
    textMain: "#1C1C1E",
    textSecondary: "#8E8E93",
    error: "#FF3B30",
  },

  // Dimensioni e Spaziature Globali (Comuni a tutte le app)
  spacing: {
    s: 8,
    m: 16,
    l: 24,
  },
  borderRadius: {
    card: 24,
    button: 16,
    input: 12,
  },
};
</file>

<file path="src/palette_e_testi/Testi.js">
export const Testi = {
  // --- AUTENTICAZIONE (Login & Register) ---
  auth: {
    loginTitle: "Bentornato",
    registerTitle: "Crea Account",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    usernamePlaceholder: "Username",
    birthDatePlaceholder: "Data di nascita (es. 09-09-1997)",
    loginButton: "Accedi",
    registerButton: "Registrati",
    linkToRegister: "Non hai un account? Registrati",
    linkToLogin: "Hai già un account? Accedi",
    errorFillAll: "Compila tutti i campi",
    errorInvalidDate: "Formato data non valido. Usa DD-MM-YYYY (es. 09-09-1997)",
    errorLogin: "Errore durante il login",
    errorRegister: "Errore durante la registrazione",
  },

  // --- AREA PRIVATA ---
  privato: {
    oggiTitle: "Oggi",
    calendarioTitle: "Calendario",
    nessunTaskOggi: "Nessun task per oggi",
    sezioneEventiFissi: "I Tuoi Eventi Fissi",
    nessunEventoFisso: "Crea un evento fisso per inserirlo velocemente nel calendario.",
    inserisciInDate: "Inserisci in",
    inserisciDateSuf: "date",
    compleannoTitolo: "Tanti Auguri!",
    compleannoTesto: "Oggi è il tuo compleanno! Goditi questa giornata.",
    alertSvuotaOggi: "Sei sicuro di voler svuotare tutti i task di oggi?",
    alertSvuotaCalendario: "Sei sicuro di voler svuotare tutte le caselle del calendario dai task?",
    alertSvuotaFissi: "Sei sicuro di voler svuotare l'intera lista dei task fissi?",
  },

  // --- AREA CONDIVISA ---
  condiviso: {
    gestioneTitle: "Gestione",
    oggiTitle: "Oggi",
    calendarioTitle: "Calendario",
    nessunCalendario: "Nessun calendario collegato. Vai nella sezione Gestione.",
    sezioneITuoiCalendari: "I Tuoi Calendari Condivisi:",
    creaNuovoTitle: "Crea Nuovo Calendario",
    nomeCalendarioPlaceholder: "Nome calendario (es. Casa, Lavoro...)",
    btnCreaGenera: "Crea e Genera OTP",
    uniscitiTitle: "Unisciti con Codice OTP",
    otpPlaceholder: "Incolla qui il codice OTP...",
    btnUnisciti: "Unisciti",
    otpLabel: "Codice OTP (Tocca per copiare):",
    membri: "Membri:",
    nessunTaskOggi: "Nessun task condiviso per oggi",
    sezioneEventiFissi: "I Tuoi Eventi Fissi (Personali)",
    nessunEventoFisso: "Crea un evento fisso personale per inserirlo velocemente in più date.",
    alertSvuotaOggi: 'Sei sicuro di voler svuotare tutti i task di oggi per il calendario',
    alertSvuotaCalendario: 'Vuoi svuotare interamente il calendario',
    alertEsciCalendario: "Vuoi USCIRE da questo calendario condiviso? Non vedrai più i suoi eventi.",
    alertEliminaCalendario: "Sei il proprietario di questo calendario. Vuoi ELIMINARE definitivamente il calendario e tutti i suoi task per tutti i membri?",
  },

  // --- COMPONENTI GLOBALI E MODALI ---
  modali: {
    tuttoIlGiorno: "Tutto il giorno",
    oraInizio: "Ora Inizio",
    oraFine: "Ora Fine",
    descrizioneOptional: "Descrizione (Opzionale)",
    descrizionePlaceholder: "Aggiungi dettagli...",
    urlOptional: "URL (Opzionale)",
    urlPlaceholder: "https://...",
    colore: "Colore",
    titoloPlaceholder: "Titolo *",
    importaFisso: "Importa da Evento Fisso:",
    btnAnnulla: "Annulla",
    btnSalva: "Salva",
    btnEsci: "Esci",
    btnChiudi: "Chiudi",
    nuovoTaskCondiviso: "Nuovo Task Condiviso",
    modificaTaskCondiviso: "Modifica Task Condiviso",
    nuovoTaskPrivato: "Nuovo Task",
    modificaTaskPrivato: "Modifica Task",
    nuovoEventoFisso: "Nuovo Evento Fisso",
    modificaEventoFisso: "Modifica Evento Fisso",
    nessunEventoData: "Nessun evento in questa data.",
    erroreInizioFine: "La data di inizio non può superare la fine",
    erroreConflittoDate: "Questo evento è già presente nelle date:",
    alertEliminaTask: "Vuoi davvero eliminare questo task?",
  },

  // --- MESSAGGI DI SISTEMA ---
  alert: {
    otpCopiato: "Codice OTP copiato negli appunti!",
    otpCode: "Codice OTP:",
    erroreLink: "Impossibile aprire il link. Verifica che l'URL sia corretto (es: https://...)",
  }
};
</file>

<file path="src/screens/condiviso/SchermataCalendarioCondiviso.js">
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { PaletteColori } from "../../palette_e_testi/PaletteColori";
import { Testi } from "../../palette_e_testi/Testi";
import { useAuthStore } from "../../store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";

import ModaleDettagliCondiviso from "../../components/ModaleDettagliCondiviso";
import ModaleTaskCondiviso from "../../components/ModaleTaskCondiviso";
import FixedTaskModal from "../../components/FixedTaskModal";
import CampanellaNotifiche from "../../components/CampanellaNotifiche";
import { inviaNotificaIscritti } from "../../utils/notificheUtils";

LocaleConfig.locales["it"] = {
  monthNames: [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ],
  monthNamesShort: [
    "Gen",
    "Feb",
    "Mar",
    "Apr",
    "Mag",
    "Giu",
    "Lug",
    "Ago",
    "Set",
    "Ott",
    "Nov",
    "Dic",
  ],
  dayNames: [
    "Domenica",
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
  today: Testi.condiviso.oggiTitle,
};
LocaleConfig.defaultLocale = "it";

export default function SchermataCalendarioCondiviso() {
  const { user, activeSharedCalendarId, setActiveSharedCalendarId } =
    useAuthStore();
  const route = useRoute();
  const navigation = useNavigation();

  const [calendarName, setCalendarName] = useState("");
  const [allSharedTasks, setAllSharedTasks] = useState([]);
  const [personalFixedTasks, setPersonalFixedTasks] = useState([]);

  const [selectedDates, setSelectedDates] = useState({});
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [isInserting, setIsInserting] = useState(false);
  const [errorBanner, setErrorBanner] = useState("");

  const [isDayModalVisible, setIsDayModalVisible] = useState(false);
  const [selectedDayDate, setSelectedDayDate] = useState(null);
  const [dayTasks, setDayTasks] = useState([]);

  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [isFixedModalVisible, setFixedModalVisible] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState(null);

  const nomeUtente = user?.email?.split("@")[0] || "Un membro";
  const todayISO = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (route.params?.selectedDateToOpen) {
      setSelectedDayDate(route.params.selectedDateToOpen);
      setIsDayModalVisible(true);
      navigation.setParams({ selectedDateToOpen: undefined });
    }
  }, [route.params?.selectedDateToOpen]);

  useEffect(() => {
    if (!user || activeSharedCalendarId) return;
    const fetchFirstCalendar = async () => {
      const q = query(
        collection(db, "shared_calendars"),
        where("members", "array-contains", user.uid),
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setActiveSharedCalendarId(snap.docs[0].id);
      }
    };
    fetchFirstCalendar();
  }, [user, activeSharedCalendarId]);

  useEffect(() => {
    if (!activeSharedCalendarId) return;
    const unsubscribeCal = onSnapshot(
      doc(db, "shared_calendars", activeSharedCalendarId),
      (docSnap) => {
        if (docSnap.exists()) setCalendarName(docSnap.data().name);
      },
    );
    return () => unsubscribeCal();
  }, [activeSharedCalendarId]);

  useEffect(() => {
    if (!activeSharedCalendarId) return;
    const q = query(
      collection(db, "shared_tasks"),
      where("calendarId", "==", activeSharedCalendarId),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = [];
      snapshot.forEach((document) =>
        tasksData.push({ id: document.id, ...document.data() }),
      );
      setAllSharedTasks(tasksData);
    });
    return () => unsubscribe();
  }, [activeSharedCalendarId]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "fixed_tasks"),
      where("userId", "==", user.uid),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const templates = [];
      snapshot.forEach((document) =>
        templates.push({ id: document.id, ...document.data() }),
      );
      setPersonalFixedTasks(templates);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!activeSharedCalendarId || !selectedDayDate) return;
    const q = query(
      collection(db, "shared_tasks"),
      where("calendarId", "==", activeSharedCalendarId),
      where("date", "==", selectedDayDate),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = [];
      snapshot.forEach((document) =>
        tasksData.push({ id: document.id, ...document.data() }),
      );
      tasksData.sort((a, b) => {
        if (a.isCompleted === b.isCompleted)
          return new Date(a.createdAt) - new Date(b.createdAt);
        return a.isCompleted ? 1 : -1;
      });
      setDayTasks(tasksData);
    });
    return () => unsubscribe();
  }, [activeSharedCalendarId, selectedDayDate]);

  const getMarkedDates = () => {
    const marks = { ...selectedDates };
    const countsByDate = {};
    allSharedTasks.forEach((t) => {
      if (t.date) countsByDate[t.date] = (countsByDate[t.date] || 0) + 1;
    });

    Object.keys(countsByDate).forEach((dateStr) => {
      if (!marks[dateStr]) marks[dateStr] = {};
      marks[dateStr] = {
        ...marks[dateStr],
        customStyles: {
          container: { backgroundColor: "#FFE0B2", borderRadius: 8 },
          text: { color: PaletteColori.condiviso.textMain, fontWeight: "bold" },
        },
      };
    });
    return marks;
  };

  const onDayPress = (day) => {
    const dateString = day.dateString;
    setErrorBanner("");

    if (selectedTemplateId) {
      const newSelectedDates = { ...selectedDates };
      if (newSelectedDates[dateString]) {
        delete newSelectedDates[dateString];
      } else {
        newSelectedDates[dateString] = {
          selected: true,
          selectedColor: PaletteColori.condiviso.primary,
        };
      }
      setSelectedDates(newSelectedDates);
    } else {
      setSelectedDayDate(dateString);
      setIsDayModalVisible(true);
    }
  };

  const toggleTemplateSelection = (taskId) => {
    if (selectedTemplateId === taskId) {
      setSelectedTemplateId(null);
      setSelectedDates({});
    } else {
      setSelectedTemplateId(taskId);
      setSelectedDates({});
    }
    setErrorBanner("");
  };

  const handleBatchInsert = async () => {
    const datesToInsert = Object.keys(selectedDates).filter(
      (k) => selectedDates[k].selected,
    );
    if (datesToInsert.length === 0 || !selectedTemplateId) return;

    const template = personalFixedTasks.find(
      (t) => t.id === selectedTemplateId,
    );
    if (!template) return;

    setIsInserting(true);
    setErrorBanner("");

    try {
      const qCheck = query(
        collection(db, "shared_tasks"),
        where("calendarId", "==", activeSharedCalendarId),
        where("templateId", "==", template.id),
      );
      const existingSnap = await getDocs(qCheck);
      const existingDates = new Set();
      existingSnap.forEach((docSnap) => existingDates.add(docSnap.data().date));

      const conflictingDates = datesToInsert.filter((d) =>
        existingDates.has(d),
      );
      if (conflictingDates.length > 0) {
        setErrorBanner(
          `${Testi.modali.erroreConflittoDate} ${conflictingDates.join(", ")}`,
        );
        setIsInserting(false);
        return;
      }

      await Promise.all(
        datesToInsert.map((dateStr) =>
          addDoc(collection(db, "shared_tasks"), {
            authorId: user.uid,
            calendarId: activeSharedCalendarId,
            templateId: template.id,
            title: template.title,
            color: template.color,
            isAllDay: template.isAllDay,
            startTime: template.startTime,
            endTime: template.endTime,
            description: template.description,
            url: template.url,
            date: dateStr,
            isCompleted: false,
            createdAt: new Date().toISOString(),
          }),
        ),
      );

      await inviaNotificaIscritti({
        calendarId: activeSharedCalendarId,
        currentUserId: user.uid,
        title: "Nuovi Eventi Ricorrenti",
        message: `${nomeUtente} ha inserito l'evento "${template.title}" su ${datesToInsert.length} date.`,
        targetDate: datesToInsert[0],
      });

      setSelectedDates({});
      setSelectedTemplateId(null);
    } catch (error) {
      setErrorBanner("Errore durante l'inserimento nel calendario.");
    } finally {
      setIsInserting(false);
    }
  };

  const deleteTemplate = async (id) => {
    if (window.confirm("Vuoi eliminare questo evento fisso personale?")) {
      await deleteDoc(doc(db, "fixed_tasks", id));
      if (selectedTemplateId === id) {
        setSelectedTemplateId(null);
        setSelectedDates({});
      }
    }
  };

  const resetAllCalendarTasks = async () => {
    if (allSharedTasks.length === 0) return;
    if (
      window.confirm(
        `${Testi.condiviso.alertSvuotaCalendario} "${calendarName}"?`,
      )
    ) {
      try {
        const batch = writeBatch(db);
        allSharedTasks.forEach((t) =>
          batch.delete(doc(db, "shared_tasks", t.id)),
        );
        await batch.commit();

        await inviaNotificaIscritti({
          calendarId: activeSharedCalendarId,
          currentUserId: user.uid,
          title: "Reset Calendario",
          message: `Il calendario "${calendarName}" è stato interamente svuotato da ${nomeUtente}.`,
          targetDate: todayISO,
        });

        setSelectedDates({});
        setSelectedTemplateId(null);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const resetSpecificDayTasks = async () => {
    if (!selectedDayDate || dayTasks.length === 0) return;
    if (
      window.confirm(`${Testi.privato.alertSvuotaOggi} ${selectedDayDate}?`)
    ) {
      try {
        const batch = writeBatch(db);
        dayTasks.forEach((dt) => batch.delete(doc(db, "shared_tasks", dt.id)));
        await batch.commit();

        await inviaNotificaIscritti({
          calendarId: activeSharedCalendarId,
          currentUserId: user.uid,
          title: "Reset Giornata",
          message: `I task del giorno ${selectedDayDate} sono stati svuotati da ${nomeUtente}.`,
          targetDate: selectedDayDate,
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const openUrl = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else alert(Testi.alert.erroreLink);
    } catch (error) {
      alert(Testi.alert.erroreLink);
    }
  };

  const getTaskCountForDate = (dateString) =>
    allSharedTasks.filter((t) => t.date === dateString).length;

  if (!activeSharedCalendarId) {
    return (
      <View style={styles.container}>
        <View style={styles.calendarHeaderRow}>
          <Text style={styles.title}>{Testi.condiviso.calendarioTitle}</Text>
          <TouchableOpacity onPress={() => auth.signOut()}>
            <Ionicons
              name="log-out-outline"
              size={28}
              color={PaletteColori.condiviso.error}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.emptyText}>{Testi.condiviso.nessunCalendario}</Text>
      </View>
    );
  }

  const renderFixedTasks = () => {
    return personalFixedTasks.map((task) => (
      <View
        key={task.id}
        style={[
          styles.templateCard,
          selectedTemplateId === task.id && styles.templateCardSelected,
        ]}
      >
        <TouchableOpacity
          style={styles.templateContent}
          onPress={() => toggleTemplateSelection(task.id)}
        >
          <View
            style={[styles.colorIndicator, { backgroundColor: task.color }]}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.templateTitle}>{task.title}</Text>
            <Text style={styles.templateTime}>
              {task.isAllDay
                ? Testi.modali.tuttoIlGiorno
                : `${task.startTime} - ${task.endTime}`}
            </Text>
            {task.description ? (
              <Text
                style={styles.templateDescription}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {task.description}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>

        <View style={styles.actionsColumn}>
          {task.url ? (
            <TouchableOpacity
              onPress={() => openUrl(task.url)}
              style={styles.actionButton}
            >
              <Ionicons
                name="link"
                size={20}
                color={PaletteColori.condiviso.primary}
              />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setTemplateToEdit(task);
              setFixedModalVisible(true);
            }}
          >
            <Ionicons
              name="pencil-outline"
              size={20}
              color={PaletteColori.condiviso.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => deleteTemplate(task.id)}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={PaletteColori.condiviso.error}
            />
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  const numSelectedDates = Object.keys(selectedDates).filter(
    (k) => selectedDates[k].selected,
  ).length;

  return (
    <View style={styles.container}>
      <View style={styles.calendarHeaderRow}>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.title}>{Testi.condiviso.calendarioTitle}</Text>
          <Text style={styles.headerSubtitle}>{calendarName}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <CampanellaNotifiche
            onNavigateToDate={(date) => {
              setSelectedDayDate(date);
              setIsDayModalVisible(true);
            }}
          />

          {allSharedTasks.length > 0 ? (
            <TouchableOpacity
              onPress={resetAllCalendarTasks}
              style={styles.resetButton}
            >
              <Ionicons
                name="reload-outline"
                size={22}
                color={PaletteColori.condiviso.error}
              />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity onPress={() => auth.signOut()}>
            <Ionicons
              name="log-out-outline"
              size={28}
              color={PaletteColori.condiviso.error}
            />
          </TouchableOpacity>
        </View>
      </View>

      {errorBanner !== "" ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorBanner}</Text>
        </View>
      ) : null}

      <View style={styles.bentoCard}>
        <Calendar
          markingType={"custom"}
          onDayPress={onDayPress}
          markedDates={getMarkedDates()}
          dayComponent={({ date, state }) => {
            const count = getTaskCountForDate(date.dateString);
            const isSelected = selectedDates[date.dateString]?.selected;
            const isToday = date.dateString === todayISO;
            return (
              <TouchableOpacity
                onPress={() => onDayPress(date)}
                style={[
                  styles.calendarDayCell,
                  isToday && styles.calendarDayCellToday,
                  isSelected && styles.calendarDayCellSelected,
                ]}
              >
                <Text
                  style={[
                    styles.calendarDayText,
                    state === "disabled" && styles.disabledText,
                    isSelected && styles.calendarDayTextSelected,
                    isToday && !isSelected && styles.calendarDayTextToday,
                  ]}
                >
                  {date.day}
                </Text>
                {count > 0 ? (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{count}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          }}
          theme={{
            calendarBackground: PaletteColori.condiviso.cardBackground,
            textSectionTitleColor: PaletteColori.condiviso.textSecondary,
            todayTextColor: PaletteColori.condiviso.primary,
            dayTextColor: PaletteColori.condiviso.textMain,
            arrowColor: PaletteColori.condiviso.primary,
            monthTextColor: PaletteColori.condiviso.textMain,
          }}
        />
      </View>

      <View style={styles.sectionHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={styles.sectionTitle}>
            {Testi.condiviso.sezioneEventiFissi}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setTemplateToEdit(null);
            setFixedModalVisible(true);
          }}
        >
          <Ionicons
            name="add-circle"
            size={28}
            color={PaletteColori.condiviso.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.templatesContainer}>
        {personalFixedTasks.length === 0 ? (
          <Text style={styles.emptyText}>
            {Testi.condiviso.nessunEventoFisso}
          </Text>
        ) : (
          renderFixedTasks()
        )}
      </ScrollView>

      {numSelectedDates > 0 && selectedTemplateId ? (
        <View style={styles.batchActionCard}>
          <Text style={styles.batchText}>
            {Testi.privato.inserisciInDate}{" "}
            <Text style={{ fontWeight: "bold" }}>{numSelectedDates}</Text>{" "}
            {Testi.privato.inserisciDateSuf}
          </Text>
          <TouchableOpacity
            style={styles.batchButton}
            onPress={handleBatchInsert}
            disabled={isInserting}
          >
            {isInserting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Ionicons name="checkmark" size={24} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
      ) : null}

      <ModaleDettagliCondiviso
        visible={isDayModalVisible}
        onClose={() => setIsDayModalVisible(false)}
        date={selectedDayDate}
        tasks={dayTasks}
        onResetDay={resetSpecificDayTasks}
        onAddTask={() => {
          setTaskToEdit(null);
          setIsTaskModalVisible(true);
        }}
        onEditTask={(task) => {
          setTaskToEdit(task);
          setIsTaskModalVisible(true);
        }}
        onDeleteTask={async (taskId) => {
          if (window.confirm(Testi.modali.alertEliminaTask)) {
            await deleteDoc(doc(db, "shared_tasks", taskId));
            await inviaNotificaIscritti({
              calendarId: activeSharedCalendarId,
              currentUserId: user.uid,
              title: "Evento Eliminato",
              message: `${nomeUtente} ha eliminato un evento condiviso.`,
              targetDate: selectedDayDate,
            });
          }
        }}
        onOpenUrl={openUrl}
      />

      <ModaleTaskCondiviso
        visible={isTaskModalVisible}
        onClose={() => setIsTaskModalVisible(false)}
        selectedDate={selectedDayDate}
        taskToEdit={taskToEdit}
      />

      <FixedTaskModal
        visible={isFixedModalVisible}
        onClose={() => setFixedModalVisible(false)}
        templateToEdit={templateToEdit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PaletteColori.condiviso.background,
    padding: PaletteColori.spacing.l,
    paddingTop: PaletteColori.spacing.l * 2,
  },
  calendarHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: PaletteColori.spacing.m,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: PaletteColori.condiviso.primary,
  },
  headerSubtitle: {
    fontSize: 16,
    color: PaletteColori.condiviso.textSecondary,
    fontWeight: "bold",
    marginTop: 2,
  },
  resetButton: { padding: 6, backgroundColor: "#FFE5E5", borderRadius: 12 },
  errorBanner: {
    backgroundColor: "#FFE5E5",
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.input,
    marginBottom: PaletteColori.spacing.m,
  },
  errorText: {
    color: PaletteColori.condiviso.error,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  bentoCard: {
    backgroundColor: PaletteColori.condiviso.cardBackground,
    borderRadius: PaletteColori.borderRadius.card,
    padding: PaletteColori.spacing.m,
    overflow: "hidden",
    marginBottom: PaletteColori.spacing.m,
  },
  calendarDayCell: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    backgroundColor: PaletteColori.condiviso.background,
    position: "relative",
  },
  calendarDayCellToday: {
    borderWidth: 2,
    borderColor: PaletteColori.condiviso.primary,
  },
  calendarDayTextToday: {
    color: PaletteColori.condiviso.primary,
    fontWeight: "bold",
  },
  calendarDayCellSelected: { backgroundColor: PaletteColori.condiviso.primary },
  calendarDayText: {
    fontSize: 14,
    color: PaletteColori.condiviso.textMain,
    fontWeight: "500",
  },
  calendarDayTextSelected: { color: "#FFF", fontWeight: "bold" },
  disabledText: { color: PaletteColori.condiviso.textSecondary, opacity: 0.4 },
  badgeContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: PaletteColori.condiviso.primary,
    borderRadius: 6,
    minWidth: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  badgeText: { color: "#FFF", fontSize: 9, fontWeight: "bold" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: PaletteColori.spacing.s,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: PaletteColori.condiviso.textMain,
  },
  templatesContainer: { flex: 1 },
  emptyText: {
    color: PaletteColori.condiviso.textSecondary,
    fontStyle: "italic",
  },
  templateCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PaletteColori.condiviso.cardBackground,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.card,
    marginBottom: PaletteColori.spacing.s,
    borderWidth: 2,
    borderColor: "transparent",
  },
  templateCardSelected: { borderColor: PaletteColori.condiviso.primary },
  templateContent: { flex: 1, flexDirection: "row", alignItems: "center" },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: PaletteColori.spacing.s,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: PaletteColori.condiviso.textMain,
  },
  templateTime: {
    fontSize: 12,
    color: PaletteColori.condiviso.textSecondary,
    marginTop: 2,
  },
  templateDescription: {
    fontSize: 13,
    color: PaletteColori.condiviso.textSecondary,
    marginTop: 2,
    fontStyle: "italic",
  },
  actionsColumn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: PaletteColori.spacing.s,
  },
  actionButton: { padding: 6, marginLeft: 4 },
  batchActionCard: {
    position: "absolute",
    bottom: PaletteColori.spacing.l,
    left: PaletteColori.spacing.l,
    right: PaletteColori.spacing.l,
    backgroundColor: PaletteColori.condiviso.cardBackground,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.card,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
  },
  batchText: { fontSize: 16, color: PaletteColori.condiviso.textMain },
  batchButton: {
    backgroundColor: PaletteColori.condiviso.primary,
    padding: PaletteColori.spacing.s,
    borderRadius: 12,
    width: 48,
    alignItems: "center",
  },
});
</file>

<file path="src/screens/condiviso/SchermataGestioneCondivisa.js">
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
        window.confirm(Testi.condiviso.alertEliminaCalendario)
      ) {
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
      }
    } else {
      if (
        window.confirm(Testi.condiviso.alertEsciCalendario)
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
</file>

<file path="src/screens/condiviso/SchermataOggiCondivisa.js">
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { PaletteColori } from "../../palette_e_testi/PaletteColori";
import { Testi } from "../../palette_e_testi/Testi";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/useAuthStore";
import ModaleTaskCondiviso from "../../components/ModaleTaskCondiviso";
import CampanellaNotifiche from "../../components/CampanellaNotifiche";
import { inviaNotificaIscritti } from "../../utils/notificheUtils";

export default function SchermataOggiCondivisa() {
  const { user, activeSharedCalendarId, setActiveSharedCalendarId } =
    useAuthStore();
  const navigation = useNavigation();

  const [tasks, setTasks] = useState([]);
  const [calendarName, setCalendarName] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const todayObj = new Date();
  const todayFormatted = todayObj.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const todayISO = todayObj.toISOString().split("T")[0];

  const nomeUtente = user?.email?.split("@")[0] || "Un membro";

  useEffect(() => {
    if (!user || activeSharedCalendarId) return;
    const fetchFirstCalendar = async () => {
      const q = query(
        collection(db, "shared_calendars"),
        where("members", "array-contains", user.uid),
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setActiveSharedCalendarId(snap.docs[0].id);
      }
    };
    fetchFirstCalendar();
  }, [user, activeSharedCalendarId]);

  useEffect(() => {
    if (!activeSharedCalendarId) return;
    const unsubscribeCal = onSnapshot(
      doc(db, "shared_calendars", activeSharedCalendarId),
      (docSnap) => {
        if (docSnap.exists()) {
          setCalendarName(docSnap.data().name);
        }
      },
    );
    return () => unsubscribeCal();
  }, [activeSharedCalendarId]);

  useEffect(() => {
    if (!activeSharedCalendarId) return;

    const q = query(
      collection(db, "shared_tasks"),
      where("calendarId", "==", activeSharedCalendarId),
      where("date", "==", todayISO),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = [];
      snapshot.forEach((document) =>
        tasksData.push({ id: document.id, ...document.data() }),
      );
      tasksData.sort((a, b) => {
        if (a.isCompleted === b.isCompleted)
          return new Date(a.createdAt) - new Date(b.createdAt);
        return a.isCompleted ? 1 : -1;
      });
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [activeSharedCalendarId, todayISO]);

  const toggleTaskStatus = async (task) => {
    await updateDoc(doc(db, "shared_tasks", task.id), {
      isCompleted: !task.isCompleted,
    });
  };

  const deleteTask = async (task) => {
    if (window.confirm(Testi.modali.alertEliminaTask)) {
      await deleteDoc(doc(db, "shared_tasks", task.id));
      await inviaNotificaIscritti({
        calendarId: activeSharedCalendarId,
        currentUserId: user.uid,
        title: "Evento Eliminato",
        message: `${nomeUtente} ha eliminato l'evento "${task.title}".`,
        targetDate: todayISO,
      });
    }
  };

  const resetTodayTasks = async () => {
    if (tasks.length === 0) return;
    if (
      window.confirm(`${Testi.condiviso.alertSvuotaOggi} "${calendarName}"?`)
    ) {
      try {
        const batch = writeBatch(db);
        tasks.forEach((t) => batch.delete(doc(db, "shared_tasks", t.id)));
        await batch.commit();

        await inviaNotificaIscritti({
          calendarId: activeSharedCalendarId,
          currentUserId: user.uid,
          title: "Reset Giornaliero",
          message: `${nomeUtente} ha svuotato tutti i task di oggi (${todayISO}).`,
          targetDate: todayISO,
        });
      } catch (e) {
        console.error("Errore reset:", e);
      }
    }
  };

  const openUrl = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else alert(Testi.alert.erroreLink);
    } catch (error) {
      alert(Testi.alert.erroreLink);
    }
  };

  const openNewTaskModal = () => {
    if (!activeSharedCalendarId) {
      alert(Testi.condiviso.nessunCalendario);
      return;
    }
    setTaskToEdit(null);
    setModalVisible(true);
  };

  const openEditTaskModal = (task) => {
    setTaskToEdit(task);
    setModalVisible(true);
  };

  if (!activeSharedCalendarId) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{Testi.condiviso.oggiTitle}</Text>
          <TouchableOpacity onPress={() => auth.signOut()}>
            <Ionicons
              name="log-out-outline"
              size={28}
              color={PaletteColori.condiviso.error}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            {Testi.condiviso.nessunCalendario}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "column" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Text style={styles.title}>{Testi.condiviso.oggiTitle}</Text>
            {tasks.length > 0 ? (
              <TouchableOpacity
                onPress={resetTodayTasks}
                style={styles.resetButton}
              >
                <Ionicons
                  name="reload-outline"
                  size={22}
                  color={PaletteColori.condiviso.error}
                />
              </TouchableOpacity>
            ) : null}
          </View>
          <Text style={styles.headerSubtitle}>Calendario: {calendarName}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <CampanellaNotifiche
            onNavigateToDate={(date) => {
              navigation.navigate("Calendario", { selectedDateToOpen: date });
            }}
          />
          <TouchableOpacity onPress={() => auth.signOut()}>
            <Ionicons
              name="log-out-outline"
              size={28}
              color={PaletteColori.condiviso.error}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.dateHeaderCard}>
          <Text style={styles.dateText}>{todayFormatted}</Text>
        </View>

        {tasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              {Testi.condiviso.nessunTaskOggi}
            </Text>
          </View>
        ) : (
          tasks.map((task) => (
            <View
              key={task.id}
              style={[
                styles.taskCard,
                task.isCompleted && styles.taskCompleted,
              ]}
            >
              <TouchableOpacity
                style={styles.taskCheckbox}
                onPress={() => toggleTaskStatus(task)}
              >
                <Ionicons
                  name={
                    task.isCompleted ? "checkmark-circle" : "ellipse-outline"
                  }
                  size={28}
                  color={
                    task.isCompleted
                      ? PaletteColori.condiviso.textSecondary
                      : task.color
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.taskContent}
                onPress={() => openEditTaskModal(task)}
              >
                <Text
                  style={[
                    styles.taskTitle,
                    task.isCompleted && styles.taskTitleCompleted,
                  ]}
                >
                  {task.title}
                </Text>
                <Text style={styles.taskTime}>
                  {task.isAllDay
                    ? Testi.modali.tuttoIlGiorno
                    : `${task.startTime} - ${task.endTime}`}
                </Text>
                {task.description ? (
                  <Text
                    style={styles.taskDescription}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {task.description}
                  </Text>
                ) : null}
              </TouchableOpacity>

              <View style={styles.actionsColumn}>
                {task.url ? (
                  <TouchableOpacity
                    onPress={() => openUrl(task.url)}
                    style={styles.actionButton}
                  >
                    <Ionicons
                      name="link"
                      size={22}
                      color={PaletteColori.condiviso.primary}
                    />
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  onPress={() => openEditTaskModal(task)}
                  style={styles.actionButton}
                >
                  <Ionicons
                    name="pencil-outline"
                    size={22}
                    color={PaletteColori.condiviso.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteTask(task)}
                  style={styles.actionButton}
                >
                  <Ionicons
                    name="trash-outline"
                    size={22}
                    color={PaletteColori.condiviso.error}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openNewTaskModal}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      <ModaleTaskCondiviso
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        selectedDate={todayISO}
        taskToEdit={taskToEdit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PaletteColori.condiviso.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: PaletteColori.spacing.l,
    paddingBottom: PaletteColori.spacing.s,
    paddingTop: PaletteColori.spacing.l * 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: PaletteColori.condiviso.primary,
  },
  headerSubtitle: {
    fontSize: 16,
    color: PaletteColori.condiviso.textSecondary,
    fontWeight: "bold",
    marginTop: 2,
  },
  resetButton: { padding: 6, backgroundColor: "#FFE5E5", borderRadius: 12 },
  scrollContent: { padding: PaletteColori.spacing.l, paddingBottom: 100 },
  dateHeaderCard: {
    backgroundColor: PaletteColori.condiviso.cardBackground,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.card,
    alignItems: "center",
    marginBottom: PaletteColori.spacing.m,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: PaletteColori.condiviso.textMain,
    textTransform: "capitalize",
  },
  emptyCard: {
    backgroundColor: PaletteColori.condiviso.cardBackground,
    padding: PaletteColori.spacing.l,
    borderRadius: PaletteColori.borderRadius.card,
    alignItems: "center",
  },
  emptyText: {
    color: PaletteColori.condiviso.textSecondary,
    textAlign: "center",
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PaletteColori.condiviso.cardBackground,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.card,
    marginBottom: PaletteColori.spacing.s,
  },
  taskCompleted: { opacity: 0.6 },
  taskCheckbox: { marginRight: PaletteColori.spacing.m },
  taskContent: { flex: 1, justifyContent: "center" },
  taskTitle: {
    fontSize: 16,
    color: PaletteColori.condiviso.textMain,
    fontWeight: "bold",
  },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: PaletteColori.condiviso.textSecondary,
  },
  taskTime: {
    fontSize: 12,
    color: PaletteColori.condiviso.textSecondary,
    marginTop: 2,
  },
  taskDescription: {
    fontSize: 13,
    color: PaletteColori.condiviso.textSecondary,
    marginTop: 4,
    fontStyle: "italic",
  },
  actionsColumn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: PaletteColori.spacing.s,
  },
  actionButton: { padding: 6, marginLeft: 4 },
  fab: {
    position: "absolute",
    bottom: PaletteColori.spacing.l,
    right: PaletteColori.spacing.l,
    backgroundColor: PaletteColori.condiviso.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});
</file>

<file path="src/screens/privato/PrivateCalendarScreen.js">
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { PaletteColori } from "../../palette_e_testi/PaletteColori";
import { Testi } from "../../palette_e_testi/Testi";
import { useAuthStore } from "../../store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";

import FixedTaskModal from "../../components/FixedTaskModal";
import DayDetailsModal from "../../components/DayDetailsModal";
import TaskModal from "../../components/TaskModal";

LocaleConfig.locales["it"] = {
  monthNames: [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ],
  monthNamesShort: [
    "Gen",
    "Feb",
    "Mar",
    "Apr",
    "Mag",
    "Giu",
    "Lug",
    "Ago",
    "Set",
    "Ott",
    "Nov",
    "Dic",
  ],
  dayNames: [
    "Domenica",
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
  today: Testi.privato.oggiTitle,
};
LocaleConfig.defaultLocale = "it";

export default function PrivateCalendarScreen() {
  const { user, userData } = useAuthStore();
  const todayISO = new Date().toISOString().split("T")[0];

  const [fixedTasks, setFixedTasks] = useState([]);
  const [allPrivateTasks, setAllPrivateTasks] = useState([]);
  const [selectedDates, setSelectedDates] = useState({});
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [isFixedModalVisible, setFixedModalVisible] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState(null);
  const [isInserting, setIsInserting] = useState(false);
  const [errorBanner, setErrorBanner] = useState("");

  const [isDayModalVisible, setIsDayModalVisible] = useState(false);
  const [selectedDayDate, setSelectedDayDate] = useState(null);
  const [dayTasks, setDayTasks] = useState([]);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  let birthDayMonth = null;
  if (userData?.birthDate) {
    const parts = userData.birthDate.split("-");
    if (parts.length === 3) {
      birthDayMonth = `${parts[1]}-${parts[0]}`;
    }
  }

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "fixed_tasks"),
      where("userId", "==", user.uid),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const templates = [];
      snapshot.forEach((document) =>
        templates.push({ id: document.id, ...document.data() }),
      );
      setFixedTasks(templates);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "private_tasks"),
      where("userId", "==", user.uid),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = [];
      snapshot.forEach((document) =>
        tasksData.push({ id: document.id, ...document.data() }),
      );
      setAllPrivateTasks(tasksData);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user || !selectedDayDate) return;
    const q = query(
      collection(db, "private_tasks"),
      where("userId", "==", user.uid),
      where("date", "==", selectedDayDate),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = [];
      snapshot.forEach((document) =>
        tasksData.push({ id: document.id, ...document.data() }),
      );
      tasksData.sort((a, b) => {
        if (a.isCompleted === b.isCompleted)
          return new Date(a.createdAt) - new Date(b.createdAt);
        return a.isCompleted ? 1 : -1;
      });
      setDayTasks(tasksData);
    });
    return () => unsubscribe();
  }, [user, selectedDayDate]);

  const onDayPress = (day) => {
    const dateString = day.dateString;
    setErrorBanner("");

    if (selectedTemplateId) {
      const newSelectedDates = { ...selectedDates };
      if (newSelectedDates[dateString]) {
        delete newSelectedDates[dateString];
      } else {
        newSelectedDates[dateString] = {
          selected: true,
          selectedColor: PaletteColori.privato.primary,
        };
      }
      setSelectedDates(newSelectedDates);
    } else {
      setSelectedDayDate(dateString);
      setIsDayModalVisible(true);
    }
  };

  const toggleTemplateSelection = (taskId) => {
    if (selectedTemplateId === taskId) {
      setSelectedTemplateId(null);
      setSelectedDates({});
    } else {
      setSelectedTemplateId(taskId);
      setSelectedDates({});
    }
    setErrorBanner("");
  };

  const handleBatchInsert = async () => {
    const datesToInsert = Object.keys(selectedDates).filter(
      (k) => selectedDates[k].selected,
    );
    if (datesToInsert.length === 0 || !selectedTemplateId) return;

    const template = fixedTasks.find((t) => t.id === selectedTemplateId);
    if (!template) return;

    setIsInserting(true);
    setErrorBanner("");

    try {
      const qCheck = query(
        collection(db, "private_tasks"),
        where("userId", "==", user.uid),
        where("templateId", "==", template.id),
      );
      const existingSnap = await getDocs(qCheck);
      const existingDates = new Set();
      existingSnap.forEach((docSnap) => {
        existingDates.add(docSnap.data().date);
      });

      const conflictingDates = datesToInsert.filter((d) =>
        existingDates.has(d),
      );
      if (conflictingDates.length > 0) {
        setErrorBanner(
          `${Testi.modali.erroreConflittoDate} ${conflictingDates.join(", ")}!`,
        );
        setIsInserting(false);
        return;
      }

      await Promise.all(
        datesToInsert.map((dateStr) =>
          addDoc(collection(db, "private_tasks"), {
            userId: user.uid,
            templateId: template.id,
            title: template.title,
            color: template.color,
            isAllDay: template.isAllDay,
            startTime: template.startTime,
            endTime: template.endTime,
            description: template.description,
            url: template.url,
            date: dateStr,
            isCompleted: false,
            createdAt: new Date().toISOString(),
          }),
        ),
      );
      setSelectedDates({});
      setSelectedTemplateId(null);
    } catch (error) {
      setErrorBanner("Errore durante l'inserimento nel calendario.");
    } finally {
      setIsInserting(false);
    }
  };

  const deleteTemplate = async (id) => {
    if (window.confirm("Vuoi davvero eliminare questo evento fisso?")) {
      await deleteDoc(doc(db, "fixed_tasks", id));
      if (selectedTemplateId === id) {
        setSelectedTemplateId(null);
        setSelectedDates({});
      }
    }
  };

  const resetAllCalendarTasks = async () => {
    if (allPrivateTasks.length === 0) return;
    if (window.confirm(Testi.privato.alertSvuotaCalendario)) {
      try {
        const batch = writeBatch(db);
        allPrivateTasks.forEach((t) => {
          batch.delete(doc(db, "private_tasks", t.id));
        });
        await batch.commit();
        setSelectedDates({});
        setSelectedTemplateId(null);
      } catch (e) {
        console.error("Errore reset calendario:", e);
      }
    }
  };

  const resetFixedTasksList = async () => {
    if (fixedTasks.length === 0) return;
    if (window.confirm(Testi.privato.alertSvuotaFissi)) {
      try {
        const batch = writeBatch(db);
        fixedTasks.forEach((ft) => {
          batch.delete(doc(db, "fixed_tasks", ft.id));
        });
        await batch.commit();
        setSelectedTemplateId(null);
        setSelectedDates({});
      } catch (e) {
        console.error("Errore reset lista fissi:", e);
      }
    }
  };

  const resetSpecificDayTasks = async () => {
    if (!selectedDayDate || dayTasks.length === 0) return;
    if (
      window.confirm(`${Testi.privato.alertSvuotaOggi} ${selectedDayDate}?`)
    ) {
      try {
        const batch = writeBatch(db);
        dayTasks.forEach((dt) => {
          batch.delete(doc(db, "private_tasks", dt.id));
        });
        await batch.commit();
      } catch (e) {
        console.error("Errore reset giorno:", e);
      }
    }
  };

  const openNewTaskModalForDay = () => {
    setTaskToEdit(null);
    setIsTaskModalVisible(true);
  };

  const openUrl = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else alert(Testi.alert.erroreLink);
    } catch (error) {
      alert(Testi.alert.erroreLink);
    }
  };

  const getTaskCountForDate = (dateString) => {
    return allPrivateTasks.filter((t) => t.date === dateString).length;
  };

  const renderFixedTasks = () => {
    return fixedTasks.map((task) => (
      <View
        key={task.id}
        style={[
          styles.templateCard,
          selectedTemplateId === task.id && styles.templateCardSelected,
        ]}
      >
        <TouchableOpacity
          style={styles.templateContent}
          onPress={() => toggleTemplateSelection(task.id)}
        >
          <View
            style={[styles.colorIndicator, { backgroundColor: task.color }]}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.templateTitle}>{task.title}</Text>
            <Text style={styles.templateTime}>
              {task.isAllDay
                ? Testi.modali.tuttoIlGiorno
                : `${task.startTime} - ${task.endTime}`}
            </Text>
            {task.description ? (
              <Text
                style={styles.templateDescription}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {task.description}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>

        <View style={styles.actionsColumn}>
          {task.url ? (
            <TouchableOpacity
              onPress={() => openUrl(task.url)}
              style={styles.actionButton}
            >
              <Ionicons
                name="link"
                size={20}
                color={PaletteColori.privato.primary}
              />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setTemplateToEdit(task);
              setFixedModalVisible(true);
            }}
          >
            <Ionicons
              name="pencil-outline"
              size={20}
              color={PaletteColori.privato.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => deleteTemplate(task.id)}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={PaletteColori.privato.error}
            />
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  const numSelectedDates = Object.keys(selectedDates).filter(
    (k) => selectedDates[k].selected,
  ).length;

  return (
    <View style={styles.container}>
      <View style={styles.calendarHeaderRow}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={styles.title}>{Testi.privato.calendarioTitle}</Text>
          {allPrivateTasks.length > 0 ? (
            <TouchableOpacity
              onPress={resetAllCalendarTasks}
              style={styles.resetButton}
            >
              <Ionicons
                name="reload-outline"
                size={22}
                color={PaletteColori.privato.error}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity onPress={() => auth.signOut()}>
          <Ionicons
            name="log-out-outline"
            size={28}
            color={PaletteColori.privato.error}
          />
        </TouchableOpacity>
      </View>

      {errorBanner !== "" ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorBanner}</Text>
        </View>
      ) : null}

      <View style={styles.bentoCard}>
        <Calendar
          markingType={"custom"}
          onDayPress={onDayPress}
          markedDates={selectedDates}
          dayComponent={({ date, state }) => {
            const count = getTaskCountForDate(date.dateString);
            const isSelected = selectedDates[date.dateString]?.selected;
            const isToday = date.dateString === todayISO;

            const isBirthday =
              birthDayMonth && date.dateString.substring(5) === birthDayMonth;

            return (
              <TouchableOpacity
                onPress={() => onDayPress(date)}
                style={[
                  styles.calendarDayCell,
                  isToday && styles.calendarDayCellToday,
                  isBirthday && styles.calendarDayCellBirthday,
                  isSelected && styles.calendarDayCellSelected,
                ]}
              >
                {isBirthday ? (
                  <View style={styles.birthdayBadge}>
                    <Text style={styles.birthdayBadgeText}>🎂</Text>
                  </View>
                ) : null}

                <Text
                  style={[
                    styles.calendarDayText,
                    state === "disabled" && styles.disabledText,
                    isSelected && styles.calendarDayTextSelected,
                    isToday && !isSelected && styles.calendarDayTextToday,
                  ]}
                >
                  {date.day}
                </Text>

                {count > 0 ? (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{count}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          }}
          theme={{
            calendarBackground: PaletteColori.privato.cardBackground,
            textSectionTitleColor: PaletteColori.privato.textSecondary,
            todayTextColor: PaletteColori.privato.primary,
            dayTextColor: PaletteColori.privato.textMain,
            arrowColor: PaletteColori.privato.primary,
            monthTextColor: PaletteColori.privato.textMain,
          }}
        />
      </View>

      <View style={styles.sectionHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={styles.sectionTitle}>
            {Testi.privato.sezioneEventiFissi}
          </Text>
          {fixedTasks.length > 0 ? (
            <TouchableOpacity
              onPress={resetFixedTasksList}
              style={styles.resetButton}
            >
              <Ionicons
                name="reload-outline"
                size={18}
                color={PaletteColori.privato.error}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          onPress={() => {
            setTemplateToEdit(null);
            setFixedModalVisible(true);
          }}
        >
          <Ionicons
            name="add-circle"
            size={28}
            color={PaletteColori.privato.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.templatesContainer}>
        {fixedTasks.length === 0 ? (
          <Text style={styles.emptyText}>
            {Testi.privato.nessunEventoFisso}
          </Text>
        ) : (
          renderFixedTasks()
        )}
      </ScrollView>

      {numSelectedDates > 0 && selectedTemplateId ? (
        <View style={styles.batchActionCard}>
          <Text style={styles.batchText}>
            {Testi.privato.inserisciInDate}{" "}
            <Text style={{ fontWeight: "bold" }}>{numSelectedDates}</Text>{" "}
            {Testi.privato.inserisciDateSuf}
          </Text>
          <TouchableOpacity
            style={styles.batchButton}
            onPress={handleBatchInsert}
            disabled={isInserting}
          >
            {isInserting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Ionicons name="checkmark" size={24} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
      ) : null}

      <FixedTaskModal
        visible={isFixedModalVisible}
        onClose={() => setFixedModalVisible(false)}
        templateToEdit={templateToEdit}
      />

      <DayDetailsModal
        visible={isDayModalVisible}
        onClose={() => setIsDayModalVisible(false)}
        date={selectedDayDate}
        tasks={dayTasks}
        onResetDay={resetSpecificDayTasks}
        onAddTask={openNewTaskModalForDay}
        onEditTask={(task) => {
          setTaskToEdit(task);
          setIsTaskModalVisible(true);
        }}
        onDeleteTask={async (taskId) => {
          if (window.confirm(Testi.modali.alertEliminaTask)) {
            await deleteDoc(doc(db, "private_tasks", taskId));
          }
        }}
        onOpenUrl={openUrl}
      />

      <TaskModal
        visible={isTaskModalVisible}
        onClose={() => setIsTaskModalVisible(false)}
        selectedDate={selectedDayDate}
        taskToEdit={taskToEdit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PaletteColori.privato.background,
    padding: PaletteColori.spacing.l,
    paddingTop: PaletteColori.spacing.l * 2,
  },
  calendarHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: PaletteColori.spacing.m,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: PaletteColori.privato.primary,
  },
  resetButton: {
    padding: 6,
    backgroundColor: "#FFE5E5",
    borderRadius: 12,
  },
  errorBanner: {
    backgroundColor: "#FFE5E5",
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.input,
    marginBottom: PaletteColori.spacing.m,
  },
  errorText: {
    color: PaletteColori.privato.error,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  bentoCard: {
    backgroundColor: PaletteColori.privato.cardBackground,
    borderRadius: PaletteColori.borderRadius.card,
    padding: PaletteColori.spacing.m,
    overflow: "hidden",
    marginBottom: PaletteColori.spacing.m,
  },
  calendarDayCell: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    backgroundColor: PaletteColori.privato.background,
    position: "relative",
  },
  calendarDayCellToday: {
    borderWidth: 2,
    borderColor: PaletteColori.privato.primary,
  },
  calendarDayCellBirthday: {
    borderWidth: 2,
    borderColor: PaletteColori.privato.birthdayBadge,
  },
  calendarDayTextToday: {
    color: PaletteColori.privato.primary,
    fontWeight: "bold",
  },
  calendarDayCellSelected: {
    backgroundColor: PaletteColori.privato.primary,
  },
  calendarDayText: {
    fontSize: 14,
    color: PaletteColori.privato.textMain,
    fontWeight: "500",
  },
  calendarDayTextSelected: {
    color: "#FFF",
    fontWeight: "bold",
  },
  disabledText: {
    color: PaletteColori.privato.textSecondary,
    opacity: 0.4,
  },
  birthdayBadge: {
    position: "absolute",
    top: -4,
    left: -4,
    zIndex: 1,
  },
  birthdayBadgeText: {
    fontSize: 11,
  },
  badgeContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: PaletteColori.privato.primary,
    borderRadius: 6,
    minWidth: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "bold",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: PaletteColori.spacing.s,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: PaletteColori.privato.textMain,
  },
  templatesContainer: {
    flex: 1,
  },
  emptyText: {
    color: PaletteColori.privato.textSecondary,
    fontStyle: "italic",
  },
  templateCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PaletteColori.privato.cardBackground,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.card,
    marginBottom: PaletteColori.spacing.s,
    borderWidth: 2,
    borderColor: "transparent",
  },
  templateCardSelected: {
    borderColor: PaletteColori.privato.primary,
  },
  templateContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: PaletteColori.spacing.s,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: PaletteColori.privato.textMain,
  },
  templateTime: {
    fontSize: 12,
    color: PaletteColori.privato.textSecondary,
    marginTop: 2,
  },
  templateDescription: {
    fontSize: 13,
    color: PaletteColori.privato.textSecondary,
    marginTop: 2,
    fontStyle: "italic",
  },
  actionsColumn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: PaletteColori.spacing.s,
  },
  actionButton: {
    padding: 6,
    marginLeft: 4,
  },
  batchActionCard: {
    position: "absolute",
    bottom: PaletteColori.spacing.l,
    left: PaletteColori.spacing.l,
    right: PaletteColori.spacing.l,
    backgroundColor: PaletteColori.privato.cardBackground,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.card,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
  },
  batchText: {
    fontSize: 16,
    color: PaletteColori.privato.textMain,
  },
  batchButton: {
    backgroundColor: PaletteColori.privato.primary,
    padding: PaletteColori.spacing.s,
    borderRadius: 12,
    width: 48,
    alignItems: "center",
  },
});
</file>

<file path="src/screens/privato/PrivateTodayScreen.js">
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
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
import { auth, db } from "../../config/firebase";
import { PaletteColori } from "../../palette_e_testi/PaletteColori";
import { Testi } from "../../palette_e_testi/Testi";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/useAuthStore";
import TaskModal from "../../components/TaskModal";

export default function PrivateTodayScreen() {
  const { user, userData } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const todayObj = new Date();
  const todayFormatted = todayObj.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const todayISO = todayObj.toISOString().split("T")[0]; // YYYY-MM-DD

  const todayDayMonth = todayISO.substring(5);
  let isBirthday = false;
  if (userData?.birthDate) {
    const parts = userData.birthDate.split("-");
    if (parts.length === 3) {
      const birthDayMonth = `${parts[1]}-${parts[0]}`;
      if (todayDayMonth === birthDayMonth) {
        isBirthday = true;
      }
    }
  }

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "private_tasks"),
      where("userId", "==", user.uid),
      where("date", "==", todayISO),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = [];
      snapshot.forEach((document) => {
        tasksData.push({ id: document.id, ...document.data() });
      });
      tasksData.sort((a, b) => {
        if (a.isCompleted === b.isCompleted)
          return new Date(a.createdAt) - new Date(b.createdAt);
        return a.isCompleted ? 1 : -1;
      });
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [user, todayISO]);

  const toggleTaskStatus = async (task) => {
    await updateDoc(doc(db, "private_tasks", task.id), {
      isCompleted: !task.isCompleted,
    });
  };

  const deleteTask = async (id) => {
    if (window.confirm(Testi.modali.alertEliminaTask)) {
      await deleteDoc(doc(db, "private_tasks", id));
    }
  };

  const resetTodayTasks = async () => {
    if (tasks.length === 0) return;
    if (window.confirm(Testi.privato.alertSvuotaOggi)) {
      try {
        const batch = writeBatch(db);
        tasks.forEach((t) => {
          batch.delete(doc(db, "private_tasks", t.id));
        });
        await batch.commit();
      } catch (e) {
        console.error("Errore reset oggi:", e);
      }
    }
  };

  const openUrl = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert(Testi.alert.erroreLink);
      }
    } catch (error) {
      alert(Testi.alert.erroreLink);
    }
  };

  const openNewTaskModal = () => {
    setTaskToEdit(null);
    setModalVisible(true);
  };

  const openEditTaskModal = (task) => {
    setTaskToEdit(task);
    setModalVisible(true);
  };

  const renderBirthdayCard = () => {
    return (
      <View style={[styles.taskCard, styles.birthdayCard]}>
        <View style={styles.birthdayIconBox}>
          <Text style={{ fontSize: 28 }}>🎂</Text>
        </View>
        <View style={styles.taskContent}>
          <Text style={styles.birthdayTitle}>
            {Testi.privato.compleannoTitolo}
          </Text>
          <Text style={styles.birthdayText}>
            {Testi.privato.compleannoTesto}
          </Text>
        </View>
      </View>
    );
  };

  const renderTasks = () => {
    if (tasks.length === 0) {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>{Testi.privato.nessunTaskOggi}</Text>
        </View>
      );
    }

    return tasks.map((task) => (
      <View
        key={task.id}
        style={[styles.taskCard, task.isCompleted && styles.taskCompleted]}
      >
        <TouchableOpacity
          style={styles.taskCheckbox}
          onPress={() => toggleTaskStatus(task)}
        >
          <Ionicons
            name={task.isCompleted ? "checkmark-circle" : "ellipse-outline"}
            size={28}
            color={
              task.isCompleted
                ? PaletteColori.privato.textSecondary
                : task.color
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.taskContent}
          onPress={() => openEditTaskModal(task)}
        >
          <Text
            style={[
              styles.taskTitle,
              task.isCompleted && styles.taskTitleCompleted,
            ]}
          >
            {task.title}
          </Text>

          <Text style={styles.taskTime}>
            {task.isAllDay
              ? Testi.modali.tuttoIlGiorno
              : `${task.startTime} - ${task.endTime}`}
          </Text>

          {task.description ? (
            <Text
              style={styles.taskDescription}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {task.description}
            </Text>
          ) : null}
        </TouchableOpacity>

        <View style={styles.actionsColumn}>
          {task.url ? (
            <TouchableOpacity
              onPress={() => openUrl(task.url)}
              style={styles.actionButton}
            >
              <Ionicons
                name="link"
                size={22}
                color={PaletteColori.privato.primary}
              />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={() => openEditTaskModal(task)}
            style={styles.actionButton}
          >
            <Ionicons
              name="pencil-outline"
              size={22}
              color={PaletteColori.privato.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => deleteTask(task.id)}
            style={styles.actionButton}
          >
            <Ionicons
              name="trash-outline"
              size={22}
              color={PaletteColori.privato.error}
            />
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={styles.title}>{Testi.privato.oggiTitle}</Text>
          {tasks.length > 0 ? (
            <TouchableOpacity
              onPress={resetTodayTasks}
              style={styles.resetButton}
            >
              <Ionicons
                name="reload-outline"
                size={22}
                color={PaletteColori.privato.error}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity onPress={() => auth.signOut()}>
          <Ionicons
            name="log-out-outline"
            size={28}
            color={PaletteColori.privato.error}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.dateHeaderCard}>
          <Text style={styles.dateText}>{todayFormatted}</Text>
        </View>

        {isBirthday ? renderBirthdayCard() : null}
        {renderTasks()}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openNewTaskModal}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      <TaskModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        selectedDate={todayISO}
        taskToEdit={taskToEdit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PaletteColori.privato.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: PaletteColori.spacing.l,
    paddingBottom: PaletteColori.spacing.s,
    paddingTop: PaletteColori.spacing.l * 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: PaletteColori.privato.primary,
  },
  resetButton: {
    padding: 6,
    backgroundColor: "#FFE5E5",
    borderRadius: 12,
  },
  scrollContent: {
    padding: PaletteColori.spacing.l,
    paddingBottom: 100,
  },
  dateHeaderCard: {
    backgroundColor: PaletteColori.privato.cardBackground,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.card,
    alignItems: "center",
    marginBottom: PaletteColori.spacing.m,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: PaletteColori.privato.textMain,
    textTransform: "capitalize",
  },
  emptyCard: {
    backgroundColor: PaletteColori.privato.cardBackground,
    padding: PaletteColori.spacing.l,
    borderRadius: PaletteColori.borderRadius.card,
    alignItems: "center",
  },
  emptyText: {
    color: PaletteColori.privato.textSecondary,
  },
  birthdayCard: {
    backgroundColor: PaletteColori.privato.birthdayBackground,
    borderWidth: 2,
    borderColor: PaletteColori.privato.birthdayBadge,
  },
  birthdayIconBox: {
    marginRight: PaletteColori.spacing.m,
  },
  birthdayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: PaletteColori.privato.birthdayBadge,
  },
  birthdayText: {
    fontSize: 14,
    color: PaletteColori.privato.textMain,
    marginTop: 2,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PaletteColori.privato.cardBackground,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.card,
    marginBottom: PaletteColori.spacing.s,
  },
  taskCompleted: {
    opacity: 0.6,
  },
  taskCheckbox: {
    marginRight: PaletteColori.spacing.m,
  },
  taskContent: {
    flex: 1,
    justifyContent: "center",
  },
  taskTitle: {
    fontSize: 16,
    color: PaletteColori.privato.textMain,
    fontWeight: "bold",
  },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: PaletteColori.privato.textSecondary,
  },
  taskTime: {
    fontSize: 12,
    color: PaletteColori.privato.textSecondary,
    marginTop: 2,
  },
  taskDescription: {
    fontSize: 13,
    color: PaletteColori.privato.textSecondary,
    marginTop: 4,
    fontStyle: "italic",
  },
  actionsColumn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: PaletteColori.spacing.s,
  },
  actionButton: {
    padding: 6,
    marginLeft: 4,
  },
  fab: {
    position: "absolute",
    bottom: PaletteColori.spacing.l,
    right: PaletteColori.spacing.l,
    backgroundColor: PaletteColori.privato.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});
</file>

<file path="src/utils/notificheUtils.js">
import { doc, getDoc, collection, writeBatch } from "firebase/firestore";
import { db } from "../config/firebase";

export async function inviaNotificaIscritti({
  calendarId,
  currentUserId,
  title,
  message,
  targetDate,
}) {
  if (!calendarId || !currentUserId) return;

  try {
    const calRef = doc(db, "shared_calendars", calendarId);
    const calSnap = await getDoc(calRef);
    if (!calSnap.exists()) return;

    const members = calSnap.data().members || [];
    const recipients = members.filter((uid) => uid !== currentUserId);

    if (recipients.length === 0) return;

    const batch = writeBatch(db);
    recipients.forEach((recipientId) => {
      const newNotifRef = doc(collection(db, "inapp_notifications"));
      batch.set(newNotifRef, {
        userId: recipientId,
        calendarId: calendarId,
        title: title,
        message: message,
        targetDate: targetDate,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    });

    await batch.commit();
  } catch (error) {
    console.error("Errore nell'invio della notifica in-app:", error);
  }
}
</file>

<file path=".env.example">
EXPO_PUBLIC_FIREBASE_API_KEY=insert_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=insert_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=insert_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=insert_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=insert_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=insert_app_id
</file>

<file path="app.json">
{
  "expo": {
    "name": "temp-app",
    "slug": "temp-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/android-icon-foreground.png",
        "backgroundImage": "./assets/android-icon-background.png",
        "monochromeImage": "./assets/android-icon-monochrome.png"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
</file>

<file path="firestore.rules">
// Protegge l'accesso in lettura/scrittura garantendo l'isolamento dei dati privati e la gestione dei permessi per i calendari condivisi tramite la funzione get() di Firestore.

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Regola base: nega qualsiasi accesso non esplicitamente autorizzato
    match /{document=**} {
      allow read, write: if false;
    }

    // 1. Utenti: l'utente loggato può gestire solo il proprio profilo
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 2. Task Privati e Fissi: accesso esclusivo al proprietario (userId == auth.uid)
    match /private_tasks/{taskId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    match /fixed_tasks/{taskId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // 3. Calendari Condivisi: lettura/modifica solo per gli UID presenti nell'array "members"
    match /shared_calendars/{calendarId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null && request.auth.uid in resource.data.members;
      allow delete: if request.auth != null && request.auth.uid == resource.data.ownerId;
    }

    // 4. Task Condivisi: verifica se l'utente appartiene al calendario associato al task
    match /shared_tasks/{taskId} {
      allow create: if request.auth != null && 
                    request.auth.uid in get(/databases/$(database)/documents/shared_calendars/$(request.resource.data.calendarId)).data.members;
      
      allow read, update, delete: if request.auth != null && 
                                  request.auth.uid in get(/databases/$(database)/documents/shared_calendars/$(resource.data.calendarId)).data.members;
    }
  }
}
</file>

<file path="index.js">
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
</file>

<file path="LICENSE">
The MIT License (MIT)

Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
</file>

<file path="README.md">
# Agenda-Sync-Baas
</file>

<file path="src/components/CampanellaNotifiche.js">
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

  const handleSvuotaTutte = async () => {
    if (notifiche.length === 0) return;
    if (
      window.confirm("Vuoi eliminare tutte le notifiche di questo calendario?") // Potresti aggiungere in Testi.js se lo desideri
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
</file>

<file path="src/components/ModaleDettagliCondiviso.js">
import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { PaletteColori } from "../palette_e_testi/PaletteColori";
import { Testi } from "../palette_e_testi/Testi";
import { Ionicons } from "@expo/vector-icons";

export default function ModaleDettagliCondiviso({
  visible,
  onClose,
  date,
  tasks,
  onEditTask,
  onDeleteTask,
  onOpenUrl,
  onResetDay,
  onAddTask,
}) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("it-IT", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Text style={styles.title}>{formattedDate}</Text>

              {onAddTask ? (
                <TouchableOpacity onPress={onAddTask} style={styles.addButton}>
                  <Ionicons name="add" size={22} color="#FFF" />
                </TouchableOpacity>
              ) : null}

              {tasks && tasks.length > 0 && onResetDay ? (
                <TouchableOpacity
                  onPress={onResetDay}
                  style={styles.resetButton}
                >
                  <Ionicons
                    name="reload-outline"
                    size={22}
                    color={PaletteColori.condiviso.error}
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close-circle"
                size={28}
                color={PaletteColori.condiviso.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea}>
            {tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <View key={task.id} style={styles.taskCard}>
                  <View
                    style={[
                      styles.colorIndicator,
                      { backgroundColor: task.color },
                    ]}
                  />

                  <TouchableOpacity
                    style={styles.taskContent}
                    onPress={() => onEditTask(task)}
                  >
                    <Text
                      style={[
                        styles.taskTitle,
                        task.isCompleted && styles.taskTitleCompleted,
                      ]}
                    >
                      {task.title}
                    </Text>

                    <Text style={styles.taskTime}>
                      {task.isAllDay
                        ? Testi.modali.tuttoIlGiorno
                        : `${task.startTime} - ${task.endTime}`}
                    </Text>

                    {task.description ? (
                      <Text
                        style={styles.taskDescription}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {task.description}
                      </Text>
                    ) : null}
                  </TouchableOpacity>

                  <View style={styles.actionsColumn}>
                    {task.url ? (
                      <TouchableOpacity
                        onPress={() => onOpenUrl(task.url)}
                        style={styles.actionButton}
                      >
                        <Ionicons
                          name="link"
                          size={22}
                          color={PaletteColori.condiviso.primary}
                        />
                      </TouchableOpacity>
                    ) : null}

                    <TouchableOpacity
                      onPress={() => onEditTask(task)}
                      style={styles.actionButton}
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={22}
                        color={PaletteColori.condiviso.primary}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => onDeleteTask(task.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={22}
                        color={PaletteColori.condiviso.error}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {Testi.modali.nessunEventoData}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: PaletteColori.condiviso.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: PaletteColori.spacing.l,
    minHeight: "50%",
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: PaletteColori.spacing.l,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: PaletteColori.condiviso.primary,
    textTransform: "capitalize",
  },
  addButton: {
    padding: 6,
    backgroundColor: PaletteColori.condiviso.primary,
    borderRadius: 12,
  },
  resetButton: { padding: 6, backgroundColor: "#FFE5E5", borderRadius: 12 },
  scrollArea: { flexGrow: 1 },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PaletteColori.condiviso.background,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.card,
    marginBottom: PaletteColori.spacing.s,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: PaletteColori.spacing.m,
  },
  taskContent: { flex: 1, justifyContent: "center" },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: PaletteColori.condiviso.textMain,
  },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: PaletteColori.condiviso.textSecondary,
  },
  taskTime: {
    fontSize: 12,
    color: PaletteColori.condiviso.textSecondary,
    marginTop: 2,
  },
  taskDescription: {
    fontSize: 13,
    color: PaletteColori.condiviso.textSecondary,
    marginTop: 4,
    fontStyle: "italic",
  },
  actionsColumn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: PaletteColori.spacing.s,
  },
  actionButton: { padding: 6, marginLeft: 4 },
  emptyContainer: { padding: PaletteColori.spacing.l, alignItems: "center" },
  emptyText: {
    color: PaletteColori.condiviso.textSecondary,
    fontStyle: "italic",
  },
});
</file>

<file path="src/components/TimePickerModal.js">
import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { PaletteColori } from "../palette_e_testi/PaletteColori";
import { Testi } from "../palette_e_testi/Testi";

export default function TimePickerModal({
  visible,
  onClose,
  onConfirm,
  initialTime,
}) {
  const [mode, setMode] = useState("h");
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");

  useEffect(() => {
    if (visible && initialTime) {
      setHour(initialTime.split(":")[0]);
      setMinute(initialTime.split(":")[1]);
      setMode("h");
    }
  }, [visible, initialTime]);

  const handleConfirm = () => {
    onConfirm(`${hour}:${minute}`);
  };

  const renderClockFace = () => {
    const center = 130;
    const itemRadius = 18;

    if (mode === "h") {
      const hours = Array.from({ length: 24 }, (_, i) => i);
      return hours.map((h) => {
        const isInner = h === 0 || h > 12;
        const displayH = h.toString().padStart(2, "0");
        const radius = isInner ? 65 : 105;
        const angle = ((h % 12 || 12) * 30 - 90) * (Math.PI / 180);
        const x = center + radius * Math.cos(angle) - itemRadius;
        const y = center + radius * Math.sin(angle) - itemRadius;

        const isSelected = hour === displayH;

        return (
          <TouchableOpacity
            key={`h-${h}`}
            style={[
              styles.clockItem,
              { left: x, top: y },
              isSelected && styles.clockItemSelected,
            ]}
            onPress={() => {
              setHour(displayH);
              setMode("m");
            }}
          >
            <Text
              style={[
                styles.clockItemText,
                isSelected && styles.clockItemTextSelected,
              ]}
            >
              {displayH}
            </Text>
          </TouchableOpacity>
        );
      });
    } else {
      const minutes = Array.from({ length: 12 }, (_, i) =>
        (i * 5).toString().padStart(2, "0"),
      );

      return minutes.map((m, index) => {
        const radius = 105;
        const angle = (index * 30 - 90) * (Math.PI / 180);
        const x = center + radius * Math.cos(angle) - itemRadius;
        const y = center + radius * Math.sin(angle) - itemRadius;

        const isSelected = minute === m;

        return (
          <TouchableOpacity
            key={`m-${m}`}
            style={[
              styles.clockItem,
              { left: x, top: y },
              isSelected && styles.clockItemSelected,
            ]}
            onPress={() => setMinute(m)}
          >
            <Text
              style={[
                styles.clockItemText,
                isSelected && styles.clockItemTextSelected,
              ]}
            >
              {m}
            </Text>
          </TouchableOpacity>
        );
      });
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setMode("h")}
              style={[styles.headerBox, mode === "h" && styles.headerBoxActive]}
            >
              <Text
                style={[
                  styles.headerText,
                  mode === "h" && styles.headerTextActive,
                ]}
              >
                {hour}
              </Text>
            </TouchableOpacity>

            <Text style={styles.headerSeparator}>:</Text>

            <TouchableOpacity
              onPress={() => setMode("m")}
              style={[styles.headerBox, mode === "m" && styles.headerBoxActive]}
            >
              <Text
                style={[
                  styles.headerText,
                  mode === "m" && styles.headerTextActive,
                ]}
              >
                {minute}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.clockContainer}>
            <View style={styles.clockCenterDot} />
            {renderClockFace()}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonTextCancel}>
                {Testi.modali.btnAnnulla.toUpperCase()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={styles.button}>
              <Text style={styles.buttonTextConfirm}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: 310,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerBox: {
    backgroundColor: PaletteColori.privato.background,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  headerBoxActive: {
    backgroundColor: "#E0E0FF",
  },
  headerText: {
    fontSize: 48,
    color: PaletteColori.privato.textSecondary,
    fontWeight: "400",
  },
  headerTextActive: {
    color: PaletteColori.privato.primary,
    fontWeight: "bold",
  },
  headerSeparator: {
    fontSize: 48,
    color: PaletteColori.privato.textMain,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  clockContainer: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: PaletteColori.privato.background,
    position: "relative",
    marginBottom: 24,
  },
  clockCenterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PaletteColori.privato.primary,
    position: "absolute",
    top: 126,
    left: 126,
  },
  clockItem: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  clockItemSelected: {
    backgroundColor: PaletteColori.privato.primary,
  },
  clockItemText: {
    fontSize: 16,
    color: PaletteColori.privato.textMain,
  },
  clockItemTextSelected: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    gap: 16,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonTextCancel: {
    color: PaletteColori.privato.textSecondary,
    fontWeight: "bold",
    fontSize: 14,
  },
  buttonTextConfirm: {
    color: PaletteColori.privato.primary,
    fontWeight: "bold",
    fontSize: 14,
  },
});
</file>

<file path="src/navigation/NavigatoreCondiviso.js">
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PaletteColori } from "../palette_e_testi/PaletteColori";
import { Testi } from "../palette_e_testi/Testi";

// I file ora si trovano nella sottocartella "condiviso/"
import SchermataOggiCondivisa from "../screens/condiviso/SchermataOggiCondivisa";
import SchermataCalendarioCondiviso from "../screens/condiviso/SchermataCalendarioCondiviso";
import SchermataGestioneCondivisa from "../screens/condiviso/SchermataGestioneCondivisa";

const Tab = createBottomTabNavigator();

export default function NavigatoreCondiviso() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Oggi")
            iconName = focused ? "today" : "today-outline";
          else if (route.name === "Calendario")
            iconName = focused ? "calendar" : "calendar-outline";
          else if (route.name === "Gestione")
            iconName = focused ? "settings" : "settings-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: PaletteColori.condiviso.primary,
        tabBarInactiveTintColor: PaletteColori.condiviso.textSecondary,
        tabBarStyle: {
          backgroundColor: PaletteColori.condiviso.cardBackground,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "500" },
      })}
    >
      <Tab.Screen
        name="Oggi"
        component={SchermataOggiCondivisa}
        options={{ title: Testi.condiviso.oggiTitle }}
      />
      <Tab.Screen
        name="Calendario"
        component={SchermataCalendarioCondiviso}
        options={{ title: Testi.condiviso.calendarioTitle }}
      />
      <Tab.Screen
        name="Gestione"
        component={SchermataGestioneCondivisa}
        options={{ title: Testi.condiviso.gestioneTitle }}
      />
    </Tab.Navigator>
  );
}
</file>

<file path="src/screens/LoginScreen.js">
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { PaletteColori } from "../palette_e_testi/PaletteColori";
import { Testi } from "../palette_e_testi/Testi";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError(Testi.auth.errorFillAll);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(Testi.auth.errorLogin);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{Testi.auth.loginTitle}</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder={Testi.auth.emailPlaceholder}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder={Testi.auth.passwordPlaceholder}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>{Testi.auth.loginButton}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>{Testi.auth.linkToRegister}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PaletteColori.auth.background,
    justifyContent: "center",
    padding: PaletteColori.spacing.l,
  },
  card: {
    backgroundColor: PaletteColori.auth.cardBackground,
    padding: PaletteColori.spacing.l,
    borderRadius: PaletteColori.borderRadius.card,
    gap: PaletteColori.spacing.m,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: PaletteColori.auth.textMain,
    marginBottom: PaletteColori.spacing.s,
    textAlign: "center",
  },
  input: {
    backgroundColor: PaletteColori.auth.background,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.input,
    color: PaletteColori.auth.textMain,
  },
  button: {
    backgroundColor: PaletteColori.auth.primary,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.button,
    alignItems: "center",
    marginTop: PaletteColori.spacing.s,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkButton: {
    alignItems: "center",
    marginTop: PaletteColori.spacing.s,
  },
  linkText: {
    color: PaletteColori.auth.primary,
  },
  error: {
    color: PaletteColori.auth.error,
    textAlign: "center",
  },
});
</file>

<file path=".gitignore">
# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native
.kotlin/
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local

# typescript
*.tsbuildinfo

# generated native folders
/ios
/android

# Custom
.env
</file>

<file path="src/components/DayDetailsModal.js">
import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { PaletteColori } from "../palette_e_testi/PaletteColori";
import { Testi } from "../palette_e_testi/Testi";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/useAuthStore";

export default function DayDetailsModal({
  visible,
  onClose,
  date,
  tasks,
  onEditTask,
  onDeleteTask,
  onOpenUrl,
  onResetDay,
  onAddTask,
}) {
  const { userData } = useAuthStore();

  const formattedDate = date
    ? new Date(date).toLocaleDateString("it-IT", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  let isBirthday = false;
  if (date && userData?.birthDate) {
    const dayMonthToCheck = date.substring(5);
    const parts = userData.birthDate.split("-");
    if (parts.length === 3) {
      const birthDayMonth = `${parts[1]}-${parts[0]}`;
      if (dayMonthToCheck === birthDayMonth) {
        isBirthday = true;
      }
    }
  }

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Text style={styles.title}>{formattedDate}</Text>

              {onAddTask ? (
                <TouchableOpacity onPress={onAddTask} style={styles.addButton}>
                  <Ionicons name="add" size={22} color="#FFF" />
                </TouchableOpacity>
              ) : null}

              {tasks && tasks.length > 0 && onResetDay ? (
                <TouchableOpacity
                  onPress={onResetDay}
                  style={styles.resetButton}
                >
                  <Ionicons
                    name="reload-outline"
                    size={22}
                    color={PaletteColori.privato.error}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close-circle"
                size={28}
                color={PaletteColori.privato.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea}>
            {isBirthday ? (
              <View style={[styles.taskCard, styles.birthdayCard]}>
                <View style={styles.birthdayIconBox}>
                  <Text style={{ fontSize: 28 }}>🎂</Text>
                </View>
                <View style={styles.taskContent}>
                  <Text style={styles.birthdayTitle}>
                    {Testi.privato.compleannoTitolo}
                  </Text>
                  <Text style={styles.birthdayText}>
                    {Testi.privato.compleannoTesto}
                  </Text>
                </View>
              </View>
            ) : null}

            {tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <View key={task.id} style={styles.taskCard}>
                  <View
                    style={[
                      styles.colorIndicator,
                      { backgroundColor: task.color },
                    ]}
                  />

                  <TouchableOpacity
                    style={styles.taskContent}
                    onPress={() => onEditTask(task)}
                  >
                    <Text
                      style={[
                        styles.taskTitle,
                        task.isCompleted && styles.taskTitleCompleted,
                      ]}
                    >
                      {task.title}
                    </Text>

                    <Text style={styles.taskTime}>
                      {task.isAllDay
                        ? Testi.modali.tuttoIlGiorno
                        : `${task.startTime} - ${task.endTime}`}
                    </Text>

                    {task.description ? (
                      <Text
                        style={styles.taskDescription}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {task.description}
                      </Text>
                    ) : null}
                  </TouchableOpacity>

                  <View style={styles.actionsColumn}>
                    {task.url ? (
                      <TouchableOpacity
                        onPress={() => onOpenUrl(task.url)}
                        style={styles.actionButton}
                      >
                        <Ionicons
                          name="link"
                          size={22}
                          color={PaletteColori.privato.primary}
                        />
                      </TouchableOpacity>
                    ) : null}

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => onEditTask(task)}
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={22}
                        color={PaletteColori.privato.primary}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => onDeleteTask(task.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={22}
                        color={PaletteColori.privato.error}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : !isBirthday ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {Testi.modali.nessunEventoData}
                </Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: PaletteColori.privato.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: PaletteColori.spacing.l,
    minHeight: "50%",
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: PaletteColori.spacing.l,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: PaletteColori.privato.primary,
    textTransform: "capitalize",
  },
  addButton: {
    padding: 6,
    backgroundColor: PaletteColori.privato.primary,
    borderRadius: 12,
  },
  resetButton: {
    padding: 6,
    backgroundColor: "#FFE5E5",
    borderRadius: 12,
  },
  scrollArea: {
    flexGrow: 1,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PaletteColori.privato.background,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.card,
    marginBottom: PaletteColori.spacing.s,
  },
  birthdayCard: {
    backgroundColor: PaletteColori.privato.birthdayBackground,
    borderWidth: 2,
    borderColor: PaletteColori.privato.birthdayBadge,
  },
  birthdayIconBox: {
    marginRight: PaletteColori.spacing.m,
  },
  birthdayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: PaletteColori.privato.birthdayBadge,
  },
  birthdayText: {
    fontSize: 14,
    color: PaletteColori.privato.textMain,
    marginTop: 2,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: PaletteColori.spacing.m,
  },
  taskContent: {
    flex: 1,
    justifyContent: "center",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: PaletteColori.privato.textMain,
  },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: PaletteColori.privato.textSecondary,
  },
  taskTime: {
    fontSize: 12,
    color: PaletteColori.privato.textSecondary,
    marginTop: 2,
  },
  taskDescription: {
    fontSize: 13,
    color: PaletteColori.privato.textSecondary,
    marginTop: 4,
    fontStyle: "italic",
  },
  actionsColumn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: PaletteColori.spacing.s,
  },
  actionButton: {
    padding: 6,
    marginLeft: 4,
  },
  emptyContainer: {
    padding: PaletteColori.spacing.l,
    alignItems: "center",
  },
  emptyText: {
    color: PaletteColori.privato.textSecondary,
    fontStyle: "italic",
  },
});
</file>

<file path="src/components/FixedTaskModal.js">
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Switch,
  ScrollView,
} from "react-native";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { PaletteColori } from "../palette_e_testi/PaletteColori";
import { Testi } from "../palette_e_testi/Testi";
import { useAuthStore } from "../store/useAuthStore";
import TimePickerModal from "./TimePickerModal";

const TASK_COLORS = ["#0A84FF", "#34C759", "#FF3B30", "#AF52DE", "#FF9500"];

export default function FixedTaskModal({ visible, onClose, templateToEdit }) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [title, setTitle] = useState("");
  const [color, setColor] = useState(TASK_COLORS[0]);
  const [isAllDay, setIsAllDay] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerTarget, setPickerTarget] = useState("start");

  useEffect(() => {
    if (templateToEdit) {
      setTitle(templateToEdit.title || "");
      setColor(templateToEdit.color || TASK_COLORS[0]);
      setIsAllDay(templateToEdit.isAllDay ?? true);
      setStartTime(templateToEdit.startTime || "09:00");
      setEndTime(templateToEdit.endTime || "10:00");
      setDescription(templateToEdit.description || "");
      setUrl(templateToEdit.url || "");
    } else {
      setTitle("");
      setColor(TASK_COLORS[0]);
      setIsAllDay(true);
      setStartTime("09:00");
      setEndTime("10:00");
      setDescription("");
      setUrl("");
    }
    setErrorMsg("");
  }, [templateToEdit, visible]);

  const handleSave = async () => {
    if (!title.trim()) return;

    if (!isAllDay) {
      const startTotal =
        parseInt(startTime.split(":")[0]) * 60 +
        parseInt(startTime.split(":")[1]);
      const endTotal =
        parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);
      if (startTotal > endTotal) {
        setErrorMsg(Testi.modali.erroreInizioFine);
        return;
      }
    }

    setLoading(true);
    setErrorMsg("");

    const templateData = {
      title: title.trim(),
      color: color,
      isAllDay: isAllDay,
      startTime: isAllDay ? "" : startTime,
      endTime: isAllDay ? "" : endTime,
      description: description.trim(),
      url: url.trim(),
    };

    try {
      if (templateToEdit) {
        await updateDoc(
          doc(db, "fixed_tasks", templateToEdit.id),
          templateData,
        );

        const qPrivate = query(
          collection(db, "private_tasks"),
          where("userId", "==", user.uid),
          where("templateId", "==", templateToEdit.id),
        );
        const snapPrivate = await getDocs(qPrivate);

        const qShared = query(
          collection(db, "shared_tasks"),
          where("authorId", "==", user.uid),
          where("templateId", "==", templateToEdit.id),
        );
        const snapShared = await getDocs(qShared);

        if (!snapPrivate.empty || !snapShared.empty) {
          const batch = writeBatch(db);
          snapPrivate.forEach((document) => {
            batch.update(document.ref, templateData);
          });
          snapShared.forEach((document) => {
            batch.update(document.ref, templateData);
          });
          await batch.commit();
        }
      } else {
        await addDoc(collection(db, "fixed_tasks"), {
          ...templateData,
          userId: user.uid,
          createdAt: new Date().toISOString(),
        });
      }
      onClose();
    } catch (error) {
      console.error("Errore salvataggio template:", error);
      setErrorMsg("Errore nel salvataggio.");
    } finally {
      setLoading(false);
    }
  };

  const openTimePicker = (target) => {
    setPickerTarget(target);
    setShowTimePicker(true);
  };

  const handleTimeConfirm = (timeStr) => {
    if (pickerTarget === "start") setStartTime(timeStr);
    else setEndTime(timeStr);
    setShowTimePicker(false);
  };

  const renderColorOptions = () => {
    return TASK_COLORS.map((c) => (
      <TouchableOpacity
        key={c}
        style={[
          styles.colorCircle,
          { backgroundColor: c },
          color === c && styles.selectedColor,
        ]}
        onPress={() => setColor(c)}
      />
    ));
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>
            {templateToEdit
              ? Testi.modali.modificaEventoFisso
              : Testi.modali.nuovoEventoFisso}
          </Text>

          {errorMsg !== "" ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <ScrollView style={styles.scrollArea}>
            <TextInput
              style={styles.input}
              placeholder={Testi.modali.titoloPlaceholder}
              value={title}
              onChangeText={setTitle}
            />

            <View style={styles.switchRow}>
              <Text style={styles.label}>{Testi.modali.tuttoIlGiorno}</Text>
              <Switch
                value={isAllDay}
                onValueChange={setIsAllDay}
                trackColor={{
                  false: PaletteColori.privato.textSecondary,
                  true: PaletteColori.privato.primary,
                }}
              />
            </View>

            {!isAllDay ? (
              <View style={styles.dateRow}>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.label}>{Testi.modali.oraInizio}</Text>
                  <TouchableOpacity
                    style={styles.timeBox}
                    onPress={() => openTimePicker("start")}
                  >
                    <Text style={styles.timeText}>{startTime}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.label}>{Testi.modali.oraFine}</Text>
                  <TouchableOpacity
                    style={styles.timeBox}
                    onPress={() => openTimePicker("end")}
                  >
                    <Text style={styles.timeText}>{endTime}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            <Text style={styles.label}>{Testi.modali.descrizioneOptional}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={Testi.modali.descrizionePlaceholder}
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={2}
            />

            <Text style={styles.label}>{Testi.modali.urlOptional}</Text>
            <TextInput
              style={styles.input}
              placeholder={Testi.modali.urlPlaceholder}
              value={url}
              onChangeText={setUrl}
              keyboardType="url"
              autoCapitalize="none"
            />

            <Text style={styles.label}>{Testi.modali.colore}</Text>
            <View style={styles.colorContainer}>{renderColorOptions()}</View>
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>
                {Testi.modali.btnAnnulla}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                !title.trim() && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={loading || !title.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {Testi.modali.btnSalva}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TimePickerModal
          visible={showTimePicker}
          initialTime={pickerTarget === "start" ? startTime : endTime}
          onClose={() => setShowTimePicker(false)}
          onConfirm={handleTimeConfirm}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: PaletteColori.spacing.l,
  },
  modalCard: {
    backgroundColor: PaletteColori.privato.cardBackground,
    padding: PaletteColori.spacing.l,
    borderRadius: PaletteColori.borderRadius.card,
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: PaletteColori.privato.textMain,
    textAlign: "center",
    marginBottom: PaletteColori.spacing.m,
  },
  errorBanner: {
    backgroundColor: "#FFE5E5",
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.input,
    marginBottom: PaletteColori.spacing.m,
  },
  errorText: {
    color: PaletteColori.privato.error,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  scrollArea: { marginBottom: PaletteColori.spacing.m },
  input: {
    backgroundColor: PaletteColori.privato.background,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.input,
    fontSize: 16,
    marginBottom: PaletteColori.spacing.m,
  },
  textArea: { minHeight: 60, textAlignVertical: "top" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: PaletteColori.spacing.m,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: PaletteColori.spacing.m,
    marginBottom: PaletteColori.spacing.m,
  },
  dateInputContainer: { flex: 1 },
  timeBox: {
    backgroundColor: PaletteColori.privato.background,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.input,
    alignItems: "center",
  },
  timeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: PaletteColori.privato.textMain,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: PaletteColori.privato.textSecondary,
    marginBottom: PaletteColori.spacing.s,
  },
  colorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: PaletteColori.spacing.s,
    marginBottom: PaletteColori.spacing.m,
  },
  colorCircle: { width: 32, height: 32, borderRadius: 16 },
  selectedColor: {
    borderWidth: 3,
    borderColor: PaletteColori.privato.textMain,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: PaletteColori.spacing.m,
    borderTopWidth: 1,
    borderTopColor: PaletteColori.privato.background,
    gap: PaletteColori.spacing.m,
  },
  cancelButton: {
    padding: PaletteColori.spacing.m,
    flex: 1,
    alignItems: "center",
    backgroundColor: PaletteColori.privato.background,
    borderRadius: PaletteColori.borderRadius.button,
  },
  cancelButtonText: {
    color: PaletteColori.privato.textSecondary,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: PaletteColori.privato.primary,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.button,
    flex: 1,
    alignItems: "center",
  },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { color: "#FFF", fontWeight: "bold" },
});
</file>

<file path="src/components/ModaleTaskCondiviso.js">
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Switch,
  ScrollView,
} from "react-native";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { PaletteColori } from "../palette_e_testi/PaletteColori";
import { Testi } from "../palette_e_testi/Testi";
import { useAuthStore } from "../store/useAuthStore";
import TimePickerModal from "./TimePickerModal";
import { inviaNotificaIscritti } from "../utils/notificheUtils";

const TASK_COLORS = ["#0A84FF", "#34C759", "#FF3B30", "#AF52DE", "#FF9500"];

export default function ModaleTaskCondiviso({
  visible,
  onClose,
  selectedDate,
  taskToEdit,
}) {
  const { user, activeSharedCalendarId } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [title, setTitle] = useState("");
  const [color, setColor] = useState(TASK_COLORS[0]);
  const [isAllDay, setIsAllDay] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const [fixedTasksList, setFixedTasksList] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerTarget, setPickerTarget] = useState("start");

  const nomeUtente = user?.email?.split("@")[0] || "Un membro";

  useEffect(() => {
    if (!user || !visible || taskToEdit) return;
    const fetchFixed = async () => {
      try {
        const q = query(
          collection(db, "fixed_tasks"),
          where("userId", "==", user.uid),
        );
        const snap = await getDocs(q);
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        setFixedTasksList(list);
      } catch (e) {
        console.error(e);
      }
    };
    fetchFixed();
  }, [user, visible, taskToEdit]);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setColor(taskToEdit.color || TASK_COLORS[0]);
      setIsAllDay(taskToEdit.isAllDay ?? true);
      setStartTime(taskToEdit.startTime || "09:00");
      setEndTime(taskToEdit.endTime || "10:00");
      setDescription(taskToEdit.description || "");
      setUrl(taskToEdit.url || "");
    } else {
      setTitle("");
      setColor(TASK_COLORS[0]);
      setIsAllDay(true);
      setStartTime("09:00");
      setEndTime("10:00");
      setDescription("");
      setUrl("");
    }
    setErrorMsg("");
  }, [taskToEdit, visible, selectedDate]);

  const handleSelectTemplate = (template) => {
    setTitle(template.title || "");
    setColor(template.color || TASK_COLORS[0]);
    setIsAllDay(template.isAllDay ?? true);
    setStartTime(template.startTime || "09:00");
    setEndTime(template.endTime || "10:00");
    setDescription(template.description || "");
    setUrl(template.url || "");
  };

  const handleSave = async () => {
    if (!title.trim() || !activeSharedCalendarId) return;

    if (!isAllDay) {
      const startTotal =
        parseInt(startTime.split(":")[0]) * 60 +
        parseInt(startTime.split(":")[1]);
      const endTotal =
        parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);

      if (startTotal > endTotal) {
        setErrorMsg(Testi.modali.erroreInizioFine);
        return;
      }
    }

    setLoading(true);
    setErrorMsg("");

    const taskData = {
      title: title.trim(),
      color: color,
      isAllDay: isAllDay,
      startTime: isAllDay ? "" : startTime,
      endTime: isAllDay ? "" : endTime,
      description: description.trim(),
      url: url.trim(),
    };

    try {
      if (taskToEdit) {
        await updateDoc(doc(db, "shared_tasks", taskToEdit.id), taskData);
        await inviaNotificaIscritti({
          calendarId: activeSharedCalendarId,
          currentUserId: user.uid,
          title: "Evento Modificato",
          message: `${nomeUtente} ha modificato l'evento "${title.trim()}".`,
          targetDate: selectedDate,
        });
      } else {
        await addDoc(collection(db, "shared_tasks"), {
          ...taskData,
          authorId: user.uid,
          calendarId: activeSharedCalendarId,
          date: selectedDate,
          isCompleted: false,
          createdAt: new Date().toISOString(),
        });
        await inviaNotificaIscritti({
          calendarId: activeSharedCalendarId,
          currentUserId: user.uid,
          title: "Nuovo Evento Condiviso",
          message: `${nomeUtente} ha aggiunto l'evento "${title.trim()}".`,
          targetDate: selectedDate,
        });
      }
      onClose();
    } catch (error) {
      console.error("Errore salvataggio task condiviso:", error);
    } finally {
      setLoading(false);
    }
  };

  const openTimePicker = (target) => {
    setPickerTarget(target);
    setShowTimePicker(true);
  };

  const handleTimeConfirm = (timeStr) => {
    if (pickerTarget === "start") setStartTime(timeStr);
    else setEndTime(timeStr);
    setShowTimePicker(false);
  };

  const renderColorOptions = () => {
    return TASK_COLORS.map((c) => (
      <TouchableOpacity
        key={c}
        style={[
          styles.colorCircle,
          { backgroundColor: c },
          color === c && styles.selectedColor,
        ]}
        onPress={() => setColor(c)}
      />
    ));
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>
            {taskToEdit
              ? Testi.modali.modificaTaskCondiviso
              : Testi.modali.nuovoTaskCondiviso}
          </Text>

          {errorMsg !== "" ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <ScrollView style={styles.scrollArea}>
            {!taskToEdit && fixedTasksList.length > 0 ? (
              <View style={styles.templatePickerBox}>
                <Text style={styles.label}>{Testi.modali.importaFisso}</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.templateChipsRow}
                >
                  {fixedTasksList.map((ft) => (
                    <TouchableOpacity
                      key={ft.id}
                      style={[styles.templateChip, { borderColor: ft.color }]}
                      onPress={() => handleSelectTemplate(ft)}
                    >
                      <View
                        style={[styles.chipDot, { backgroundColor: ft.color }]}
                      />
                      <Text style={styles.chipText}>{ft.title}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder={Testi.modali.titoloPlaceholder}
              value={title}
              onChangeText={setTitle}
            />

            <View style={styles.switchRow}>
              <Text style={styles.label}>{Testi.modali.tuttoIlGiorno}</Text>
              <Switch
                value={isAllDay}
                onValueChange={setIsAllDay}
                trackColor={{
                  false: PaletteColori.condiviso.textSecondary,
                  true: PaletteColori.condiviso.primary,
                }}
              />
            </View>

            {!isAllDay ? (
              <View style={styles.dateRow}>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.label}>{Testi.modali.oraInizio}</Text>
                  <TouchableOpacity
                    style={styles.timeBox}
                    onPress={() => openTimePicker("start")}
                  >
                    <Text style={styles.timeText}>{startTime}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.label}>{Testi.modali.oraFine}</Text>
                  <TouchableOpacity
                    style={styles.timeBox}
                    onPress={() => openTimePicker("end")}
                  >
                    <Text style={styles.timeText}>{endTime}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            <Text style={styles.label}>{Testi.modali.descrizioneOptional}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={Testi.modali.descrizionePlaceholder}
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={3}
            />

            <Text style={styles.label}>{Testi.modali.urlOptional}</Text>
            <TextInput
              style={styles.input}
              placeholder={Testi.modali.urlPlaceholder}
              value={url}
              onChangeText={setUrl}
              keyboardType="url"
              autoCapitalize="none"
            />

            <Text style={styles.label}>{Testi.modali.colore}</Text>
            <View style={styles.colorContainer}>{renderColorOptions()}</View>
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>
                {Testi.modali.btnAnnulla}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                !title.trim() && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={loading || !title.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {Testi.modali.btnSalva}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TimePickerModal
          visible={showTimePicker}
          initialTime={pickerTarget === "start" ? startTime : endTime}
          onClose={() => setShowTimePicker(false)}
          onConfirm={handleTimeConfirm}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: PaletteColori.spacing.l,
  },
  modalCard: {
    backgroundColor: PaletteColori.condiviso.cardBackground,
    padding: PaletteColori.spacing.l,
    borderRadius: PaletteColori.borderRadius.card,
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: PaletteColori.condiviso.textMain,
    textAlign: "center",
    marginBottom: PaletteColori.spacing.m,
  },
  errorBanner: {
    backgroundColor: "#FFE5E5",
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.input,
    marginBottom: PaletteColori.spacing.m,
  },
  errorText: {
    color: PaletteColori.condiviso.error,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  templatePickerBox: {
    marginBottom: PaletteColori.spacing.m,
    backgroundColor: PaletteColori.condiviso.background,
    padding: PaletteColori.spacing.s,
    borderRadius: PaletteColori.borderRadius.input,
  },
  templateChipsRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  templateChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PaletteColori.condiviso.cardBackground,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: PaletteColori.condiviso.textMain,
  },
  scrollArea: { marginBottom: PaletteColori.spacing.m },
  input: {
    backgroundColor: PaletteColori.condiviso.background,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.input,
    fontSize: 16,
    marginBottom: PaletteColori.spacing.m,
  },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: PaletteColori.spacing.m,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: PaletteColori.spacing.m,
    marginBottom: PaletteColori.spacing.m,
  },
  dateInputContainer: { flex: 1 },
  timeBox: {
    backgroundColor: PaletteColori.condiviso.background,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.input,
    alignItems: "center",
  },
  timeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: PaletteColori.condiviso.textMain,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: PaletteColori.condiviso.textSecondary,
    marginBottom: PaletteColori.spacing.s,
  },
  colorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: PaletteColori.spacing.s,
    marginBottom: PaletteColori.spacing.m,
  },
  colorCircle: { width: 32, height: 32, borderRadius: 16 },
  selectedColor: {
    borderWidth: 3,
    borderColor: PaletteColori.condiviso.textMain,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: PaletteColori.spacing.m,
    borderTopWidth: 1,
    borderTopColor: PaletteColori.condiviso.background,
  },
  cancelButton: {
    padding: PaletteColori.spacing.m,
    flex: 1,
    alignItems: "center",
  },
  cancelButtonText: {
    color: PaletteColori.condiviso.textSecondary,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: PaletteColori.condiviso.primary,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.button,
    flex: 1,
    alignItems: "center",
  },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { color: "#FFF", fontWeight: "bold" },
});
</file>

<file path="src/components/TaskModal.js">
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Switch,
  ScrollView,
} from "react-native";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { PaletteColori } from "../palette_e_testi/PaletteColori";
import { Testi } from "../palette_e_testi/Testi";
import { useAuthStore } from "../store/useAuthStore";
import TimePickerModal from "./TimePickerModal";
import { Ionicons } from "@expo/vector-icons";

const TASK_COLORS = ["#0A84FF", "#34C759", "#FF3B30", "#AF52DE", "#FF9500"];

export default function TaskModal({
  visible,
  onClose,
  selectedDate,
  taskToEdit,
}) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [title, setTitle] = useState("");
  const [color, setColor] = useState(TASK_COLORS[0]);
  const [isAllDay, setIsAllDay] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const [fixedTasksList, setFixedTasksList] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerTarget, setPickerTarget] = useState("start");

  useEffect(() => {
    if (!user || !visible || taskToEdit) return;
    const fetchFixed = async () => {
      try {
        const q = query(
          collection(db, "fixed_tasks"),
          where("userId", "==", user.uid),
        );
        const snap = await getDocs(q);
        const list = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
        setFixedTasksList(list);
      } catch (e) {
        console.error(e);
      }
    };
    fetchFixed();
  }, [user, visible, taskToEdit]);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setColor(taskToEdit.color || TASK_COLORS[0]);
      setIsAllDay(taskToEdit.isAllDay ?? true);
      setStartTime(taskToEdit.startTime || "09:00");
      setEndTime(taskToEdit.endTime || "10:00");
      setDescription(taskToEdit.description || "");
      setUrl(taskToEdit.url || "");
    } else {
      setTitle("");
      setColor(TASK_COLORS[0]);
      setIsAllDay(true);
      setStartTime("09:00");
      setEndTime("10:00");
      setDescription("");
      setUrl("");
    }
    setErrorMsg("");
  }, [taskToEdit, visible, selectedDate]);

  const handleSelectTemplate = (template) => {
    setTitle(template.title || "");
    setColor(template.color || TASK_COLORS[0]);
    setIsAllDay(template.isAllDay ?? true);
    setStartTime(template.startTime || "09:00");
    setEndTime(template.endTime || "10:00");
    setDescription(template.description || "");
    setUrl(template.url || "");
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    if (!isAllDay) {
      const startTotal =
        parseInt(startTime.split(":")[0]) * 60 +
        parseInt(startTime.split(":")[1]);
      const endTotal =
        parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);

      if (startTotal > endTotal) {
        setErrorMsg(Testi.modali.erroreInizioFine);
        return;
      }
    }

    setLoading(true);
    setErrorMsg("");

    const taskData = {
      title: title.trim(),
      color: color,
      isAllDay: isAllDay,
      startTime: isAllDay ? "" : startTime,
      endTime: isAllDay ? "" : endTime,
      description: description.trim(),
      url: url.trim(),
    };

    try {
      if (taskToEdit) {
        await updateDoc(doc(db, "private_tasks", taskToEdit.id), taskData);
      } else {
        await addDoc(collection(db, "private_tasks"), {
          ...taskData,
          userId: user.uid,
          date: selectedDate,
          isCompleted: false,
          createdAt: new Date().toISOString(),
        });
      }
      onClose();
    } catch (error) {
      console.error("Errore salvataggio task:", error);
    } finally {
      setLoading(false);
    }
  };

  const openTimePicker = (target) => {
    setPickerTarget(target);
    setShowTimePicker(true);
  };

  const handleTimeConfirm = (timeStr) => {
    if (pickerTarget === "start") {
      setStartTime(timeStr);
    } else {
      setEndTime(timeStr);
    }
    setShowTimePicker(false);
  };

  const renderColorOptions = () => {
    return TASK_COLORS.map((c) => (
      <TouchableOpacity
        key={c}
        style={[
          styles.colorCircle,
          { backgroundColor: c },
          color === c && styles.selectedColor,
        ]}
        onPress={() => setColor(c)}
      />
    ));
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>
            {taskToEdit
              ? Testi.modali.modificaTaskPrivato
              : Testi.modali.nuovoTaskPrivato}
          </Text>

          {errorMsg !== "" && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          <ScrollView style={styles.scrollArea}>
            {!taskToEdit && fixedTasksList.length > 0 ? (
              <View style={styles.templatePickerBox}>
                <Text style={styles.label}>{Testi.modali.importaFisso}</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.templateChipsRow}
                >
                  {fixedTasksList.map((ft) => (
                    <TouchableOpacity
                      key={ft.id}
                      style={[styles.templateChip, { borderColor: ft.color }]}
                      onPress={() => handleSelectTemplate(ft)}
                    >
                      <View
                        style={[styles.chipDot, { backgroundColor: ft.color }]}
                      />
                      <Text style={styles.chipText}>{ft.title}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder={Testi.modali.titoloPlaceholder}
              value={title}
              onChangeText={setTitle}
            />

            <View style={styles.switchRow}>
              <Text style={styles.label}>{Testi.modali.tuttoIlGiorno}</Text>
              <Switch
                value={isAllDay}
                onValueChange={setIsAllDay}
                trackColor={{
                  false: PaletteColori.privato.textSecondary,
                  true: PaletteColori.privato.primary,
                }}
              />
            </View>

            {!isAllDay && (
              <View style={styles.dateRow}>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.label}>{Testi.modali.oraInizio}</Text>
                  <TouchableOpacity
                    style={styles.timeBox}
                    onPress={() => openTimePicker("start")}
                  >
                    <Text style={styles.timeText}>{startTime}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.label}>{Testi.modali.oraFine}</Text>
                  <TouchableOpacity
                    style={styles.timeBox}
                    onPress={() => openTimePicker("end")}
                  >
                    <Text style={styles.timeText}>{endTime}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <Text style={styles.label}>{Testi.modali.descrizioneOptional}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={Testi.modali.descrizionePlaceholder}
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={3}
            />

            <Text style={styles.label}>{Testi.modali.urlOptional}</Text>
            <TextInput
              style={styles.input}
              placeholder={Testi.modali.urlPlaceholder}
              value={url}
              onChangeText={setUrl}
              keyboardType="url"
              autoCapitalize="none"
            />

            <Text style={styles.label}>{Testi.modali.colore}</Text>
            <View style={styles.colorContainer}>{renderColorOptions()}</View>
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>
                {Testi.modali.btnAnnulla}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                !title.trim() && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={loading || !title.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {Testi.modali.btnSalva}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TimePickerModal
          visible={showTimePicker}
          initialTime={pickerTarget === "start" ? startTime : endTime}
          onClose={() => setShowTimePicker(false)}
          onConfirm={handleTimeConfirm}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: PaletteColori.spacing.l,
  },
  modalCard: {
    backgroundColor: PaletteColori.privato.cardBackground,
    padding: PaletteColori.spacing.l,
    borderRadius: PaletteColori.borderRadius.card,
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: PaletteColori.privato.textMain,
    textAlign: "center",
    marginBottom: PaletteColori.spacing.m,
  },
  errorBanner: {
    backgroundColor: "#FFE5E5",
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.input,
    marginBottom: PaletteColori.spacing.m,
  },
  errorText: {
    color: PaletteColori.privato.error,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  templatePickerBox: {
    marginBottom: PaletteColori.spacing.m,
    backgroundColor: PaletteColori.privato.background,
    padding: PaletteColori.spacing.s,
    borderRadius: PaletteColori.borderRadius.input,
  },
  templateChipsRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  templateChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PaletteColori.privato.cardBackground,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: PaletteColori.privato.textMain,
  },
  scrollArea: {
    marginBottom: PaletteColori.spacing.m,
  },
  input: {
    backgroundColor: PaletteColori.privato.background,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.input,
    fontSize: 16,
    marginBottom: PaletteColori.spacing.m,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: PaletteColori.spacing.m,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: PaletteColori.spacing.m,
    marginBottom: PaletteColori.spacing.m,
  },
  dateInputContainer: {
    flex: 1,
  },
  timeBox: {
    backgroundColor: PaletteColori.privato.background,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.input,
    alignItems: "center",
  },
  timeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: PaletteColori.privato.textMain,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: PaletteColori.privato.textSecondary,
    marginBottom: PaletteColori.spacing.s,
  },
  colorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: PaletteColori.spacing.s,
    marginBottom: PaletteColori.spacing.m,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: PaletteColori.privato.textMain,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: PaletteColori.spacing.m,
    borderTopWidth: 1,
    borderTopColor: PaletteColori.privato.background,
  },
  cancelButton: {
    padding: PaletteColori.spacing.m,
    flex: 1,
    alignItems: "center",
  },
  cancelButtonText: {
    color: PaletteColori.privato.textSecondary,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: PaletteColori.privato.primary,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.button,
    flex: 1,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
</file>

<file path="src/navigation/PrivateNavigator.js">
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PaletteColori } from "../palette_e_testi/PaletteColori";
import { Testi } from "../palette_e_testi/Testi";

// I file ora si trovano nella sottocartella "privato/"
import PrivateTodayScreen from "../screens/privato/PrivateTodayScreen";
import PrivateCalendarScreen from "../screens/privato/PrivateCalendarScreen";

const Tab = createBottomTabNavigator();

export default function PrivateNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Today") {
            iconName = focused ? "today" : "today-outline";
          } else if (route.name === "Calendar") {
            iconName = focused ? "calendar" : "calendar-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: PaletteColori.privato.primary,
        tabBarInactiveTintColor: PaletteColori.privato.textSecondary,
        tabBarStyle: {
          backgroundColor: PaletteColori.privato.cardBackground,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      })}
    >
      <Tab.Screen
        name="Today"
        component={PrivateTodayScreen}
        options={{ title: Testi.privato.oggiTitle }}
      />
      <Tab.Screen
        name="Calendar"
        component={PrivateCalendarScreen}
        options={{ title: Testi.privato.calendarioTitle }}
      />
    </Tab.Navigator>
  );
}
</file>

<file path="src/screens/RegisterScreen.js">
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { PaletteColori } from "../palette_e_testi/PaletteColori";
import { Testi } from "../palette_e_testi/Testi";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!username || !birthDate || !email || !password) {
      setError(Testi.auth.errorFillAll);
      return;
    }

    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/;
    if (!dateRegex.test(birthDate.trim())) {
      setError(Testi.auth.errorInvalidDate);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username.trim(),
        email: email.trim(),
        birthDate: birthDate.trim(),
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err.message || Testi.auth.errorRegister);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{Testi.auth.registerTitle}</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder={Testi.auth.usernamePlaceholder}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder={Testi.auth.birthDatePlaceholder}
          value={birthDate}
          onChangeText={setBirthDate}
        />

        <TextInput
          style={styles.input}
          placeholder={Testi.auth.emailPlaceholder}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder={Testi.auth.passwordPlaceholder}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>{Testi.auth.registerButton}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>{Testi.auth.linkToLogin}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: PaletteColori.auth.background,
    justifyContent: "center",
    padding: PaletteColori.spacing.l,
  },
  card: {
    backgroundColor: PaletteColori.auth.cardBackground,
    padding: PaletteColori.spacing.l,
    borderRadius: PaletteColori.borderRadius.card,
    gap: PaletteColori.spacing.m,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: PaletteColori.auth.textMain,
    marginBottom: PaletteColori.spacing.s,
    textAlign: "center",
  },
  input: {
    backgroundColor: PaletteColori.auth.background,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.input,
    color: PaletteColori.auth.textMain,
  },
  button: {
    backgroundColor: PaletteColori.auth.primary,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.button,
    alignItems: "center",
    marginTop: PaletteColori.spacing.s,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkButton: {
    alignItems: "center",
    marginTop: PaletteColori.spacing.s,
  },
  linkText: {
    color: PaletteColori.auth.primary,
  },
  error: {
    color: PaletteColori.auth.error,
    textAlign: "center",
  },
});
</file>

<file path="src/store/useAuthStore.js">
import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const useAuthStore = create((set) => ({
  user: null,
  userData: null, // Conterrà il documento Firestore (incluso birthDate)
  isLoading: true,
  activeSharedCalendarId: null,

  setUser: (user) => set({ user }),
  setUserData: (userData) => set({ userData }),
  setLoading: (isLoading) => set({ isLoading }),
  setActiveSharedCalendarId: (id) => set({ activeSharedCalendarId: id }),

  fetchUserData: async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({ userData: docSnap.data() });
      }
    } catch (error) {
      console.error("Errore fetch userData:", error);
    }
  },
}));
</file>

<file path="package.json">
{
  "name": "temp-app",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "@expo/metro-runtime": "~57.0.6",
    "@expo/vector-icons": "^15.0.2",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@react-navigation/bottom-tabs": "^7.18.12",
    "@react-navigation/material-top-tabs": "^7.6.11",
    "@react-navigation/native": "^7.3.12",
    "@react-navigation/stack": "^7.10.15",
    "expo": "~57.0.7",
    "expo-status-bar": "~57.0.1",
    "firebase": "^12.16.0",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-native": "0.86.0",
    "react-native-calendars": "^1.1314.0",
    "react-native-pager-view": "8.0.2",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "4.25.2",
    "react-native-tab-view": "^4.3.2",
    "react-native-web": "^0.21.2",
    "zustand": "^5.0.14"
  },
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "private": true
}
</file>

<file path="src/navigation/MainNavigator.js">
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PrivateNavigator from "./PrivateNavigator";
import NavigatoreCondiviso from "./NavigatoreCondiviso";

const Tab = createMaterialTopTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { display: "none" },
      }}
    >
      <Tab.Screen name="PrivateArea" component={PrivateNavigator} />
      <Tab.Screen name="SharedArea" component={NavigatoreCondiviso} />
    </Tab.Navigator>
  );
}
</file>

<file path="App.js">
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { auth } from "./src/config/firebase";
import { useAuthStore } from "./src/store/useAuthStore";
import { PaletteColori } from "./src/palette_e_testi/PaletteColori";

// Percorsi aggiornati per Login e Register (ora sono nella root di screens)
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import MainNavigator from "./src/navigation/MainNavigator";

const Stack = createStackNavigator();

export default function App() {
  const { user, isLoading, setUser, setLoading, fetchUserData } =
    useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser.uid);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={PaletteColori.auth.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <Stack.Screen name="Home" component={MainNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
</file>

</files>
