import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { theme } from "../constants/theme";
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

  // Calcolo compleanno sulla data selezionata (date è in formato YYYY-MM-DD)
  let isBirthday = false;
  if (date && userData?.birthDate) {
    const dayMonthToCheck = date.substring(5); // Estrae "MM-DD"
    const parts = userData.birthDate.split("-");
    if (parts.length === 3) {
      const birthDayMonth = `${parts[1]}-${parts[0]}`; // Da "DD-MM-YYYY" a "MM-DD"
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

              {/* Pulsante per aggiungere un nuovo task singolo in questa data */}
              {onAddTask ? (
                <TouchableOpacity onPress={onAddTask} style={styles.addButton}>
                  <Ionicons name="add" size={22} color="#FFF" />
                </TouchableOpacity>
              ) : null}

              {/* Pulsante Reset */}
              {tasks && tasks.length > 0 && onResetDay ? (
                <TouchableOpacity
                  onPress={onResetDay}
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
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close-circle"
                size={28}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea}>
            {/* Card del compleanno se la data combacia */}
            {isBirthday ? (
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
                        ? "Tutto il giorno"
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
                          color={theme.colors.primaryPrivate}
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
                        color={theme.colors.primaryPrivate}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => onDeleteTask(task.id)}
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
            ) : !isBirthday ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Nessun evento in questa data.
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
    backgroundColor: theme.colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing.l,
    minHeight: "50%",
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.l,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.primaryPrivate,
    textTransform: "capitalize",
  },
  addButton: {
    padding: 6,
    backgroundColor: theme.colors.primaryPrivate,
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
    backgroundColor: theme.colors.privateBackground,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.card,
    marginBottom: theme.spacing.s,
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
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.m,
  },
  taskContent: {
    flex: 1,
    justifyContent: "center",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.textMain,
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
  emptyContainer: {
    padding: theme.spacing.l,
    alignItems: "center",
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
});
