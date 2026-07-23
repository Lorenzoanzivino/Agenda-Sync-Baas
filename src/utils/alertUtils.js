import { Alert, Platform } from "react-native";
import { Testi } from "../palette_e_testi/Testi";

export const confermaAzione = (messaggio, onConfirm) => {
  if (Platform.OS === "web") {
    if (window.confirm(messaggio)) {
      onConfirm();
    }
  } else {
    Alert.alert(
      "Richiesta di conferma",
      messaggio,
      [
        { text: Testi.modali.btnAnnulla, style: "cancel" },
        { text: "Conferma", style: "destructive", onPress: onConfirm },
      ],
      { cancelable: true }
    );
  }
};