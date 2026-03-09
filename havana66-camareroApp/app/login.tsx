import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { API_BASE_URL } from "../services/api";

export default function LoginScreen() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/camareros/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: usuario, password }),
      });

      const data = await res.json();
      console.log("Respuesta Login:", data);

      if (!res.ok) {
        Alert.alert("Error", data.error || "Credenciales incorrectas");
        return;
      }

      router.replace("/mesas");
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Havana66</Text>
      <Text style={styles.subtitle}>Acceso Camareros</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f4f7fb",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1f40ff",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 24,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#1f40ff",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});