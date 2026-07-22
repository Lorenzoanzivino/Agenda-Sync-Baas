import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { PaletteColori } from "../palette_e_testi/PaletteColori";
import { Testi } from "../palette_e_testi/Testi";

export default function TimePickerModal({
  visible,
  onClose,
  onConfirm,
  initialTime,
}) {
  const [mode, setMode] = useState("h");
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");

  useEffect(() => {
    if (visible && initialTime) {
      setHour(initialTime.split(":")[0]);
      setMinute(initialTime.split(":")[1]);
      setMode("h");
    }
  }, [visible, initialTime]);

  const handleConfirm = () => {
    onConfirm(`${hour}:${minute}`);
  };

  const renderClockFace = () => {
    const center = 130;
    const itemRadius = 18;

    if (mode === "h") {
      const hours = Array.from({ length: 24 }, (_, i) => i);
      return hours.map((h) => {
        const isInner = h === 0 || h > 12;
        const displayH = h.toString().padStart(2, "0");
        const radius = isInner ? 65 : 105;
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
              setMode("m");
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
      const minutes = Array.from({ length: 12 }, (_, i) =>
        (i * 5).toString().padStart(2, "0"),
      );

      return minutes.map((m, index) => {
        const radius = 105;
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
              <Text style={styles.buttonTextCancel}>
                {Testi.modali.btnAnnulla.toUpperCase()}
              </Text>
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
    backgroundColor: PaletteColori.privato.background,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  headerBoxActive: {
    backgroundColor: "#E0E0FF",
  },
  headerText: {
    fontSize: 48,
    color: PaletteColori.privato.textSecondary,
    fontWeight: "400",
  },
  headerTextActive: {
    color: PaletteColori.privato.primary,
    fontWeight: "bold",
  },
  headerSeparator: {
    fontSize: 48,
    color: PaletteColori.privato.textMain,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  clockContainer: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: PaletteColori.privato.background,
    position: "relative",
    marginBottom: 24,
  },
  clockCenterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PaletteColori.privato.primary,
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
    backgroundColor: PaletteColori.privato.primary,
  },
  clockItemText: {
    fontSize: 16,
    color: PaletteColori.privato.textMain,
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
    color: PaletteColori.privato.textSecondary,
    fontWeight: "bold",
    fontSize: 14,
  },
  buttonTextConfirm: {
    color: PaletteColori.privato.primary,
    fontWeight: "bold",
    fontSize: 14,
  },
});
