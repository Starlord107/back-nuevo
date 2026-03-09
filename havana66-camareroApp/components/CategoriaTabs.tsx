import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  categoriaPrincipal: string;
  setCategoriaPrincipal: (value: string) => void;
  categoriaSecundaria: string;
  setCategoriaSecundaria: (value: string) => void;
  subcategoriasDisponibles?: string[];
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

  const getIconSource = (categoria: string, sub?: string, selected?: boolean) => {
    if (!sub) {
      if (categoria === "Bebidas") {
        return selected
          ? require("../assets/bebidas/bebidawhite.png")
          : require("../assets/bebidas/bebida.png");
      }

      return selected
        ? require("../assets/comidas/sswhite.png")
        : require("../assets/comidas/ss.png");
    }

    const baseFolder = categoria === "Comidas" ? "comidas" : "bebidas";
    const fileName = sub
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // React Native no permite require dinámico real.
    // Aquí tienes que mapear cada icono manualmente:
    const iconMap: any = {
      bebidas: {
        cocteles: {
          normal: require("../assets/bebidas/cocteles.png"),
          active: require("../assets/bebidas/cocteleswhite.png"),
        },
        vinos: {
          normal: require("../assets/bebidas/vinos.png"),
          active: require("../assets/bebidas/vinoswhite.png"),
        },
        sangrias: {
          normal: require("../assets/bebidas/sangrias.png"),
          active: require("../assets/bebidas/sangriaswhite.png"),
        },
        tragos: {
          normal: require("../assets/bebidas/tragos.png"),
          active: require("../assets/bebidas/tragoswhite.png"),
        },
        refrescos: {
          normal: require("../assets/bebidas/refrescos.png"),
          active: require("../assets/bebidas/refrescoswhite.png"),
        },
        cervezas: {
          normal: require("../assets/bebidas/cervezas.png"),
          active: require("../assets/bebidas/cervezaswhite.png"),
        },
      },
      comidas: {
        hamburguesas: {
          normal: require("../assets/comidas/hamburguesas.png"),
          active: require("../assets/comidas/hamburguesaswhite.png"),
        },
        tapas: {
          normal: require("../assets/comidas/tapas.png"),
          active: require("../assets/comidas/tapaswhite.png"),
        },
        bocadillos: {
          normal: require("../assets/comidas/bocadillos.png"),
          active: require("../assets/comidas/bocadilloswhite.png"),
        },
        platos: {
          normal: require("../assets/comidas/platos.png"),
          active: require("../assets/comidas/platoswhite.png"),
        },
      },
    };

    return iconMap[baseFolder]?.[fileName]?.[selected ? "active" : "normal"];
  };

  return (
    <View style={styles.wrapper}>
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
                <View style={styles.tabContent}>
                  <Image source={getIconSource(cat, undefined, active)} style={styles.mainIcon} />
                  <Text style={[styles.mainTabText, active && styles.mainTabTextActive]}>
                    {cat}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.subTabsContainer}
        contentContainerStyle={styles.subTabsRow}
      >
        {subtabs.map((sub) => {
          const active = categoriaSecundaria === sub;
          const iconSource = getIconSource(categoriaPrincipal, sub, active);

          return (
            <TouchableOpacity
              key={sub}
              style={[styles.subTab, active && styles.subTabActive]}
              onPress={() => setCategoriaSecundaria(sub)}
            >
              <View style={styles.tabContent}>
                {iconSource && (
                  <Image
                    source={iconSource}
                    style={sub === "Platos" ? styles.platosIcon : styles.subIcon}
                  />
                )}
                <Text style={[styles.subTabText, active && styles.subTabTextActive]}>
                  {sub}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    gap: 14,
  },
  mainTabsContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#8fdfff",
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  mainTabsRow: {
    flexDirection: "row",
    gap: 12,
  },
  mainTab: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  mainTabActive: {
    backgroundColor: "#1f40ff",
  },
  mainTabText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  mainTabTextActive: {
    color: "#fff",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  mainIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  subTabsContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#8fdfff",
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  subTabsRow: {
    gap: 10,
    paddingRight: 8,
  },
  subTab: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  subTabActive: {
    backgroundColor: "#1f40ff",
  },
  subTabText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  subTabTextActive: {
    color: "#fff",
  },
  subIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  platosIcon: {
    width: 34,
    height: 34,
    resizeMode: "contain",
  },
});