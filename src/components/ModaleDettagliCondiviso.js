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

export default function ModaleDettagliCondiviso({
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
  const formattedDate = date
    ? new Date(date).toLocaleDateString("it-IT", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

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
                          color={theme.colors.primaryShared}
                        />
                      </TouchableOpacity>
                    ) : null}

                    <TouchableOpacity
                      onPress={() => onEditTask(task)}
                      style={styles.actionButton}
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={22}
                        color={theme.colors.primaryShared}
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
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Nessun evento in questa data.
                </Text>
              </View>
            )}
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
    color: theme.colors.primaryShared,
    textTransform: "capitalize",
  },
  addButton: {
    padding: 6,
    backgroundColor: theme.colors.primaryShared,
    borderRadius: 12,
  },
  resetButton: { padding: 6, backgroundColor: "#FFE5E5", borderRadius: 12 },
  scrollArea: { flexGrow: 1 },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.sharedBackground,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.card,
    marginBottom: theme.spacing.s,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.m,
  },
  taskContent: { flex: 1, justifyContent: "center" },
  taskTitle: { fontSize: 16, fontWeight: "bold", color: theme.colors.textMain },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: theme.colors.textSecondary,
  },
  taskTime: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
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
  actionButton: { padding: 6, marginLeft: 4 },
  emptyContainer: { padding: theme.spacing.l, alignItems: "center" },
  emptyText: { color: theme.colors.textSecondary, fontStyle: "italic" },
});
