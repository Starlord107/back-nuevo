import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

type Props = {
  producto: Producto;
  añadirAlCarrito: (producto: Producto, formato?: Formato) => void;
};

export default function ProductoCard({ producto, añadirAlCarrito }: Props) {
  const handleAdd = () => {
    if (producto.formatos && producto.formatos.length > 0) {
      Alert.alert(
        producto.nombre,
        "Selecciona un formato",
        [
          ...producto.formatos.map((f) => ({
            text: `${f.nombre} - ${f.precio.toFixed(2)}€`,
            onPress: () => añadirAlCarrito(producto, f),
          })),
          { text: "Cancelar", style: "cancel" as const },
        ]
      );
      return;
    }

    añadirAlCarrito(producto);
  };

  return (
    <View style={styles.card}>
      {producto.imagen ? (
        <Image source={{ uri: producto.imagen }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>Sin imagen</Text>
        </View>
      )}

      <Text style={styles.name}>{producto.nombre}</Text>

      {!!producto.descripcioninfo && (
        <Text style={styles.description} numberOfLines={2}>
          {producto.descripcioninfo}
        </Text>
      )}

      <Text style={styles.price}>Desde {producto.precio.toFixed(2)}€</Text>

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Añadir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 14,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: "100%",
    height: 140,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: "#64748b",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  description: {
    color: "#6b7280",
    marginTop: 6,
    marginBottom: 8,
  },
  price: {
    color: "#1f40ff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1f40ff",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});