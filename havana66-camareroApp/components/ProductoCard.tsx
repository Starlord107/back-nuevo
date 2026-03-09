import { useMemo, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

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
  añadirAlCarrito: (producto: Producto, formato?: Formato) => void;
};

export default function ProductoCard({ producto, añadirAlCarrito }: Props) {
  const formatos = producto.formatos ?? [];

  const [formatoSeleccionadoId, setFormatoSeleccionadoId] = useState<number | null>(
    formatos.length > 0 ? formatos[0].id : null
  );

  const formatoSeleccionado = useMemo(() => {
    return formatos.find((f) => f.id === formatoSeleccionadoId);
  }, [formatos, formatoSeleccionadoId]);

  const precioMostrar =
    formatoSeleccionado?.precio ??
    (typeof producto.precio === "number" ? producto.precio : 0);

  const handleAdd = () => {
    if (formatos.length > 0) {
      añadirAlCarrito(producto, formatoSeleccionado);
      return;
    }

    añadirAlCarrito(producto);
  };

  return (
    <View style={styles.card}>
      {producto.imagen ? (
        <Image source={{ uri: producto.imagen }} style={styles.image} resizeMode="contain" />
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

      {formatos.length > 0 ? (
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={formatoSeleccionadoId}
            onValueChange={(itemValue) => setFormatoSeleccionadoId(itemValue)}
            style={styles.picker}
          >
            {formatos.map((f) => (
              <Picker.Item
                key={f.id}
                label={`${f.nombre} - ${Number(f.precio).toFixed(2)} €`}
                value={f.id}
              />
            ))}
          </Picker>
        </View>
      ) : null}

      <Text style={styles.price}>{Number(precioMostrar).toFixed(2)} €</Text>

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>
          {formatos.length > 0 ? "Añadir formato" : "Añadir"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: "100%",
    height: 180,
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
    color: "#1f40ff",
    textAlign: "center",
    marginTop: 4,
  },
  description: {
    color: "#6b7280",
    marginTop: 6,
    marginBottom: 8,
    textAlign: "center",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#c7d2fe",
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#eef2ff",
  },
  picker: {
    width: "100%",
  },
  price: {
    color: "#1f40ff",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1f40ff",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});