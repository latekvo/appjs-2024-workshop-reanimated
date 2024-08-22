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
  const colorIndex = useSharedValue<number>(0);

  const pan = Gesture.Pan()
    .minDistance(0)
    .minVelocity(0)
    .onUpdate((event) => {
      size.value = Math.abs(event.translationY) + defaultSize;
      drag.value = event.translationX;
    })
    .onFinalize(() => {
      size.value = withSpring(defaultSize);
      drag.value = 0;
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
      width: size.value,
      height: size.value,
      borderRadius: size.value + 50,
      backgroundColor: color.value,
      transform: [
        {
          translateX: drag.value - defaultSize,
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

  const slide = useAnimatedStyle(() => {
    return {
      width: drag.value,
      height: 2,
      backgroundColor: color.value,
      position: "relative",
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
      </View>
    </Container>
  );
}
