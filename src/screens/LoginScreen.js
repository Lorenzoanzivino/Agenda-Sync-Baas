import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { theme } from "../constants/theme";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Compila tutti i campi");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Credenziali non valide");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Bentornato</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

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
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Accedi</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>Non hai un account? Registrati</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
