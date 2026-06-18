import { useSegments } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppSettings } from "@/lib/app-settings";
import {
  chooseRareVisitorMessage,
  getRareVisitorDisplayPlan,
  getRareVisitorOverlayProps,
  readRareVisitorLastSeenAt,
  recordRareVisitorSeen,
  shouldShowRareVisitor,
} from "@/lib/rare-visitor-cat";

type RareVisitorVisit = {
  id: number;
  direction: "left-to-right" | "right-to-left";
  message: string | null;
  reducedMotion: boolean;
};

export function RareVisitorCat() {
  const routeSegments = useSegments();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { batterySaver, hasCompletedOnboarding, isNightMode, isOnboardingLoaded, reduceMotion } =
    useAppSettings();
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);
  const [visit, setVisit] = useState<RareVisitorVisit | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const mountedRef = useRef(true);
  const overlayProps = useMemo(() => getRareVisitorOverlayProps(), []);

  const effectiveReducedMotion = reduceMotion || batterySaver || systemReducedMotion;

  useEffect(() => {
    mountedRef.current = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mountedRef.current) {
          setSystemReducedMotion(enabled);
        }
      })
      .catch(() => undefined);

    const subscription = AccessibilityInfo.addEventListener?.(
      "reduceMotionChanged",
      setSystemReducedMotion,
    );

    return () => {
      mountedRef.current = false;
      subscription?.remove?.();
    };
  }, []);

  useEffect(() => {
    if (!isOnboardingLoaded || !hasCompletedOnboarding || visit) {
      return;
    }

    let cancelled = false;

    async function maybeInviteCat() {
      const now = Date.now();
      const lastSeenAt = await readRareVisitorLastSeenAt().catch(() => null);

      if (
        cancelled ||
        !shouldShowRareVisitor({
          now,
          lastSeenAt,
          randomValue: Math.random(),
          routeSegments,
        })
      ) {
        return;
      }

      const timestamp = new Date(now).toISOString();
      await recordRareVisitorSeen(timestamp).catch(() => undefined);

      if (cancelled || !mountedRef.current) {
        return;
      }

      setVisit({
        id: now,
        direction: Math.random() < 0.5 ? "left-to-right" : "right-to-left",
        message: chooseRareVisitorMessage(Math.random()),
        reducedMotion: effectiveReducedMotion,
      });
    }

    maybeInviteCat();

    return () => {
      cancelled = true;
    };
  }, [effectiveReducedMotion, hasCompletedOnboarding, isOnboardingLoaded, routeSegments, visit]);

  useEffect(() => {
    if (!visit) {
      return;
    }

    progress.setValue(0);
    const plan = getRareVisitorDisplayPlan({ reducedMotion: visit.reducedMotion });
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (plan.shouldAnimate) {
      const animation = Animated.timing(progress, {
        toValue: 1,
        duration: plan.durationMs,
        easing: Easing.linear,
        useNativeDriver: true,
      });

      animation.start(({ finished }) => {
        if (finished && mountedRef.current) {
          setVisit(null);
        }
      });

      return () => {
        animation.stop();
      };
    }

    timeout = setTimeout(() => {
      if (mountedRef.current) {
        setVisit(null);
      }
    }, plan.durationMs);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [progress, visit]);

  if (!visit) {
    return null;
  }

  const offscreenPadding = 96;
  const startX = visit.direction === "left-to-right" ? -offscreenPadding : width + offscreenPadding;
  const endX = visit.direction === "left-to-right" ? width + offscreenPadding : -offscreenPadding;
  const translateX = visit.reducedMotion
    ? width / 2 - 42
    : progress.interpolate({
        inputRange: [0, 1],
        outputRange: [startX, endX],
      });
  const bottomOffset = Math.max(insets.bottom + 86, 96);
  const isFacingLeft = visit.direction === "right-to-left";

  return (
    <Animated.View
      key={visit.id}
      {...overlayProps}
      testID="rare-visitor-cat"
      style={[
        styles.overlay,
        {
          bottom: bottomOffset,
          transform: [{ translateX }],
        },
      ]}
    >
      {visit.message ? (
        <View style={[styles.messageBubble, isNightMode ? styles.nightBubble : styles.dayBubble]}>
          <Text
            numberOfLines={2}
            style={[styles.messageText, isNightMode ? styles.nightMessage : styles.dayMessage]}
          >
            {visit.message}
          </Text>
        </View>
      ) : null}
      <View style={[styles.cat, isFacingLeft && styles.catFacingLeft]}>
        <View style={[styles.tail, isNightMode ? styles.nightFur : styles.dayFur]} />
        <View style={[styles.body, isNightMode ? styles.nightFur : styles.dayFur]}>
          <View style={[styles.fluff, styles.fluffBack]} />
          <View style={[styles.fluff, styles.fluffFront]} />
        </View>
        <View style={[styles.head, isNightMode ? styles.nightFur : styles.dayFur]}>
          <View
            style={[styles.ear, styles.leftEar, isNightMode ? styles.nightFur : styles.dayFur]}
          />
          <View
            style={[styles.ear, styles.rightEar, isNightMode ? styles.nightFur : styles.dayFur]}
          />
          <View style={[styles.eye, styles.leftEye]} />
          <View style={[styles.eye, styles.rightEye]} />
          <View style={styles.nose} />
        </View>
        <View
          style={[styles.paw, styles.frontPaw, isNightMode ? styles.nightPaw : styles.dayPaw]}
        />
        <View style={[styles.paw, styles.backPaw, isNightMode ? styles.nightPaw : styles.dayPaw]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    zIndex: 50,
    alignItems: "center",
    gap: 6,
  },
  messageBubble: {
    maxWidth: 190,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  dayBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderColor: "rgba(111, 137, 168, 0.24)",
  },
  nightBubble: {
    backgroundColor: "rgba(11, 22, 38, 0.84)",
    borderColor: "rgba(226, 232, 240, 0.18)",
  },
  messageText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  dayMessage: {
    color: "#405169",
  },
  nightMessage: {
    color: "#E2E8F0",
  },
  cat: {
    width: 78,
    height: 46,
  },
  catFacingLeft: {
    transform: [{ scaleX: -1 }],
  },
  body: {
    position: "absolute",
    left: 12,
    bottom: 8,
    width: 46,
    height: 27,
    borderRadius: 18,
    borderCurve: "continuous",
  },
  head: {
    position: "absolute",
    left: 45,
    bottom: 16,
    width: 26,
    height: 25,
    borderRadius: 14,
    borderCurve: "continuous",
  },
  dayFur: {
    backgroundColor: "#F7EFE2",
    borderColor: "rgba(153, 122, 88, 0.16)",
    borderWidth: 1,
  },
  nightFur: {
    backgroundColor: "#DDE4EE",
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
  },
  tail: {
    position: "absolute",
    left: 0,
    bottom: 18,
    width: 26,
    height: 12,
    borderRadius: 999,
    transform: [{ rotate: "-22deg" }],
  },
  ear: {
    position: "absolute",
    top: -6,
    width: 12,
    height: 12,
    borderRadius: 3,
    transform: [{ rotate: "45deg" }],
  },
  leftEar: {
    left: 3,
  },
  rightEar: {
    right: 3,
  },
  eye: {
    position: "absolute",
    top: 10,
    width: 3,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#435063",
  },
  leftEye: {
    left: 8,
  },
  rightEye: {
    right: 8,
  },
  nose: {
    position: "absolute",
    left: 12,
    top: 15,
    width: 3,
    height: 2,
    borderRadius: 999,
    backgroundColor: "#C8918C",
  },
  fluff: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
  },
  fluffBack: {
    left: 6,
    top: 3,
  },
  fluffFront: {
    right: 6,
    top: 5,
  },
  paw: {
    position: "absolute",
    bottom: 4,
    width: 10,
    height: 7,
    borderRadius: 999,
  },
  frontPaw: {
    left: 47,
  },
  backPaw: {
    left: 22,
  },
  dayPaw: {
    backgroundColor: "#E8D9C5",
  },
  nightPaw: {
    backgroundColor: "#C8D2DE",
  },
});
