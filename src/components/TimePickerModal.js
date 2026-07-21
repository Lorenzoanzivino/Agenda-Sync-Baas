import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../constants/theme";

export default function TimePickerModal({
  visible,
  onClose,
  onConfirm,
  initialTime,
}) {
  const [mode, setMode] = useState("h"); // 'h' per ore, 'm' per minuti
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");

  useEffect(() => {
    if (visible && initialTime) {
      setHour(initialTime.split(":")[0]);
      setMinute(initialTime.split(":")[1]);
      setMode("h"); // Inizia sempre dalla selezione dell'ora
    }
  }, [visible, initialTime]);

  const handleConfirm = () => {
    onConfirm(`${hour}:${minute}`);
  };

  const renderClockFace = () => {
    const center = 130; // Centro del quadrante (260/2)
    const itemRadius = 18; // Metà della larghezza del cerchietto (36/2)

    if (mode === "h") {
      // Rendering delle 24 ore in due anelli (esterno 1-12, interno 13-00)
      const hours = Array.from({ length: 24 }, (_, i) => i);
      return hours.map((h) => {
        const isInner = h === 0 || h > 12;
        const displayH = h.toString().padStart(2, "0");
        const radius = isInner ? 65 : 105;
        // Calcolo dell'angolo: 12 e 0 in alto (-90 gradi), ogni ora = 30 gradi
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
              setMode("m"); // Passa ai minuti in automatico
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
      // Rendering dei minuti (salti di 5 minuti per mostrare l'intero cerchio)
      const minutes = Array.from({ length: 12 }, (_, i) =>
        (i * 5).toString().padStart(2, "0"),
      );

      return minutes.map((m, index) => {
        const radius = 105;
        // 12 elementi: salti di 30 gradi (esattamente come le ore)
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
              <Text style={styles.buttonTextCancel}>ANNULLA</Text>
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
    backgroundColor: theme.colors.privateBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  headerBoxActive: {
    backgroundColor: "#E0E0FF",
  },
  headerText: {
    fontSize: 48,
    color: theme.colors.textSecondary,
    fontWeight: "400",
  },
  headerTextActive: {
    color: theme.colors.primaryPrivate,
    fontWeight: "bold",
  },
  headerSeparator: {
    fontSize: 48,
    color: theme.colors.textMain,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  clockContainer: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: theme.colors.privateBackground,
    position: "relative",
    marginBottom: 24,
  },
  clockCenterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primaryPrivate,
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
    backgroundColor: theme.colors.primaryPrivate,
  },
  clockItemText: {
    fontSize: 16,
    color: theme.colors.textMain,
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
    color: theme.colors.textSecondary,
    fontWeight: "bold",
    fontSize: 14,
  },
  buttonTextConfirm: {
    color: theme.colors.primaryPrivate,
    fontWeight: "bold",
    fontSize: 14,
  },
});
