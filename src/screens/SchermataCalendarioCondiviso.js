import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { theme } from "../constants/theme";
import { useAuthStore } from "../store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";

import ModaleDettagliCondiviso from "../components/ModaleDettagliCondiviso";
import ModaleTaskCondiviso from "../components/ModaleTaskCondiviso";

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
  today: "Oggi",
};
LocaleConfig.defaultLocale = "it";

export default function SchermataCalendarioCondiviso() {
  const { activeSharedCalendarId } = useAuthStore();
  const [calendarName, setCalendarName] = useState("");
  const [allSharedTasks, setAllSharedTasks] = useState([]);

  const [isDayModalVisible, setIsDayModalVisible] = useState(false);
  const [selectedDayDate, setSelectedDayDate] = useState(null);
  const [dayTasks, setDayTasks] = useState([]);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Fetch del nome del calendario attivo
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

  // Fetch di tutti i task del calendario
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

  // Fetch dei task specifici di una giornata
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
    const marks = {};
    const countsByDate = {};
    allSharedTasks.forEach((t) => {
      if (t.date) countsByDate[t.date] = (countsByDate[t.date] || 0) + 1;
    });

    Object.keys(countsByDate).forEach((dateStr) => {
      marks[dateStr] = {
        customStyles: {
          container: { backgroundColor: "#FFE0B2", borderRadius: 8 },
          text: { color: theme.colors.textMain, fontWeight: "bold" },
        },
      };
    });
    return marks;
  };

  const onDayPress = (day) => {
    setSelectedDayDate(day.dateString);
    setIsDayModalVisible(true);
  };

  const resetAllCalendarTasks = async () => {
    if (allSharedTasks.length === 0) return;
    if (
      window.confirm(
        `Vuoi svuotare interamente il calendario "${calendarName}"? Tutti i task verranno eliminati.`,
      )
    ) {
      try {
        const batch = writeBatch(db);
        allSharedTasks.forEach((t) =>
          batch.delete(doc(db, "shared_tasks", t.id)),
        );
        await batch.commit();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const resetSpecificDayTasks = async () => {
    if (!selectedDayDate || dayTasks.length === 0) return;
    if (window.confirm(`Svuotare i task condivisi del ${selectedDayDate}?`)) {
      try {
        const batch = writeBatch(db);
        dayTasks.forEach((dt) => batch.delete(doc(db, "shared_tasks", dt.id)));
        await batch.commit();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const openUrl = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else alert("Impossibile aprire il link.");
    } catch (error) {
      alert("Errore");
    }
  };

  const getTaskCountForDate = (dateString) =>
    allSharedTasks.filter((t) => t.date === dateString).length;

  if (!activeSharedCalendarId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Calendario</Text>
        <Text style={styles.emptyText}>
          Seleziona o crea un calendario condiviso nella sezione Gestione.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.calendarHeaderRow}>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.title}>Calendario</Text>
          <Text style={styles.headerSubtitle}>{calendarName}</Text>
        </View>
        {allSharedTasks.length > 0 ? (
          <TouchableOpacity
            onPress={resetAllCalendarTasks}
            style={styles.resetButton}
          >
            <Ionicons
              name="reload-outline"
              size={22}
              color={theme.colors.error}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.bentoCard}>
        <Calendar
          markingType={"custom"}
          onDayPress={onDayPress}
          markedDates={getMarkedDates()}
          dayComponent={({ date, state }) => {
            const count = getTaskCountForDate(date.dateString);
            return (
              <TouchableOpacity
                onPress={() => onDayPress(date)}
                style={styles.calendarDayCell}
              >
                <Text
                  style={[
                    styles.calendarDayText,
                    state === "disabled" && styles.disabledText,
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
            calendarBackground: theme.colors.cardBackground,
            textSectionTitleColor: theme.colors.textSecondary,
            todayTextColor: theme.colors.primaryShared,
            dayTextColor: theme.colors.textMain,
            arrowColor: theme.colors.primaryShared,
            monthTextColor: theme.colors.textMain,
          }}
        />
      </View>

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
          if (window.confirm("Vuoi eliminare questo task condiviso?"))
            await deleteDoc(doc(db, "shared_tasks", taskId));
        }}
        onOpenUrl={openUrl}
      />

      <ModaleTaskCondiviso
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
    backgroundColor: theme.colors.sharedBackground,
    padding: theme.spacing.l,
    paddingTop: theme.spacing.l * 2,
  },
  calendarHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.m,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.primaryShared,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: "bold",
    marginTop: 2,
  },
  resetButton: { padding: 6, backgroundColor: "#FFE5E5", borderRadius: 12 },
  bentoCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.m,
    overflow: "hidden",
    marginBottom: theme.spacing.m,
  },
  calendarDayCell: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    backgroundColor: theme.colors.sharedBackground,
    position: "relative",
  },
  calendarDayText: {
    fontSize: 14,
    color: theme.colors.textMain,
    fontWeight: "500",
  },
  disabledText: { color: theme.colors.textSecondary, opacity: 0.4 },
  badgeContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primaryShared,
    borderRadius: 6,
    minWidth: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  badgeText: { color: "#FFF", fontSize: 9, fontWeight: "bold" },
  emptyText: { color: theme.colors.textSecondary, textAlign: "center" },
});
