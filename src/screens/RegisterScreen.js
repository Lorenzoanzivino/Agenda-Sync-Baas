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
import { PaletteColori } from "../palette_e_testi/PaletteColori";
import { Testi } from "../palette_e_testi/Testi";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!username || !birthDate || !email || !password) {
      setError(Testi.auth.errorFillAll);
      return;
    }

    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/;
    if (!dateRegex.test(birthDate.trim())) {
      setError(Testi.auth.errorInvalidDate);
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
      setError(err.message || Testi.auth.errorRegister);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{Testi.auth.registerTitle}</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder={Testi.auth.usernamePlaceholder}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder={Testi.auth.birthDatePlaceholder}
          value={birthDate}
          onChangeText={setBirthDate}
        />

        <TextInput
          style={styles.input}
          placeholder={Testi.auth.emailPlaceholder}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder={Testi.auth.passwordPlaceholder}
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
            <Text style={styles.buttonText}>{Testi.auth.registerButton}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>{Testi.auth.linkToLogin}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: PaletteColori.auth.background,
    justifyContent: "center",
    padding: PaletteColori.spacing.l,
  },
  card: {
    backgroundColor: PaletteColori.auth.cardBackground,
    padding: PaletteColori.spacing.l,
    borderRadius: PaletteColori.borderRadius.card,
    gap: PaletteColori.spacing.m,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: PaletteColori.auth.textMain,
    marginBottom: PaletteColori.spacing.s,
    textAlign: "center",
  },
  input: {
    backgroundColor: PaletteColori.auth.background,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.input,
    color: PaletteColori.auth.textMain,
  },
  button: {
    backgroundColor: PaletteColori.auth.primary,
    padding: PaletteColori.spacing.m,
    borderRadius: PaletteColori.borderRadius.button,
    alignItems: "center",
    marginTop: PaletteColori.spacing.s,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkButton: {
    alignItems: "center",
    marginTop: PaletteColori.spacing.s,
  },
  linkText: {
    color: PaletteColori.auth.primary,
  },
  error: {
    color: PaletteColori.auth.error,
    textAlign: "center",
  },
});
