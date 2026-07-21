import { doc, getDoc, collection, writeBatch } from "firebase/firestore";
import { db } from "../config/firebase";

export async function inviaNotificaIscritti({
  calendarId,
  currentUserId,
  title,
  message,
  targetDate,
}) {
  if (!calendarId || !currentUserId) return;

  try {
    const calRef = doc(db, "shared_calendars", calendarId);
    const calSnap = await getDoc(calRef);
    if (!calSnap.exists()) return;

    const members = calSnap.data().members || [];
    const recipients = members.filter((uid) => uid !== currentUserId);

    if (recipients.length === 0) return;

    const batch = writeBatch(db);
    recipients.forEach((recipientId) => {
      const newNotifRef = doc(collection(db, "inapp_notifications"));
      batch.set(newNotifRef, {
        userId: recipientId,
        calendarId: calendarId,
        title: title,
        message: message,
        targetDate: targetDate,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    });

    await batch.commit();
  } catch (error) {
    console.error("Errore nell'invio della notifica in-app:", error);
  }
}
