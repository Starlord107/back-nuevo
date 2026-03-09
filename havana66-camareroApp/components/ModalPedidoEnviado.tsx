import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Item = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  formato?: string | null;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  carrito: Item[];
  enviarPedido: () => void;
  aumentarCantidad: (id: number, formato?: string | null) => void;
  disminuirCantidad: (id: number, formato?: string | null) => void;
  eliminarProducto: (id: number, formato?: string | null) => void;
};

export default function CarritoModal({
  visible,
  onClose,
  carrito,
  enviarPedido,
  aumentarCantidad,
  disminuirCantidad,
  eliminarProducto,
}: Props) {
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.drawer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Pedido Nuevo</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.list}>
            {carrito.length === 0 ? (
              <Text style={styles.emptyText}>El carrito está vacío</Text>
            ) : (
              carrito.map((item, index) => (
                <View
                  key={`${item.id}-${item.formato || "base"}-${index}`}
                  style={styles.itemRow}
                >
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.nombre}</Text>
                    {!!item.formato && (
                      <Text style={styles.itemSubtext}>Formato: {item.formato}</Text>
                    )}
                    <Text style={styles.itemSubtext}>{item.precio} € / unidad</Text>
                  </View>

                  <View style={styles.counter}>
                    <TouchableOpacity
                      onPress={() => disminuirCantidad(item.id, item.formato)}
                      style={styles.counterButton}
                    >
                      <Text style={styles.counterButtonText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.counterValue}>{item.cantidad}</Text>

                    <TouchableOpacity
                      onPress={() => aumentarCantidad(item.id, item.formato)}
                      style={styles.counterButton}
                    >
                      <Text style={styles.counterButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.rightBlock}>
                    <Text style={styles.lineTotal}>
                      {(item.precio * item.cantidad).toFixed(2)} €
                    </Text>

                    <TouchableOpacity onPress={() => eliminarProducto(item.id, item.formato)}>
                      <Text style={styles.deleteText}>×</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{total.toFixed(2)} €</Text>
            </View>

            <TouchableOpacity
              disabled={carrito.length === 0}
              onPress={enviarPedido}
              style={[styles.sendButton, carrito.length === 0 && styles.sendButtonDisabled]}
            >
              <Text style={styles.sendButtonText}>Enviar Pedido</Text>
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
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  drawer: {
    height: "75%",
    backgroundColor: "#0a0f3d",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: "#3b82f6",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 12,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1e3a8a",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  closeText: {
    color: "#fff",
    fontSize: 18,
  },
  list: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  emptyText: {
    color: "#9ca3af",
    textAlign: "center",
    paddingVertical: 24,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1e40af",
    paddingVertical: 14,
    gap: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: "#fff",
    fontWeight: "600",
  },
  itemSubtext: {
    color: "#93c5fd",
    fontSize: 12,
    marginTop: 2,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  counterButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1d4ed8",
    justifyContent: "center",
    alignItems: "center",
  },
  counterButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  counterValue: {
    color: "#fff",
    fontSize: 18,
  },
  rightBlock: {
    minWidth: 90,
    alignItems: "flex-end",
    gap: 6,
  },
  lineTotal: {
    color: "#60a5fa",
    fontWeight: "700",
  },
  deleteText: {
    color: "#ef4444",
    fontSize: 26,
    lineHeight: 26,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#1e3a8a",
    backgroundColor: "#0a0f3d",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  totalLabel: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  totalValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  sendButton: {
    backgroundColor: "#1f40ff",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});