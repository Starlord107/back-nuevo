import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SeleccionZonaScreen() {

  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      const user = await AsyncStorage.getItem("usuario");

      if (user) {
        setUsuario(JSON.parse(user));
      }
    };

    cargarUsuario();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("usuario");

    router.replace("/");
  };

  return (
    <View style={styles.container}>

      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Selecciona zona</Text>
          <Text style={styles.subtitle}>
            {usuario?.nombre ? `Hola, ${usuario.nombre}` : ""}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.buttonsContainer}>

        <TouchableOpacity
          style={styles.zoneButton}
          onPress={() => router.push("/mesas?zona=terraza")}
        >
          <Text style={styles.zoneTitle}>Terraza</Text>
          <Text style={styles.zoneSubtitle}>Mesas exteriores</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.zoneButton}
          onPress={() => router.push("/mesas?zona=interior")}
        >
          <Text style={styles.zoneTitle}>Interior</Text>
          <Text style={styles.zoneSubtitle}>Sala interior</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.zoneButton}
          onPress={() => router.push("/mesas?zona=barra")}
        >
          <Text style={styles.zoneTitle}>Barra</Text>
          <Text style={styles.zoneSubtitle}>Zona barra</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f4f7fb",
    padding: 24,
    paddingTop: 60,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f40ff",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 16,
    color: "#4b5563",
  },

  logoutButton: {
    backgroundColor: "#1f2937",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },

  buttonsContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
  },

  zoneButton: {
    backgroundColor: "#1f40ff",
    borderRadius: 22,
    paddingVertical: 30,
    paddingHorizontal: 24,
  },

  zoneTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },

  zoneSubtitle: {
    marginTop: 8,
    color: "#dbeafe",
    fontSize: 16,
  },

});