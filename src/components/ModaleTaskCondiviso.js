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
import { theme } from "../constants/theme";
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

  // Nome Utente (es. mariorossi@gmail.com -> mariorossi)
  const nomeUtente = user?.email?.split("@")[0] || "Un membro";

  // Caricamento dei task fissi personali per compilarli nel modale condiviso
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
        setErrorMsg("La data di inizio non può superare la fine");
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
            {taskToEdit ? "Modifica Task Condiviso" : "Nuovo Task Condiviso"}
          </Text>

          {errorMsg !== "" ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <ScrollView style={styles.scrollArea}>
            {!taskToEdit && fixedTasksList.length > 0 ? (
              <View style={styles.templatePickerBox}>
                <Text style={styles.label}>Importa da Evento Fisso:</Text>
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
              placeholder="Titolo *"
              value={title}
              onChangeText={setTitle}
            />

            <View style={styles.switchRow}>
              <Text style={styles.label}>Tutto il giorno</Text>
              <Switch
                value={isAllDay}
                onValueChange={setIsAllDay}
                trackColor={{
                  false: theme.colors.textSecondary,
                  true: theme.colors.primaryShared,
                }}
              />
            </View>

            {!isAllDay ? (
              <View style={styles.dateRow}>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.label}>Ora Inizio</Text>
                  <TouchableOpacity
                    style={styles.timeBox}
                    onPress={() => openTimePicker("start")}
                  >
                    <Text style={styles.timeText}>{startTime}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.label}>Ora Fine</Text>
                  <TouchableOpacity
                    style={styles.timeBox}
                    onPress={() => openTimePicker("end")}
                  >
                    <Text style={styles.timeText}>{endTime}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            <Text style={styles.label}>Descrizione (Opzionale)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Aggiungi dettagli..."
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={3}
            />

            <Text style={styles.label}>URL (Opzionale)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://..."
              value={url}
              onChangeText={setUrl}
              keyboardType="url"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Colore</Text>
            <View style={styles.colorContainer}>{renderColorOptions()}</View>
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Annulla</Text>
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
                <Text style={styles.saveButtonText}>Salva</Text>
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
    padding: theme.spacing.l,
  },
  modalCard: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.card,
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.textMain,
    textAlign: "center",
    marginBottom: theme.spacing.m,
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
  templatePickerBox: {
    marginBottom: theme.spacing.m,
    backgroundColor: theme.colors.sharedBackground,
    padding: theme.spacing.s,
    borderRadius: theme.borderRadius.input,
  },
  templateChipsRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  templateChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.cardBackground,
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
    color: theme.colors.textMain,
  },
  scrollArea: { marginBottom: theme.spacing.m },
  input: {
    backgroundColor: theme.colors.sharedBackground,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.input,
    fontSize: 16,
    marginBottom: theme.spacing.m,
  },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.m,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  dateInputContainer: { flex: 1 },
  timeBox: {
    backgroundColor: theme.colors.sharedBackground,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.input,
    alignItems: "center",
  },
  timeText: { fontSize: 18, fontWeight: "bold", color: theme.colors.textMain },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.s,
  },
  colorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.s,
    marginBottom: theme.spacing.m,
  },
  colorCircle: { width: 32, height: 32, borderRadius: 16 },
  selectedColor: { borderWidth: 3, borderColor: theme.colors.textMain },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.sharedBackground,
  },
  cancelButton: {
    padding: theme.spacing.m,
    flex: 1,
    alignItems: "center",
  },
  cancelButtonText: { color: theme.colors.textSecondary, fontWeight: "bold" },
  saveButton: {
    backgroundColor: theme.colors.primaryShared,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.button,
    flex: 1,
    alignItems: "center",
  },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { color: "#FFF", fontWeight: "bold" },
});
