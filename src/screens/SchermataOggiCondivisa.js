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
import { db } from "../config/firebase";
import { theme } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/useAuthStore";
import ModaleTaskCondiviso from "../components/ModaleTaskCondiviso";
import CampanellaNotifiche from "../components/CampanellaNotifiche";

export default function SchermataOggiCondivisa() {
  const { activeSharedCalendarId } = useAuthStore();
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

  // Fetch dei task del calendario attivo
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

  const deleteTask = async (id) => {
    if (window.confirm("Vuoi davvero eliminare questo task condiviso?")) {
      await deleteDoc(doc(db, "shared_tasks", id));
    }
  };

  const resetTodayTasks = async () => {
    if (tasks.length === 0) return;
    if (
      window.confirm(
        `Sei sicuro di voler svuotare tutti i task di oggi per il calendario "${calendarName}"?`,
      )
    ) {
      try {
        const batch = writeBatch(db);
        tasks.forEach((t) => batch.delete(doc(db, "shared_tasks", t.id)));
        await batch.commit();
      } catch (e) {
        console.error("Errore reset:", e);
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

  const openNewTaskModal = () => {
    if (!activeSharedCalendarId) {
      alert("Seleziona prima un calendario condiviso dalla sezione Gestione.");
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
          <Text style={styles.title}>Oggi</Text>
        </View>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            Seleziona o crea un calendario condiviso nella sezione Gestione.
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
            <Text style={styles.title}>Oggi</Text>
            {tasks.length > 0 ? (
              <TouchableOpacity
                onPress={resetTodayTasks}
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
          <Text style={styles.headerSubtitle}>Calendario: {calendarName}</Text>
        </View>

        {/* Campanella delle notifiche in-app */}
        <CampanellaNotifiche
          onNavigateToDate={(date) => {
            // L'integrazione completa del click notifica (navigazione)
            // avverrà in un task successivo. Per ora la modale si chiude.
            console.log("Naviga alla data: ", date);
          }}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.dateHeaderCard}>
          <Text style={styles.dateText}>{todayFormatted}</Text>
        </View>

        {tasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Nessun task condiviso per oggi</Text>
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
                    task.isCompleted ? theme.colors.textSecondary : task.color
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
                    ? "Tutto il giorno"
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
                      color={theme.colors.primaryShared}
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
                    color={theme.colors.primaryShared}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteTask(task.id)}
                  style={styles.actionButton}
                >
                  <Ionicons
                    name="trash-outline"
                    size={22}
                    color={theme.colors.error}
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
  container: { flex: 1, backgroundColor: theme.colors.sharedBackground },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: theme.spacing.l,
    paddingBottom: theme.spacing.s,
    paddingTop: theme.spacing.l * 2,
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
  scrollContent: { padding: theme.spacing.l, paddingBottom: 100 },
  dateHeaderCard: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.card,
    alignItems: "center",
    marginBottom: theme.spacing.m,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.textMain,
    textTransform: "capitalize",
  },
  emptyCard: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.card,
    alignItems: "center",
  },
  emptyText: { color: theme.colors.textSecondary, textAlign: "center" },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.card,
    marginBottom: theme.spacing.s,
  },
  taskCompleted: { opacity: 0.6 },
  taskCheckbox: { marginRight: theme.spacing.m },
  taskContent: { flex: 1, justifyContent: "center" },
  taskTitle: { fontSize: 16, color: theme.colors.textMain, fontWeight: "bold" },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: theme.colors.textSecondary,
  },
  taskTime: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  taskDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
    fontStyle: "italic",
  },
  actionsColumn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: theme.spacing.s,
  },
  actionButton: { padding: 6, marginLeft: 4 },
  fab: {
    position: "absolute",
    bottom: theme.spacing.l,
    right: theme.spacing.l,
    backgroundColor: theme.colors.primaryShared,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});
