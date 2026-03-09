import { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { API_BASE_URL } from "../services/api";

type Mesa = {
  id: number;
  nombre: string;
  estado: "libre" | "ocupada";
};

export default function MesasScreen() {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);

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

  useFocusEffect(
    useCallback(() => {
      cargarMesas();
    }, [])
  );

  const seleccionarMesa = (mesa: Mesa) => {
    router.push(`/carta/${mesa.id}`);
  };

 const cerrarMesa = async (id: number) => {
  try {
    const resPedidos = await fetch(`${API_BASE_URL}/api/pedidos/mesa/${id}`);
    const pedidos = await resPedidos.json();

    const total = Array.isArray(pedidos)
      ? pedidos.reduce((accPedido: number, pedido: any) => {
          const totalPedido = Array.isArray(pedido.items)
            ? pedido.items.reduce(
                (accItem: number, item: any) =>
                  accItem + (Number(item.precio) || 0) * (Number(item.cantidad) || 0),
                0
              )
            : 0;

          return accPedido + totalPedido;
        }, 0)
      : 0;

    Alert.alert(
      "Cobrar mesa",
      `Total a cobrar: ${total.toFixed(2)} €`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cobrar y cerrar",
          style: "destructive",
          onPress: async () => {
            try {
              await fetch(`${API_BASE_URL}/api/pedidos/mesa/${id}`, {
                method: "DELETE",
              });

              await fetch(`${API_BASE_URL}/api/mesas/${id}/estado`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: "libre" }),
              });

              cargarMesas();
            } catch (error) {
              console.log("Error cerrando mesa", error);
              Alert.alert("Error", "No se pudo cerrar la mesa");
            }
          },
        },
      ]
    );
  } catch (error) {
    console.log("Error obteniendo total de la mesa", error);
    Alert.alert("Error", "No se pudo calcular el total de la mesa");
  }
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
          <View style={styles.cardWrapper}>
            <TouchableOpacity
              style={[
                styles.mesaCard,
                {
                  backgroundColor:
                    item.estado === "ocupada" ? "#dc2626" : "#16a34a",
                },
              ]}
              onPress={() => seleccionarMesa(item)}
            >
              <Text style={styles.mesaText}>{item.nombre}</Text>
              <Text style={styles.mesaSubtext}>
                {item.estado === "ocupada" ? "Ocupada" : "Libre"}
              </Text>
            </TouchableOpacity>

            {item.estado === "ocupada" && (
              <TouchableOpacity
                style={styles.cerrarMesaButton}
                onPress={() => cerrarMesa(item.id)}
              >
                <Text style={styles.cerrarMesaButtonText}>
                  Cerrar Mesa
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
  cardWrapper: {
    flex: 1,
    margin: 8,
  },
  mesaCard: {
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
  cerrarMesaButton: {
    marginTop: 8,
    backgroundColor: "#1f2937",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  cerrarMesaButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});