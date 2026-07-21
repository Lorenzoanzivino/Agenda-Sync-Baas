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
import { db } from "../config/firebase";
import { theme } from "../constants/theme";
import { useAuthStore } from "../store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";

import FixedTaskModal from "../components/FixedTaskModal";
import DayDetailsModal from "../components/DayDetailsModal";
import TaskModal from "../components/TaskModal";

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

export default function PrivateCalendarScreen() {
  const { user } = useAuthStore();

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

  // 1. Fetch dei Task Fissi (Template)
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

  // 2. Fetch di TUTTI i task privati dell'utente
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

  // 3. Fetch dei task per il giorno selezionato (DayDetailsModal)
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
          selectedColor: theme.colors.primaryPrivate,
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
          `Errore: Questo evento è già presente in una o più date selezionate (${conflictingDates.join(", ")})!`,
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
      alert("Eventi inseriti con successo!");
    } catch (error) {
      setErrorBanner("Errore durante l'inserimento nel calendario.");
    } finally {
      setIsInserting(false);
    }
  };

  const deleteTemplate = async (id) => {
    if (
      window.confirm(
        "Vuoi davvero eliminare questo evento fisso? I task già inseriti nel calendario rimarranno intatti.",
      )
    ) {
      await deleteDoc(doc(db, "fixed_tasks", id));
      if (selectedTemplateId === id) {
        setSelectedTemplateId(null);
        setSelectedDates({});
      }
    }
  };

  const resetAllCalendarTasks = async () => {
    if (allPrivateTasks.length === 0) return;
    if (
      window.confirm(
        "Sei sicuro di voler svuotare tutte le caselle del calendario dai task?",
      )
    ) {
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
    if (
      window.confirm(
        "Sei sicuro di voler svuotare l'intera lista dei task fissi?",
      )
    ) {
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
      window.confirm(
        `Sei sicuro di voler svuotare tutti i task del giorno ${selectedDayDate}?`,
      )
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
      else alert("Impossibile aprire il link.");
    } catch (error) {
      alert("Errore nell'apertura del link.");
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
                ? "Tutto il giorno"
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
                color={theme.colors.primaryPrivate}
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
              color={theme.colors.primaryPrivate}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => deleteTemplate(task.id)}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={theme.colors.error}
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
        <Text style={styles.title}>Calendario</Text>
        {allPrivateTasks.length > 0 ? (
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
            return (
              <TouchableOpacity
                onPress={() => onDayPress(date)}
                style={[
                  styles.calendarDayCell,
                  isSelected && styles.calendarDayCellSelected,
                ]}
              >
                <Text
                  style={[
                    styles.calendarDayText,
                    state === "disabled" && styles.disabledText,
                    isSelected && styles.calendarDayTextSelected,
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
            todayTextColor: theme.colors.primaryPrivate,
            dayTextColor: theme.colors.textMain,
            arrowColor: theme.colors.primaryPrivate,
            monthTextColor: theme.colors.textMain,
          }}
        />
      </View>

      <View style={styles.sectionHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={styles.sectionTitle}>I Tuoi Eventi Fissi</Text>
          {fixedTasks.length > 0 ? (
            <TouchableOpacity
              onPress={resetFixedTasksList}
              style={styles.resetButton}
            >
              <Ionicons
                name="reload-outline"
                size={18}
                color={theme.colors.error}
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
            color={theme.colors.primaryPrivate}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.templatesContainer}>
        {fixedTasks.length === 0 ? (
          <Text style={styles.emptyText}>
            Crea un evento fisso per inserirlo velocemente nel calendario.
          </Text>
        ) : (
          renderFixedTasks()
        )}
      </ScrollView>

      {numSelectedDates > 0 && selectedTemplateId ? (
        <View style={styles.batchActionCard}>
          <Text style={styles.batchText}>
            Inserisci in{" "}
            <Text style={{ fontWeight: "bold" }}>{numSelectedDates}</Text> date
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
          if (window.confirm("Vuoi davvero eliminare questo task?")) {
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
    backgroundColor: theme.colors.privateBackground,
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
    color: theme.colors.primaryPrivate,
  },
  resetButton: {
    padding: 6,
    backgroundColor: "#FFE5E5",
    borderRadius: 12,
  },
  errorBanner: {
    backgroundColor: "#FFE5E5",
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.input,
    marginBottom: theme.spacing.m,
  },
  errorText: {
    color: theme.colors.error,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
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
    backgroundColor: theme.colors.privateBackground,
    position: "relative",
  },
  calendarDayCellSelected: {
    backgroundColor: theme.colors.primaryPrivate,
  },
  calendarDayText: {
    fontSize: 14,
    color: theme.colors.textMain,
    fontWeight: "500",
  },
  calendarDayTextSelected: {
    color: "#FFF",
    fontWeight: "bold",
  },
  disabledText: {
    color: theme.colors.textSecondary,
    opacity: 0.4,
  },
  badgeContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primaryPrivate,
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
    marginBottom: theme.spacing.s,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.textMain,
  },
  templatesContainer: {
    flex: 1,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
  templateCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.card,
    marginBottom: theme.spacing.s,
    borderWidth: 2,
    borderColor: "transparent",
  },
  templateCardSelected: {
    borderColor: theme.colors.primaryPrivate,
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
    marginRight: theme.spacing.s,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.textMain,
  },
  templateTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  templateDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
    fontStyle: "italic",
  },
  actionsColumn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: theme.spacing.s,
  },
  actionButton: {
    padding: 6,
    marginLeft: 4,
  },
  batchActionCard: {
    position: "absolute",
    bottom: theme.spacing.l,
    left: theme.spacing.l,
    right: theme.spacing.l,
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.card,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  batchText: {
    fontSize: 16,
    color: theme.colors.textMain,
  },
  batchButton: {
    backgroundColor: theme.colors.primaryPrivate,
    padding: theme.spacing.s,
    borderRadius: 12,
    width: 48,
    alignItems: "center",
  },
});
