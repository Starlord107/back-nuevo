import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  categoriaPrincipal: string;
  setCategoriaPrincipal: (value: string) => void;
  categoriaSecundaria: string;
  setCategoriaSecundaria: (value: string) => void;
  subcategoriasDisponibles: string[];
};

export default function CategoriaTabs({
  categoriaPrincipal,
  setCategoriaPrincipal,
  categoriaSecundaria,
  setCategoriaSecundaria,
  subcategoriasDisponibles,
}: Props) {
  const categoriasPrincipales = ["Bebidas", "Comidas"];

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {categoriasPrincipales.map((cat) => {
          const active = categoriaPrincipal === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.mainTab, active && styles.mainTabActive]}
              onPress={() => setCategoriaPrincipal(cat)}
            >
              <Text style={[styles.mainTabText, active && styles.mainTabTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {subcategoriasDisponibles.map((sub) => {
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  row: {
    paddingVertical: 6,
    gap: 8,
  },
  mainTab: {
    backgroundColor: "#e6ecff",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
  },
  mainTabActive: {
    backgroundColor: "#1f40ff",
  },
  mainTabText: {
    color: "#1f40ff",
    fontWeight: "bold",
  },
  mainTabTextActive: {
    color: "#fff",
  },
  subTab: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dbe4ff",
  },
  subTabActive: {
    backgroundColor: "#1f40ff",
    borderColor: "#1f40ff",
  },
  subTabText: {
    color: "#1f40ff",
    fontWeight: "600",
  },
  subTabTextActive: {
    color: "#fff",
  },
});