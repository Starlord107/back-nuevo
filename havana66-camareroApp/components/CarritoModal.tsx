import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CarritoItem = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  formato?: string | null;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  carrito: CarritoItem[];
  total: number;
  aumentarCantidad: (id: number, formato?: string | null) => void;
  disminuirCantidad: (id: number, formato?: string | null) => void;
  eliminarProducto: (id: number, formato?: string | null) => void;
  enviarPedido: () => void;
};

export default function CarritoModal({
  visible,
  onClose,
  carrito,
  total,
  aumentarCantidad,
  disminuirCantidad,
  eliminarProducto,
  enviarPedido,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Carrito</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.close}>Cerrar</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.list}>
            {carrito.length === 0 ? (
              <Text style={styles.empty}>No hay productos en el carrito</Text>
            ) : (
              carrito.map((item, index) => (
                <View key={`${item.id}-${item.formato || "base"}-${index}`} style={styles.item}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.nombre}</Text>
                    {!!item.formato && <Text style={styles.itemFormat}>{item.formato}</Text>}
                    <Text style={styles.itemPrice}>
                      {(item.precio * item.cantidad).toFixed(2)}€
                    </Text>
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => disminuirCantidad(item.id, item.formato)}
                    >
                      <Text style={styles.qtyText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtyNumber}>{item.cantidad}</Text>

                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => aumentarCantidad(item.id, item.formato)}
                    >
                      <Text style={styles.qtyText}>+</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => eliminarProducto(item.id, item.formato)}
                    >
                      <Text style={styles.deleteText}>X</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.total}>Total: {total.toFixed(2)}€</Text>

            <TouchableOpacity style={styles.sendButton} onPress={enviarPedido}>
              <Text style={styles.sendButtonText}>Enviar pedido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    minHeight: "60%",
    maxHeight: "85%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  close: {
    color: "#1f40ff",
    fontWeight: "bold",
  },
  list: {
    flexGrow: 0,
  },
  empty: {
    color: "#6b7280",
    marginTop: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemFormat: {
    color: "#6b7280",
    marginTop: 2,
  },
  itemPrice: {
    color: "#1f40ff",
    marginTop: 4,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e5edff",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontWeight: "bold",
    color: "#1f40ff",
  },
  qtyNumber: {
    minWidth: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  deleteButton: {
    marginLeft: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fee2e2",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    color: "#dc2626",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 14,
  },
  total: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  sendButton: {
    backgroundColor: "#1f40ff",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});