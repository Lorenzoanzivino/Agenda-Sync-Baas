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
