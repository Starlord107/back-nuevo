import { useEffect, useState } from "react";
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
import LogoIcon from "../components/LogoIcon";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function LoginScreen() {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  
useEffect(() => {
const comprobar = async () => {
  try {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    router.replace("/seleccionar-zona");
  }
} catch (error) {
  console.error("Error al comprobar token:", error);
}
};
comprobar();
}, []);
  const handleLogin = async () => {
    try {
      console.log("VALOR NOMBRE ANTES DEL FETCH:", nombre);
      console.log("BODY QUE ENVÍO:", JSON.stringify({ nombre, password }));
      const res = await fetch(`${API_BASE_URL}/api/camareros/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, password }),
      });

      const data = await res.json();
      console.log("Respuesta Login:", data);

      if (!res.ok) {
        Alert.alert("Error", data.error || "Credenciales incorrectas");
        return;
      }
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("usuario", JSON.stringify(data.usuario));

      router.replace("/seleccionar-zona");
    } catch (error) {
      console.log("Error en el login Front:", error);
      Alert.alert("Error",String(error));
    }
  };

  return (
    <View style={styles.container}>
      <LogoIcon size={120} />
      <Text style={styles.title}>Havana 66</Text>

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