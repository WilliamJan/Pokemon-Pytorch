import { Image } from "expo-image";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import pokemonLargeImages from "../../constants/pokemonLargeImages";
import pokemonSmallImages from "../../constants/pokemonSmallImages";
import Camera from "./Camera";

const SET_NAME = "Chaos Rising";
const COLUMNS = 5;
const GAP = 8;
const SIDE_PADDING = 14;
const CARD_RATIO = 2.5 / 3.5;

const COLORS = {
  bg: "#F3F4F8",
  text: "#14151A",
  subtle: "#7A7F8C",
  track: "#E0E3EB",
  accent: "#4F46E5",
  overlay: "rgba(10, 10, 14, 0.78)",
};

function ItemSeparator() {
  return <View style={{ height: GAP }} />;
}

function LockIcon() {
  const c = "rgba(255,255,255,0.8)";
  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          width: 8,
          height: 7,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          borderWidth: 1.5,
          borderBottomWidth: 0,
          borderColor: c,
        }}
      />
      <View
        style={{ width: 12, height: 9, borderRadius: 2, backgroundColor: c }}
      />
    </View>
  );
}

function CameraIcon() {
  return (
    <View
      style={{
        width: 30,
        height: 22,
        borderRadius: 5,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          top: -4,
          width: 12,
          height: 5,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: "white",
        }}
      />
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          borderWidth: 3,
          borderColor: COLORS.accent,
        }}
      />
    </View>
  );
}

export default function Index() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // ids stored as numbers everywhere so comparisons are consistent
  const [unlocked, setUnlocked] = useState([1]);
  const [bigCard, setBigCard] = useState(0);
  const [cameraOpen, setCameraOpen] = useState(false);

  const entries = useMemo(
    () =>
      Object.keys(pokemonSmallImages)
        .map(Number)
        .sort((a, b) => a - b)
        .map((n) => ({ id: n, image: pokemonSmallImages[n] })),
    [],
  );

  const total = entries.length;
  const count = unlocked.length;
  const progress = total ? count / total : 0;
  const boxWidth = (width - SIDE_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>SET</Text>
            <Text style={styles.title}>{SET_NAME}</Text>
          </View>
          <View style={styles.countWrap}>
            <Text style={styles.count}>{count}</Text>
            <Text style={styles.countTotal}> / {total}</Text>
          </View>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* Grid */}
      <FlatList
        data={entries}
        numColumns={COLUMNS}
        keyExtractor={(item) => String(item.id)}
        style={styles.grid}
        contentContainerStyle={[
          styles.gridContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        columnWrapperStyle={{ gap: GAP }}
        ItemSeparatorComponent={ItemSeparator}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isUnlocked = unlocked.includes(item.id);
          return (
            <Pressable
              onPress={() => setBigCard(item.id)}
              style={({ pressed }) => [
                styles.card,
                { width: boxWidth },
                pressed && { transform: [{ scale: 0.95 }] },
              ]}
            >
              <Image
                source={item.image}
                style={styles.cardImage}
                transition={150}
              />
              {!isUnlocked && (
                <View style={styles.lockedOverlay}>
                  <LockIcon />
                </View>
              )}
            </Pressable>
          );
        }}
      />

      {/* Camera button */}
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { bottom: insets.bottom + 20 },
          pressed && { transform: [{ scale: 0.92 }] },
        ]}
        onPress={() => setCameraOpen(true)}
      >
        <CameraIcon />
      </Pressable>

      {/* Enlarged card */}
      {bigCard !== 0 && (
        <Pressable style={styles.modal} onPress={() => setBigCard(0)}>
          <Image
            source={pokemonLargeImages[bigCard]}
            style={styles.bigCard}
            contentFit="contain"
            transition={200}
          />
          <Text style={styles.hint}>Tap anywhere to close</Text>
        </Pressable>
      )}

      {/* Camera overlay */}
      {cameraOpen && (
        <View style={styles.cameraLayer}>
          <Camera
            onCapture={() => console.log("captured")}
            onClose={() => setCameraOpen(false)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    paddingHorizontal: SIDE_PADDING,
    paddingBottom: 14,
    backgroundColor: "white",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: COLORS.subtle,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  countWrap: { flexDirection: "row", alignItems: "baseline" },
  count: { fontSize: 28, fontWeight: "800", color: COLORS.accent },
  countTotal: { fontSize: 16, fontWeight: "600", color: COLORS.subtle },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.track,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 3, backgroundColor: COLORS.accent },

  grid: { flex: 1 },
  gridContent: { paddingTop: 18, paddingHorizontal: SIDE_PADDING },

  card: { aspectRatio: CARD_RATIO },
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
    backgroundColor: COLORS.track,
  },
  lockedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 4,
    backgroundColor: "rgba(20, 21, 28, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.accent,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    backgroundColor: COLORS.overlay,
    alignItems: "center",
    justifyContent: "center",
  },
  bigCard: {
    width: "82%",
    aspectRatio: CARD_RATIO,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  hint: { marginTop: 6, color: "rgba(255,255,255,0.8)", fontSize: 12 },
  cameraLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 200,
  },
});
