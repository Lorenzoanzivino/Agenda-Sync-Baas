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
