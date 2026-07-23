import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

export function usePrivateTasks(userId, selectedDate = null) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      return;
    }

    let q = query(
      collection(db, "private_tasks"),
      where("userId", "==", userId),
    );

    if (selectedDate) {
      q = query(
        collection(db, "private_tasks"),
        where("userId", "==", userId),
        where("date", "==", selectedDate),
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = [];
      snapshot.forEach((document) =>
        tasksData.push({ id: document.id, ...document.data() }),
      );

      // Ordinamento: completati in fondo, poi per data di creazione
      tasksData.sort((a, b) => {
        if (a.isCompleted === b.isCompleted) {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        return a.isCompleted ? 1 : -1;
      });

      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [userId, selectedDate]);

  return { tasks };
}
