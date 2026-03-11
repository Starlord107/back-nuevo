import { Image, StyleSheet, View } from "react-native";


type Props = {
  size?: number;
};

export default function LogoIcon({ size = 80 }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/public/havana663.png")}
        style={[styles.logo, { width: size, height: size }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    shadowColor: "#1d4ed8",
    shadowOpacity: 0.9,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
  },
});