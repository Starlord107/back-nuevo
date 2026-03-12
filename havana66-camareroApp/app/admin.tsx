import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { API_BASE_URL } from "../services/api";

export default function AdminScreen() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("staff");

  const crearUsuario = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/camareros/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          email,
          password,
          rol,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.error || "No se pudo crear el usuario");
        return;
      }

      Alert.alert("Usuario creado", `Se creó correctamente ${data.nombre}`);
      setNombre("");
      setEmail("");
      setPassword("");
      setRol("empleado");
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel Administrador</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.rolRow}>
        <TouchableOpacity
          style={[styles.rolButton, rol === "empleado" && styles.rolButtonActive]}
          onPress={() => setRol("empleado")}
        >
          <Text style={[styles.rolButtonText, rol === "empleado" && styles.rolButtonTextActive]}>
            Empleado
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.rolButton, rol === "admin" && styles.rolButtonActive]}
          onPress={() => setRol("admin")}
        >
          <Text style={[styles.rolButtonText, rol === "admin" && styles.rolButtonTextActive]}>
            Admin
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.mainButton} onPress={crearUsuario}>
        <Text style={styles.mainButtonText}>Crear usuario</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f40ff",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  rolRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  rolButton: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  rolButtonActive: {
    backgroundColor: "#1f40ff",
  },
  rolButtonText: {
    color: "#111827",
    fontWeight: "600",
  },
  rolButtonTextActive: {
    color: "#fff",
  },
  mainButton: {
    backgroundColor: "#1f40ff",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  mainButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  backButton: {
    backgroundColor: "#1f2937",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});