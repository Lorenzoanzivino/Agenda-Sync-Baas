import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

export function useFixedTasks(userId) {
  const [fixedTasks, setFixedTasks] = useState([]);

  useEffect(() => {
    if (!userId) {
      setFixedTasks([]);
      return;
    }

    const q = query(
      collection(db, "fixed_tasks"),
      where("userId", "==", userId),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const templates = [];
      snapshot.forEach((document) =>
        templates.push({ id: document.id, ...document.data() }),
      );
      setFixedTasks(templates);
    });

    return () => unsubscribe();
  }, [userId]);

  return { fixedTasks };
}
