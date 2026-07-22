import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { theme } from "../constants/theme";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!username || !birthDate || !email || !password) {
      setError("Compila tutti i campi");
      return;
    }

    // Validazione rigorosa formato data DD-MM-YYYY
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/;
    if (!dateRegex.test(birthDate.trim())) {
      setError("Formato data non valido. Usa DD-MM-YYYY (es. 09-09-1997)");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username.trim(),
        email: email.trim(),
        birthDate: birthDate.trim(),
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err.message || "Errore durante la registrazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Crea Account</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Data di nascita (es. 09-09-1997)"
          value={birthDate}
          onChangeText={setBirthDate}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Registrati</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>Hai già un account? Accedi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.privateBackground,
    justifyContent: "center",
    padding: theme.spacing.l,
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.card,
    gap: theme.spacing.m,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.textMain,
    marginBottom: theme.spacing.s,
    textAlign: "center",
  },
  input: {
    backgroundColor: theme.colors.privateBackground,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.input,
    color: theme.colors.textMain,
  },
  button: {
    backgroundColor: theme.colors.primaryPrivate,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.button,
    alignItems: "center",
    marginTop: theme.spacing.s,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkButton: {
    alignItems: "center",
    marginTop: theme.spacing.s,
  },
  linkText: {
    color: theme.colors.primaryPrivate,
  },
  error: {
    color: theme.colors.error,
    textAlign: "center",
  },
});
