import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  formatos: Formato[];
};

type CarritoItem = {
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

  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [carritoVisible, setCarritoVisible] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

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

  const subcategoriasDisponibles = useMemo(() => {
    const filtrados = productos.filter((p) => p.categoria === categoriaPrincipal);
    const unicas = [...new Set(filtrados.map((p) => p.subcategoria).filter(Boolean))];
    return unicas;
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

  const añadirAlCarrito = (producto: Producto, formato?: Formato) => {
    const precioFinal = formato ? formato.precio : producto.precio;
    const nombreFormato = formato ? formato.nombre : null;
    const clave = `${producto.id}-${nombreFormato || "base"}`;

    setCarrito((prev) => {
      const existente = prev.find(
        (item) => `${item.id}-${item.formato || "base"}` === clave
      );

      if (existente) {
        return prev.map((item) =>
          `${item.id}-${item.formato || "base"}` === clave
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: precioFinal,
          cantidad: 1,
          formato: nombreFormato,
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

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

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

      setCarrito([]);
      setCarritoVisible(false);
      Alert.alert("Pedido enviado", `Pedido #${data.pedidoId} enviado correctamente`);
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
        <Text style={styles.title}>Mesa {mesaId}</Text>

        <TouchableOpacity style={styles.cartButton} onPress={() => setCarritoVisible(true)}>
          <Text style={styles.cartText}>Carrito ({carritoCount})</Text>
        </TouchableOpacity>
      </View>

      <CategoriaTabs
        categoriaPrincipal={categoriaPrincipal}
        setCategoriaPrincipal={setCategoriaPrincipal}
        categoriaSecundaria={categoriaSecundaria}
        setCategoriaSecundaria={setCategoriaSecundaria}
        subcategoriasDisponibles={subcategoriasDisponibles}
      />

      <FlatList
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
        total={total}
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
});