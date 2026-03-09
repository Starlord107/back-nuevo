import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  categoriaPrincipal: string;
  setCategoriaPrincipal: (value: string) => void;
  categoriaSecundaria: string;
  setCategoriaSecundaria: (value: string) => void;
};

export default function CategoriaTabs({
  categoriaPrincipal,
  setCategoriaPrincipal,
  categoriaSecundaria,
  setCategoriaSecundaria,
}: Props) {

  const categorias: Record<string, string[]> = {
    Bebidas: ["Cocteles", "Vinos", "Sangrias", "Tragos", "Refrescos", "Cervezas"],
    Comidas: ["Hamburguesas", "Tapas", "Bocadillos", "Platos"],
  };

  const subtabs = categorias[categoriaPrincipal] || [];

  return (
    <View style={styles.wrapper}>

      {/* TABS PRINCIPALES */}
      <View style={styles.mainTabsContainer}>
        <View style={styles.mainTabsRow}>
          {["Bebidas", "Comidas"].map((cat) => {
            const active = categoriaPrincipal === cat;

            return (
              <TouchableOpacity
                key={cat}
                style={[styles.mainTab, active && styles.mainTabActive]}
                onPress={() => {
                  setCategoriaPrincipal(cat);
                  setCategoriaSecundaria("");
                }}
              >
                <Text style={[styles.mainTabText, active && styles.mainTabTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* SUBTABS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.subTabsContainer}
      >
        <View style={styles.subTabsRow}>
          {subtabs.map((sub) => {
            const active = categoriaSecundaria === sub;

            return (
              <TouchableOpacity
                key={sub}
                style={[styles.subTab, active && styles.subTabActive]}
                onPress={() => setCategoriaSecundaria(sub)}
              >
                <Text style={[styles.subTabText, active && styles.subTabTextActive]}>
                  {sub}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  wrapper: {
    marginTop: 20,
  },

  mainTabsContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#8fdfff",
    borderRadius: 18,
    padding: 10,
    marginBottom: 14,
  },

  mainTabsRow: {
    flexDirection: "row",
  },

  mainTab: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    marginRight: 10,
  },

  mainTabActive: {
    backgroundColor: "#1f40ff",
  },

  mainTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },

  mainTabTextActive: {
    color: "#fff",
  },

  subTabsContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#8fdfff",
    borderRadius: 18,
    padding: 10,
  },

  subTabsRow: {
    flexDirection: "row",
  },

  subTab: {
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
  },

  subTabActive: {
    backgroundColor: "#1f40ff",
  },

  subTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },

  subTabTextActive: {
    color: "#fff",
  },

});