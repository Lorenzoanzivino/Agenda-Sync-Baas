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
  addDoc,
  doc,
  deleteDoc,
  writeBatch,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { PaletteColori } from "../../palette_e_testi/PaletteColori";
import { Testi } from "../../palette_e_testi/Testi";
import { useAuthStore } from "../../store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";

import { useFixedTasks } from "../../hooks/useFixedTasks";
import { useSharedTasks } from "../../hooks/useSharedTasks";
import { confermaAzione } from "../../utils/alertUtils";

// Nuove importazioni unificate
import DayDetailsModal from "../../components/DayDetailsModal";
import TaskModal from "../../components/TaskModal";

import FixedTaskModal from "../../components/FixedTaskModal";
import CampanellaNotifiche from "../../components/CampanellaNotifiche";
import { inviaNotificaIscritti } from "../../utils/notificheUtils";

LocaleConfig.locales["it"] = {
  monthNames: [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
  ],
  monthNamesShort: [
    "Gen", "Feb", "Mar", "Apr", "Mag", "Giu",
    "Lug", "Ago", "Set", "Ott", "Nov", "Dic",
  ],
  dayNames: [
    "Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato",
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

  const [selectedDates, setSelectedDates] = useState({});
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [isInserting, setIsInserting] = useState(false);
  const [errorBanner, setErrorBanner] = useState("");

  const [isDayModalVisible, setIsDayModalVisible] = useState(false);
  const [selectedDayDate, setSelectedDayDate] = useState(null);

  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [isFixedModalVisible, setFixedModalVisible] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState(null);

  const nomeUtente = user?.email?.split("@")[0] || "Un membro";
  const todayISO = new Date().toISOString().split("T")[0];

  const { tasks: allSharedTasks } = useSharedTasks(activeSharedCalendarId);
  const { tasks: dayTasks } = useSharedTasks(activeSharedCalendarId, selectedDayDate);
  const { fixedTasks: personalFixedTasks } = useFixedTasks(user?.uid);

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

  const deleteTemplate = (id) => {
    confermaAzione("Vuoi eliminare questo evento fisso personale?", async () => {
      await deleteDoc(doc(db, "fixed_tasks", id));
      if (selectedTemplateId === id) {
        setSelectedTemplateId(null);
        setSelectedDates({});
      }
    });
  };

  const resetAllCalendarTasks = () => {
    if (allSharedTasks.length === 0) return;
    confermaAzione(`${Testi.condiviso.alertSvuotaCalendario} "${calendarName}"?`, async () => {
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
    });
  };

  const resetSpecificDayTasks = () => {
    if (!selectedDayDate || dayTasks.length === 0) return;
    confermaAzione(`${Testi.privato.alertSvuotaOggi} ${selectedDayDate}?`, async () => {
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
    });
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

      {/* Utilizzo del Modale Unificato! */}
      <DayDetailsModal
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
        onDeleteTask={(taskId) => {
          confermaAzione(Testi.modali.alertEliminaTask, async () => {
            await deleteDoc(doc(db, "shared_tasks", taskId));
            await inviaNotificaIscritti({
              calendarId: activeSharedCalendarId,
              currentUserId: user.uid,
              title: "Evento Eliminato",
              message: `${nomeUtente} ha eliminato un evento condiviso.`,
              targetDate: selectedDayDate,
            });
          });
        }}
        onOpenUrl={openUrl}
        isShared={true}
      />

      <TaskModal
        visible={isTaskModalVisible}
        onClose={() => setIsTaskModalVisible(false)}
        selectedDate={selectedDayDate}
        taskToEdit={taskToEdit}
        isShared={true}
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