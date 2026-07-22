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
import { auth, db } from "../config/firebase";
import { theme } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/useAuthStore";
import TaskModal from "../components/TaskModal";

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

  // Estraiamo MM-DD da todayISO (es. "09-09")
  const todayDayMonth = todayISO.substring(5);

  // Estraiamo MM-DD dalla data di nascita salvata (DD-MM-YYYY) se esiste
  let isBirthday = false;
  if (userData?.birthDate) {
    const parts = userData.birthDate.split("-");
    if (parts.length === 3) {
      // Invertiamo per avere MM-DD
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
    if (window.confirm("Vuoi davvero eliminare questo task?")) {
      await deleteDoc(doc(db, "private_tasks", id));
    }
  };

  const resetTodayTasks = async () => {
    if (tasks.length === 0) return;
    if (window.confirm("Sei sicuro di voler svuotare tutti i task di oggi?")) {
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
        alert(
          "Impossibile aprire il link. Verifica che l'URL sia corretto (es: https://...)",
        );
      }
    } catch (error) {
      alert("Errore nell'apertura del link.");
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
          <Text style={styles.birthdayTitle}>Tanti Auguri!</Text>
          <Text style={styles.birthdayText}>
            Oggi è il tuo compleanno! Goditi questa giornata.
          </Text>
        </View>
      </View>
    );
  };

  const renderTasks = () => {
    if (tasks.length === 0) {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Nessun task per oggi</Text>
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
            color={task.isCompleted ? theme.colors.textSecondary : task.color}
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
                color={theme.colors.primaryPrivate}
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
              color={theme.colors.primaryPrivate}
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
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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

        <TouchableOpacity onPress={() => auth.signOut()}>
          <Ionicons
            name="log-out-outline"
            size={28}
            color={theme.colors.error}
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
    backgroundColor: theme.colors.privateBackground,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.l,
    paddingBottom: theme.spacing.s,
    paddingTop: theme.spacing.l * 2,
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
  scrollContent: {
    padding: theme.spacing.l,
    paddingBottom: 100,
  },
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
  emptyText: {
    color: theme.colors.textSecondary,
  },
  birthdayCard: {
    backgroundColor: "#FFF0F5",
    borderWidth: 2,
    borderColor: "#FF69B4",
  },
  birthdayIconBox: {
    marginRight: theme.spacing.m,
  },
  birthdayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF1493",
  },
  birthdayText: {
    fontSize: 14,
    color: theme.colors.textMain,
    marginTop: 2,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.card,
    marginBottom: theme.spacing.s,
  },
  taskCompleted: {
    opacity: 0.6,
  },
  taskCheckbox: {
    marginRight: theme.spacing.m,
  },
  taskContent: {
    flex: 1,
    justifyContent: "center",
  },
  taskTitle: {
    fontSize: 16,
    color: theme.colors.textMain,
    fontWeight: "bold",
  },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: theme.colors.textSecondary,
  },
  taskTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
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
  actionButton: {
    padding: 6,
    marginLeft: 4,
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing.l,
    right: theme.spacing.l,
    backgroundColor: theme.colors.primaryPrivate,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
