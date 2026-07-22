import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { PaletteColori } from "../palette_e_testi/PaletteColori";
import { Testi } from "../palette_e_testi/Testi";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/useAuthStore";

export default function DayDetailsModal({
  visible,
  onClose,
  date,
  tasks,
  onEditTask,
  onDeleteTask,
  onOpenUrl,
  onResetDay,
  onAddTask,
}) {
  const { userData } = useAuthStore();

  const formattedDate = date
    ? new Date(date).toLocaleDateString("it-IT", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  let isBirthday = false;
  if (date && userData?.birthDate) {
    const dayMonthToCheck = date.substring(5);
    const parts = userData.birthDate.split("-");
    if (parts.length === 3) {
      const birthDayMonth = `${parts[1]}-${parts[0]}`;
      if (dayMonthToCheck === birthDayMonth) {
        isBirthday = true;
      }
    }
  }

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Text style={styles.title}>{formattedDate}</Text>

              {onAddTask ? (
                <TouchableOpacity onPress={onAddTask} style={styles.addButton}>
                  <Ionicons name="add" size={22} color="#FFF" />
                </TouchableOpacity>
              ) : null}

              {tasks && tasks.length > 0 && onResetDay ? (
                <TouchableOpacity
                  onPress={onResetDay}
                  style={styles.resetButton}
                >
                  <Ionicons
                    name="reload-outline"
                    size={22}
                    color={PaletteColori.privato.error}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close-circle"
                size={28}
                color={PaletteColori.privato.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea}>
            {isBirthday ? (
              <View style={[styles.taskCard, styles.birthdayCard]}>
                <View style={styles.birthdayIconBox}>
                  <Text style={{ fontSize: 28 }}>🎂</Text>
                </View>
                <View style={styles.taskContent}>
                  <Text style={styles.birthdayTitle}>
                    {Testi.privato.compleannoTitolo}
                  </Text>
                  <Text style={styles.birthdayText}>
                    {Testi.privato.compleannoTesto}
                  </Text>
                </View>
              </View>
            ) : null}

            {tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <View key={task.id} style={styles.taskCard}>
                  <View
                    style={[
                      styles.colorIndicator,
                      { backgroundColor: task.color },
                    ]}
                  />

                  <TouchableOpacity
                    style={styles.taskContent}
                    onPress={() => onEditTask(task)}
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
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {task.description}
                      </Text>
                    ) : null}
                  </TouchableOpacity>

                  <View style={styles.actionsColumn}>
                    {task.url ? (
                      <TouchableOpacity
                        onPress={() => onOpenUrl(task.url)}
                        style={styles.actionButton}
                      >
                        <Ionicons
                          name="link"
                          size={22}
                          color={PaletteColori.privato.primary}
                        />
                      </TouchableOpacity>
                    ) : null}

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => onEditTask(task)}
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={22}
                        color={PaletteColori.privato.primary}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => onDeleteTask(task.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={22}
                        color={PaletteColori.privato.error}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : !isBirthday ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {Testi.modali.nessunEventoData}
                </Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: PaletteColori.privato.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: PaletteColori.spacing.l,
    minHeight: "50%",
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: PaletteColori.spacing.l,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: PaletteColori.privato.primary,
    textTransform: "capitalize",
  },
  addButton: {
    padding: 6,
    backgroundColor: PaletteColori.privato.primary,
    borderRadius: 12,
  },
  resetButton: {
    padding: 6,
    backgroundColor: "#FFE5E5",
    borderRadius: 12,
  },
  scrollArea: {
    flexGrow: 1,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PaletteColori.privato.background,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.card,
    marginBottom: PaletteColori.spacing.s,
  },
  birthdayCard: {
    backgroundColor: PaletteColori.privato.birthdayBackground,
    borderWidth: 2,
    borderColor: PaletteColori.privato.birthdayBadge,
  },
  birthdayIconBox: {
    marginRight: PaletteColori.spacing.m,
  },
  birthdayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: PaletteColori.privato.birthdayBadge,
  },
  birthdayText: {
    fontSize: 14,
    color: PaletteColori.privato.textMain,
    marginTop: 2,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: PaletteColori.spacing.m,
  },
  taskContent: {
    flex: 1,
    justifyContent: "center",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: PaletteColori.privato.textMain,
  },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: PaletteColori.privato.textSecondary,
  },
  taskTime: {
    fontSize: 12,
    color: PaletteColori.privato.textSecondary,
    marginTop: 2,
  },
  taskDescription: {
    fontSize: 13,
    color: PaletteColori.privato.textSecondary,
    marginTop: 4,
    fontStyle: "italic",
  },
  actionsColumn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: PaletteColori.spacing.s,
  },
  actionButton: {
    padding: 6,
    marginLeft: 4,
  },
  emptyContainer: {
    padding: PaletteColori.spacing.l,
    alignItems: "center",
  },
  emptyText: {
    color: PaletteColori.privato.textSecondary,
    fontStyle: "italic",
  },
});
