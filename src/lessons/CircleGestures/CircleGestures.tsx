import React from "react";

import { Container } from "@/components/Container";
import { hitSlop } from "@/lib/reanimated";
import { colorShades } from "@/lib/theme";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export function CircleGesturesLesson() {
  const defaultSize = 25;

  const size = useSharedValue<number>(defaultSize);
  const drag = useSharedValue<number>(defaultSize);
  const color = useSharedValue<string>(colorShades.blue.base);
  const trail = useSharedValue<number>(defaultSize);
  const colorIndex = useSharedValue<number>(0);

  const pan = Gesture.Pan()
    .minDistance(0)
    .minVelocity(0)
    .onUpdate((event) => {
      size.value = Math.abs(event.translationY) + defaultSize;
      drag.value = event.translationX;
      trail.value = withSpring(drag.value);
    })
    .onFinalize(() => {
      size.value = withSpring(defaultSize);
      drag.value = withSpring(0);
      trail.value = withSpring(0);
    });

  const tap = Gesture.Tap().onStart(() => {
    const colors: string[] = [
      colorShades.purple.base,
      colorShades.blue.base,
      colorShades.green.base,
    ];

    let index = colorIndex.value - 1;
    if (index < 0) {
      index = colors.length - 1;
    }

    colorIndex.value = index;
    color.value = withSpring(colors[index]);
  });

  const styles = useAnimatedStyle(() => {
    return {
      position: "absolute",
      width: size.value,
      height: size.value,
      borderRadius: size.value + 50,
      backgroundColor: color.value,
      transform: [
        {
          translateX: drag.value - size.value / 2,
        },
      ],
    };
  });

  const wrapper = useAnimatedStyle(() => {
    return {
      width: 300,
      height: 2,
      backgroundColor: "grey",
      position: "absolute",
      transform: [
        {
          translateX: -150,
        },
      ],
    };
  });

  const bloon = useAnimatedStyle(() => {
    return {
      position: "absolute",
      width: defaultSize,
      height: 50,
      borderRadius: 20,
      backgroundColor: color.value,
      transform: [
        {
          translateX: drag.value - defaultSize / 2,
        },
        {
          translateY: -Math.abs(size.value / 2) - 30,
        },
        {
          scale: Math.min(Math.abs(size.value - defaultSize) / defaultSize, 1),
        },
        {
          rotateZ:
            Math.atan(
              (drag.value - trail.value) / (50 + Math.abs(size.value / 2) + 3)
            ).toString() + "rad",
        },
      ],
    };
  });

  const slide = useAnimatedStyle(() => {
    return {
      width: drag.value + 150,
      height: 2,
      backgroundColor: color.value,
    };
  });

  const gesture = Gesture.Race(pan, tap);

  return (
    <Container>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Animated.View style={wrapper}>
          <Animated.View style={slide} />
        </Animated.View>
        <GestureDetector gesture={gesture}>
          <Animated.View style={styles} hitSlop={hitSlop} />
        </GestureDetector>
        <Animated.View style={bloon} />
      </View>
    </Container>
  );
}
