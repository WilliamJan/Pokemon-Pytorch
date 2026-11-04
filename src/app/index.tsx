import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import pokemonSmallImages from "../../constants/pokemonSmallImages";
import pokemonLargeImages from "../../constants/pokemonLargeImages";
import { useState } from "react";

const COLUMNS = 5; // change this to adjust the number of columns
const GAP = 8;
const SIDE_PADDING = 12;

export default function Index() {
  /*
  const API_URL = "http://192.168.2.237:8000";
  const [msg, setMsg] = useState("loading...");

  useEffect(() => {
    fetch(`${API_URL}/hello`)
      .then((r) => r.json())
      .then((d) => setMsg(d.message))
      .catch((e) => setMsg("Error: " + e.message));
  }, []);
  */
  const [unlocked, setUnlocked] = useState(["1"]);
  const [bigCard, setBigCard] = useState(0);

  const entries = Object.keys(pokemonSmallImages)
    .map(Number)
    .sort((a, b) => a - b)
    .map((n) => ({
      id: n,
      number: String(n).padStart(3, "0") + "/086",
      image: pokemonSmallImages[n],
    }));

  const { width } = useWindowDimensions();
  const boxWidth = (width - SIDE_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/gradient-bg.png")}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />
      {bigCard != 0 ? (
        <BlurView
          intensity={100}
          style={{
            zIndex: 12,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            source={pokemonLargeImages[bigCard]}
            style={{
              zIndex: 3,
              position: "absolute",
              top: "10%",
              left: "10%",
              width: "80%",
              aspectRatio: 2.5 / 3.5,
            }}
          />
        </BlurView>
      ) : null}
      <Text style={styles.title}></Text>
      <FlatList
        data={entries}
        numColumns={COLUMNS}
        keyExtractor={(item) => String(item.id)}
        style={styles.grid}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={{ gap: GAP }}
        ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
        renderItem={({ item }) => (
          <Pressable
            style={{
              width: boxWidth,
              aspectRatio: 2.5 / 3.5,
            }}
            onPress={() => {
              setBigCard(item.id);
            }}
          >
            <Image
              source={item.image}
              style={{
                width: "100%",
                height: "100%",
                opacity: unlocked.includes(String(item.id)) ? 1 : 0.5,
              }}
            ></Image>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 2,
                width: "100%",
                height: "100%",
                backgroundColor: "rgb(10, 10, 10, 0)",
                borderRadius: 3,
                borderWidth: 1,
                borderColor: "white",
                shadowColor: "black",
                shadowOffset: { width: 2, height: 2 },
                shadowRadius: 32,
                shadowOpacity: 1,
              }}
            />
          </Pressable>
        )}
      />
      <View style={styles.buttonWrapper}>
        <Pressable style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Button</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  grid: { flex: 1 },
  gridContent: { paddingHorizontal: SIDE_PADDING },
  box: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  image: { width: "100%", aspectRatio: 2.5 / 3.5 },
  name: { fontSize: 11, fontWeight: "600", marginTop: 4 },
  number: { fontSize: 10, color: "#666" },
  buttonWrapper: { alignItems: "center", paddingVertical: 20 },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "#3b82f6",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
