import { useRef, useState } from "react";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CARD_RATIO = 2.5 / 3.5;
const MASK = "rgba(0, 0, 0, 0.6)";
const FILL = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 };

function CloseIcon() {
  const bar = {
    position: "absolute",
    width: 18,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: "white",
  };
  return (
    <View style={{ width: 18, height: 18, justifyContent: "center" }}>
      <View style={[bar, { transform: [{ rotate: "45deg" }] }]} />
      <View style={[bar, { transform: [{ rotate: "-45deg" }] }]} />
    </View>
  );
}

export default function Camera({ onClose, onCapture }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef(null);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.permTitle}>Camera access needed</Text>
        <Text style={styles.permBody}>
          Allow the camera to scan your cards.
        </Text>
        <Pressable style={styles.permButton} onPress={requestPermission}>
          <Text style={styles.permButtonText}>Grant Permission</Text>
        </Pressable>
        <Pressable style={styles.permCancel} onPress={onClose}>
          <Text style={styles.permCancelText}>Not now</Text>
        </Pressable>
      </View>
    );
  }

  async function takePicture() {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const result = await cameraRef.current.takePictureAsync();
      onCapture?.(result.uri);
      console.log(result.uri);
    } finally {
      setCapturing(false);
    }
  }

  // Card guide: sized to fit the screen, sits a little above center
  const frameW = Math.min(width * 0.8, height * 0.6 * CARD_RATIO);
  const frameH = frameW / CARD_RATIO;
  const frameLeft = (width - frameW) / 2;
  const frameTop = (height - frameH) / 2 - 30;

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={FILL} facing="back" />

      {/* Dimmed mask with a card-shaped window */}
      <View style={FILL} pointerEvents="none">
        {/* Ghost card outline */}
        <View
          style={[
            styles.frame,
            { top: frameTop, left: frameLeft, width: frameW, height: frameH },
          ]}
        />

        <Text style={[styles.hint, { top: frameTop - 38 }]}>
          Fit your card inside the frame
        </Text>
      </View>

      {/* Close */}
      <Pressable
        style={({ pressed }) => [
          styles.close,
          { top: insets.top + 12 },
          pressed && { opacity: 0.6 },
        ]}
        onPress={onClose}
        hitSlop={10}
      >
        <CloseIcon />
      </Pressable>

      {/* Shutter */}
      <Pressable
        style={({ pressed }) => [
          styles.shutter,
          { bottom: insets.bottom + 36 },
          pressed && { transform: [{ scale: 0.93 }] },
        ]}
        onPress={takePicture}
        disabled={capturing}
      >
        <View style={[styles.shutterInner, capturing && { opacity: 0.5 }]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  center: { alignItems: "center", justifyContent: "center", padding: 32 },

  permTitle: { color: "white", fontSize: 22, fontWeight: "700" },
  permBody: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },
  permButton: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    backgroundColor: "#4F46E5",
  },
  permButtonText: { color: "white", fontSize: 16, fontWeight: "700" },
  permCancel: { marginTop: 16, padding: 8 },
  permCancelText: { color: "rgba(255,255,255,0.6)", fontSize: 15 },

  mask: { position: "absolute", backgroundColor: MASK },
  frame: {
    position: "absolute",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.9)",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  hint: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  close: {
    position: "absolute",
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    alignItems: "center",
    justifyContent: "center",
  },

  shutter: {
    position: "absolute",
    alignSelf: "center",
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
});
