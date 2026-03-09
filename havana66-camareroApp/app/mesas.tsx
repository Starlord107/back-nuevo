import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { API_BASE_URL } from "../services/api";

type Mesa = {
  id: number;
  nombre: string;
  estado?: string;
};

export default function MesasScreen() {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarMesas();
  }, []);

  const cargarMesas = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/mesas`);
      const data = await res.json();
      setMesas(data);
    } catch (error) {
      console.log("Error cargando mesas", error);
    } finally {
      setLoading(false);
    }
  };

  const seleccionarMesa = (mesa: Mesa) => {
    router.push(`/carta/${mesa.id}`);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona una mesa</Text>

      <FlatList
        data={mesas}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.mesaCard,
              { backgroundColor: item.estado === "ocupada" ? "#dc2626" : "#16a34a" },
            ]}
            onPress={() => seleccionarMesa(item)}
          >
            <Text style={styles.mesaText}>{item.nombre}</Text>
            <Text style={styles.mesaSubtext}>
              {item.estado === "ocupada" ? "Ocupada" : "Libre"}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb",
    padding: 16,
    paddingTop: 50,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1f40ff",
    marginBottom: 18,
  },
  mesaCard: {
    flex: 1,
    margin: 8,
    minHeight: 110,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  mesaText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  mesaSubtext: {
    color: "#fff",
    marginTop: 6,
    fontSize: 14,
  },
});