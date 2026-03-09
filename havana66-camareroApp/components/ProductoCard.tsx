import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Formato = {
  id: number;
  nombre: string;
  precio: number;
};

type Producto = {
  id: number;
  nombre: string;
  precio?: number;
  categoria: string;
  imagen: string | null;
  subcategoria: string;
  descripcioninfo: string;
  formatos?: Formato[];
};

type Props = {
  producto: Producto;
  añadirAlCarrito: (
    producto: Producto & { formato: string | null; precio: number },
    cantidad: number
  ) => void;
};

export default function ProductoCard({ producto, añadirAlCarrito }: Props) {
  const [cantidad, setCantidad] = useState(0);

  const tieneFormatos = !!producto.formatos && producto.formatos.length > 0;

  const [formatoActual, setFormatoActual] = useState<Formato | null>(
    tieneFormatos ? producto.formatos![0] : null
  );

  useEffect(() => {
    if (tieneFormatos) {
      setFormatoActual(producto.formatos![0]);
    } else {
      setFormatoActual(null);
    }
  }, [producto]);

  const precioFinal = useMemo(() => {
    if (tieneFormatos) {
      return formatoActual?.precio ?? 0;
    }
    return producto.precio ?? 0;
  }, [tieneFormatos, formatoActual, producto.precio]);

  const incrementar = () => setCantidad((prev) => prev + 1);

  const decrementar = () => {
    if (cantidad > 0) setCantidad((prev) => prev - 1);
  };

  const seleccionarFormato = () => {
    if (!tieneFormatos) return;

    Alert.alert(
      "Selecciona un formato",
      producto.nombre,
      [
        ...producto.formatos!.map((formato) => ({
          text: `${formato.nombre} - ${Number(formato.precio).toFixed(2)} €`,
          onPress: () => setFormatoActual(formato),
        })),
        {
          text: "Cancelar",
          style: "cancel" as const,
        },
      ]
    );
  };

  const agregar = () => {
    if (cantidad > 0) {
      añadirAlCarrito(
        {
          ...producto,
          formato: formatoActual ? formatoActual.nombre : null,
          precio: precioFinal,
        },
        cantidad
      );
      setCantidad(0);
    }
  };

  const imageUri =
    producto.imagen && producto.imagen.startsWith("http")
      ? producto.imagen
      : producto.imagen
      ? `https://backend-carta.onrender.com/${producto.imagen}`
      : null;

  return (
    <View style={styles.card}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>Sin imagen</Text>
        </View>
      )}

      {tieneFormatos && (
        <TouchableOpacity style={styles.selectorFormato} onPress={seleccionarFormato}>
          <Text style={styles.selectorFormatoText}>
            {formatoActual
              ? `${formatoActual.nombre} - ${Number(formatoActual.precio).toFixed(2)} €`
              : "Selecciona formato"}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.nombre}>{producto.nombre}</Text>

        <Text style={styles.precio}>
          {precioFinal ? `${Number(precioFinal).toFixed(2)} €` : ""}
        </Text>
      </View>

      <View style={styles.contadorContainer}>
        <TouchableOpacity onPress={decrementar} style={styles.contadorButton}>
          <Text style={styles.contadorButtonText}>−</Text>
        </TouchableOpacity>

        <Text style={styles.cantidadText}>{cantidad}</Text>

        <TouchableOpacity onPress={incrementar} style={styles.contadorButton}>
          <Text style={styles.contadorButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={agregar}
        disabled={cantidad === 0}
        style={[
          styles.agregarButton,
          cantidad === 0 ? styles.agregarButtonDisabled : styles.agregarButtonEnabled,
        ]}
      >
        <Text
          style={[
            styles.agregarButtonText,
            cantidad === 0 ? styles.agregarButtonTextDisabled : styles.agregarButtonTextEnabled,
          ]}
        >
          Agregar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#1E40FF",
    padding: 16,
    marginBottom: 14,
    shadowColor: "#2E6BFF",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "rgba(0,0,0,0.10)",
  },
  imagePlaceholder: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "rgba(0,0,0,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: {
    color: "#64748b",
    fontWeight: "600",
  },
  selectorFormato: {
    width: "100%",
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#1f40ff",
  },
  selectorFormatoText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
  infoContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  nombre: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f40ff",
    textAlign: "center",
  },
  precio: {
    color: "#1f40ff",
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  contadorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginBottom: 12,
  },
  contadorButton: {
    backgroundColor: "#1E40FF",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  contadorButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 22,
  },
  cantidadText: {
    color: "#1f40ff",
    fontSize: 20,
    fontWeight: "700",
    minWidth: 24,
    textAlign: "center",
  },
  agregarButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  agregarButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  agregarButtonEnabled: {
    backgroundColor: "#16a34a",
  },
  agregarButtonText: {
    fontWeight: "700",
    fontSize: 16,
  },
  agregarButtonTextDisabled: {
    color: "#6b7280",
  },
  agregarButtonTextEnabled: {
    color: "#fff",
  },
});