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
import { theme } from "../constants/theme";
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
        setErrorMsg("L'ora di inizio non può superare la fine");
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
        // 1. Aggiorna il template fisso
        await updateDoc(
          doc(db, "fixed_tasks", templateToEdit.id),
          templateData,
        );

        // 2. Propaga in automatico ai task privati generati da questo template
        const qPrivate = query(
          collection(db, "private_tasks"),
          where("userId", "==", user.uid),
          where("templateId", "==", templateToEdit.id),
        );
        const snapPrivate = await getDocs(qPrivate);

        // 3. Propaga in automatico ai task condivisi (creati da questo utente) generati da questo template
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
        // Se è un nuovo template fisso, lo salviamo in fixed_tasks
        await addDoc(collection(db, "fixed_tasks"), {
          ...templateData,
          userId: user.uid,
          createdAt: new Date().toISOString(),
        });
      }
      onClose();
    } catch (error) {
      console.error("Errore salvataggio template:", error);
      setErrorMsg(
        "Errore nel salvataggio. Controlla i permessi o le connessioni.",
      );
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
            {templateToEdit ? "Modifica Evento Fisso" : "Nuovo Evento Fisso"}
          </Text>

          {errorMsg !== "" ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <ScrollView style={styles.scrollArea}>
            <TextInput
              style={styles.input}
              placeholder="Titolo Evento Fisso *"
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
                  true: theme.colors.primaryPrivate,
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
              numberOfLines={2}
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

            <Text style={styles.label}>Colore Predefinito</Text>
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
  scrollArea: { marginBottom: theme.spacing.m },
  input: {
    backgroundColor: theme.colors.privateBackground,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.input,
    fontSize: 16,
    marginBottom: theme.spacing.m,
  },
  textArea: { minHeight: 60, textAlignVertical: "top" },
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
    backgroundColor: theme.colors.privateBackground,
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
    borderTopColor: theme.colors.privateBackground,
    gap: theme.spacing.m,
  },
  cancelButton: {
    padding: theme.spacing.m,
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.colors.privateBackground,
    borderRadius: theme.borderRadius.button,
  },
  cancelButtonText: { color: theme.colors.textSecondary, fontWeight: "bold" },
  saveButton: {
    backgroundColor: theme.colors.primaryPrivate,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.button,
    flex: 1,
    alignItems: "center",
  },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { color: "#FFF", fontWeight: "bold" },
});
