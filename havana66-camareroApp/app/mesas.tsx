import { useState, useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useFocusEffect,useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";
type Mesa = {
  id: number;
  nombre: string;
  estado: "libre" | "ocupada";
  // hay que poner los datos que faltan
  zona: string;
  pos_x: number;
  pos_y: number;
};

export default function MesasScreen() {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const { zona } = useLocalSearchParams<{zona: string}>();
const mesasFiltradas = zona
  ? mesas.filter((mesa) => mesa.zona === zona)
  : mesas;
  const cargarUsuario = async () => {
    try {
      const usuarioGuardado = await AsyncStorage.getItem("usuario");
      if (usuarioGuardado) {
        setUsuario(JSON.parse(usuarioGuardado));
      }
    } catch (error) {
      console.log("Error cargando usuario", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("usuario");
      router.replace("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const cargarMesas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/mesas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setMesas(data);
    } catch (error) {
      console.log("Error cargando mesas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuario();
  }, []);

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
      const token = await AsyncStorage.getItem("token");

      const resPedidos = await fetch(`${API_BASE_URL}/api/pedidos/mesa/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

      Alert.alert("Cobrar mesa", `Total a cobrar: ${total.toFixed(2)} €`, [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cobrar y cerrar",
          style: "destructive",
          onPress: async () => {
            try {
              await fetch(`${API_BASE_URL}/api/pedidos/mesa/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              await fetch(`${API_BASE_URL}/api/mesas/${id}/estado`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ estado: "libre" }),
              });

              cargarMesas();
            } catch (error) {
              console.log("Error cerrando mesa", error);
              Alert.alert("Error", "No se pudo cerrar la mesa");
            }
          },
        },
      ]);
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


        
               <TouchableOpacity  style={styles.cambiarZonaButton} onPress={() => router.push("/seleccionar-zona")}>
  
  <Text style={[styles.cambiarZonaText, { textAlign: "center" }, { marginTop:20 },]}> Cambiar zona</Text>
</TouchableOpacity>

    <View style={styles.plano}>
  {mesasFiltradas.map((item) => (
    <View
      key={item.id}
      style={[
        styles.mesaPlanoWrapper,
        {
          left: item.pos_x,
          top: item.pos_y,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.mesaPlano,
          {
            backgroundColor:
              item.estado === "ocupada" ? "#dc2626" : "#16a34a",
          },
        ]}
        onPress={() => seleccionarMesa(item)}
      >
        <Text style={styles.mesaPlanoText}>{item.nombre}</Text>
      </TouchableOpacity>

      {item.estado === "ocupada" && (
        <TouchableOpacity
          style={styles.cerrarMesaMiniButton}
          onPress={() => cerrarMesa(item.id)}
        >
          <Image source={require("../assets/iconos/billetes.png")} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
      )}
    </View>
  ))}
</View>

 
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
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  topButtons: {
    flexDirection: "row",
    alignItems: "center",
    
    
  },
  cambiarZonaButton: {
    backgroundColor: "#1f40ff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 32,
    
  },
  cambiarZonaText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
    marginBottom  : 10,
  },
  plano: {
  
  position: "relative",
  backgroundColor: "#ffffff",
  borderRadius: 18,
  marginTop: 50,
  overflow: "hidden",
height:550,
},

mesaPlanoWrapper: {
  position: "absolute",
  width: 30,
  
  
    
  alignItems: "center",
},

mesaPlano: {
  width: 60,
  height: 40,
  padding: 8,
  borderRadius: 18,
  justifyContent: "center",
  
  alignItems: "center",
},

mesaPlanoText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 11,
  textAlign: "center",
},

cerrarMesaMiniButton: {
  borderRadius: 30,
  height: 50,
  width: 50,
  
  backgroundImage:"assets/iconos/billetes.png"
},



 
  

 

  
});