import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

export function useSharedTasks(calendarId, selectedDate = null) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!calendarId) {
      setTasks([]);
      return;
    }

    let q = query(
      collection(db, "shared_tasks"),
      where("calendarId", "==", calendarId),
    );

    if (selectedDate) {
      q = query(
        collection(db, "shared_tasks"),
        where("calendarId", "==", calendarId),
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
  }, [calendarId, selectedDate]);

  return { tasks };
}
