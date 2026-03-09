import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../../services/api";
import CategoriaTabs from "../../components/CategoriaTabs";
import ProductoCard from "../../components/ProductoCard";
import CarritoModal from "../../components/CarritoModal";

type Formato = {
  id: number;
  nombre: string;
  precio: number;
};

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string | null;
  subcategoria: string;
  descripcioninfo: string;
  formatos?: Formato[];
};

type CarritoItem = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  formato?: string | null;
};

type PedidoExistenteItem = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  formato?: string | null;
};

export default function CartaScreen() {
  const { mesaId } = useLocalSearchParams<{ mesaId: string }>();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const [categoriaPrincipal, setCategoriaPrincipal] = useState("Bebidas");
  const [categoriaSecundaria, setCategoriaSecundaria] = useState("");

  const [pedidoExistente, setPedidoExistente] = useState<PedidoExistenteItem[][]>([]);
  const [mostrarPedidoActual, setMostrarPedidoActual] = useState(false);

  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [carritoVisible, setCarritoVisible] = useState(false);

  useEffect(() => {
    if (!mesaId) return;
    cargarProductos();
    cargarPedidosMesa();
  }, [mesaId]);

  const cargarProductos = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/productos`);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const cargarPedidosMesa = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/pedidos/mesa/${mesaId}`);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        setPedidoExistente([]);
        return;
      }

      const pedidosAgrupados: PedidoExistenteItem[][] = data.map((pedido: any) => {
        if (!Array.isArray(pedido.items)) return [];

        return pedido.items.map((item: any) => ({
          id: item.producto_id,
          nombre: item.nombre,
          precio: Number(item.precio) || 0,
          cantidad: Number(item.cantidad) || 0,
          formato: item.formato || null,
        }));
      });

      setPedidoExistente(pedidosAgrupados);
    } catch (error) {
      console.log("Error cargando pedido existente", error);
    }
  };

  const subcategoriasDisponibles = useMemo(() => {
    const filtrados = productos.filter((p) => p.categoria === categoriaPrincipal);
    return [...new Set(filtrados.map((p) => p.subcategoria).filter(Boolean))];
  }, [productos, categoriaPrincipal]);

  useEffect(() => {
    if (subcategoriasDisponibles.length > 0) {
      setCategoriaSecundaria(subcategoriasDisponibles[0]);
    } else {
      setCategoriaSecundaria("");
    }
  }, [categoriaPrincipal, subcategoriasDisponibles]);

  const productosFiltrados = productos.filter(
    (p) =>
      p.categoria === categoriaPrincipal &&
      (categoriaSecundaria === "" || p.subcategoria === categoriaSecundaria)
  );

  const añadirAlCarrito = (producto: any, cantidadElegida: number) => {
    setCarrito((prev) => {
      const existente = prev.find(
        (item) =>
          item.id === producto.id &&
          (item.formato || null) === (producto.formato || null)
      );

      if (existente) {
        return prev.map((item) =>
          item.id === producto.id &&
          (item.formato || null) === (producto.formato || null)
            ? { ...item, cantidad: item.cantidad + cantidadElegida }
            : item
        );
      }

      return [
        ...prev,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: Number(producto.precio) || 0,
          cantidad: cantidadElegida,
          formato: producto.formato || null,
        },
      ];
    });
  };

  const aumentarCantidad = (id: number, formato?: string | null) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id && (item.formato || null) === (formato || null)
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  const disminuirCantidad = (id: number, formato?: string | null) => {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.id === id && (item.formato || null) === (formato || null)
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const eliminarProducto = (id: number, formato?: string | null) => {
    setCarrito((prev) =>
      prev.filter(
        (item) => !(item.id === id && (item.formato || null) === (formato || null))
      )
    );
  };

  const total = carrito.reduce(
    (acc, item) => acc + (Number(item.precio) || 0) * item.cantidad,
    0
  );

  const enviarPedido = async () => {
    if (carrito.length === 0) {
      Alert.alert("Atención", "El carrito está vacío");
      return;
    }

    try {
      const payload = {
        mesa_id: Number(mesaId),
        productos: carrito.map((item) => ({
          id: item.id,
          cantidad: item.cantidad,
          formato: item.formato || null,
        })),
        total,
      };

      const res = await fetch(`${API_BASE_URL}/api/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo enviar el pedido");
      }

      await fetch(`${API_BASE_URL}/api/mesas/${mesaId}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: "ocupada" }),
      });

      setCarrito([]);
      setCarritoVisible(false);
      await cargarPedidosMesa();

      Alert.alert("Pedido enviado de la mesa " + mesaId, `Pedido enviado correctamente a la cocina`);
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo enviar el pedido");
    }
  };

  const carritoCount = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/mesas")}>
          <Text style={styles.backButtonText}>← Mesas</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Mesa {mesaId}</Text>

        <TouchableOpacity style={styles.cartButton} onPress={() => setCarritoVisible(true)}>
          <Text style={styles.cartText}>Carrito ({carritoCount})</Text>
        </TouchableOpacity>
      </View>

      {pedidoExistente.length > 0 && (
        <View style={styles.pedidoActualBox}>
          <TouchableOpacity
            style={styles.pedidoActualHeader}
            onPress={() => setMostrarPedidoActual(!mostrarPedidoActual)}
          >
            <Text style={styles.pedidoActualTitle}>
              {mostrarPedidoActual ? "Ocultar pedido actual" : "Ver pedido actual de la mesa"}
            </Text>
            <Text style={styles.pedidoActualArrow}>
              {mostrarPedidoActual ? "▲" : "▼"}
            </Text>
          </TouchableOpacity>

          {mostrarPedidoActual && (
            <View style={styles.pedidoActualContenido}>
              {pedidoExistente.map((pedido, index) => (
                <View key={index} style={styles.pedidoGrupo}>
                  <Text style={styles.pedidoGrupoTitulo}>
                    {index === 0 ? "Último pedido" : `Pedido ${pedidoExistente.length - index}`}
                  </Text>

                  {pedido.map((item, idx) => (
                    <View key={`${item.id}-${idx}`} style={styles.pedidoItemRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.pedidoItemNombre}>{item.nombre}</Text>
                        {!!item.formato && (
                          <Text style={styles.pedidoItemSubtexto}>Formato: {item.formato}</Text>
                        )}
                        <Text style={styles.pedidoItemSubtexto}>
                          {item.precio} € / unidad
                        </Text>
                      </View>

                      <Text style={styles.pedidoItemCantidad}>{item.cantidad} uds</Text>

                      <Text style={styles.pedidoItemTotal}>
                        {(item.precio * item.cantidad).toFixed(2)} €
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      <CategoriaTabs
        categoriaPrincipal={categoriaPrincipal}
        setCategoriaPrincipal={setCategoriaPrincipal}
        categoriaSecundaria={categoriaSecundaria}
        setCategoriaSecundaria={setCategoriaSecundaria}
      />

      <FlatList
        style={{ flex: 1 }}
        data={productosFiltrados}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ProductoCard producto={item} añadirAlCarrito={añadirAlCarrito} />
        )}
      />

      <CarritoModal
        visible={carritoVisible}
        onClose={() => setCarritoVisible(false)}
        carrito={carrito}
        aumentarCantidad={aumentarCantidad}
        disminuirCantidad={disminuirCantidad}
        eliminarProducto={eliminarProducto}
        enviarPedido={enviarPedido}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#e5edff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  backButtonText: {
    color: "#1f40ff",
    fontWeight: "700",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1f40ff",
  },
  cartButton: {
    backgroundColor: "#1f40ff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  cartText: {
    color: "#fff",
    fontWeight: "bold",
  },
  list: {
    padding: 12,
    paddingBottom: 100,
  },
  pedidoActualBox: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#0a0f3d",
    borderRadius: 16,
    overflow: "hidden",
  },
  pedidoActualHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pedidoActualTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  pedidoActualArrow: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  pedidoActualContenido: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  pedidoGrupo: {
    marginBottom: 14,
  },
  pedidoGrupoTitulo: {
    color: "#22c55e",
    fontWeight: "700",
    marginBottom: 8,
  },
  pedidoItemRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1e3a8a",
    paddingVertical: 10,
  },
  pedidoItemNombre: {
    color: "#fff",
    fontWeight: "600",
  },
  pedidoItemSubtexto: {
    color: "#93c5fd",
    fontSize: 12,
  },
  pedidoItemCantidad: {
    color: "#fff",
    fontWeight: "600",
    marginHorizontal: 8,
  },
  pedidoItemTotal: {
    color: "#60a5fa",
    fontWeight: "700",
    minWidth: 75,
    textAlign: "right",
  },
});