import { Container } from "@/components/Container";
import { items } from "@/lib/mock";
import { colors, layout } from "@/lib/theme";
import React from "react";
import { ListRenderItemInfo, StyleSheet, Text } from "react-native";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type ItemType = (typeof items)[0];

export function Interpolation() {
  const index = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      index.value = e.contentOffset.x / (layout.itemSize + layout.spacing);
    },
  });

  return (
    <Container style={styles.container}>
      <Animated.FlatList
        data={items}
        onScroll={onScroll}
        horizontal
        contentContainerStyle={{
          gap: layout.spacing,
          paddingHorizontal: (layout.screenWidth - layout.itemSize) / 2,
        }}
        snapToInterval={layout.itemSize + layout.spacing}
        decelerationRate={"fast"}
        renderItem={(props) => <Item {...props} currentIndex={index} />}
      />
    </Container>
  );
}

type ItemProps = ListRenderItemInfo<ItemType> & {
  currentIndex: SharedValue<number>;
};

export function Item({ item, index, currentIndex }: ItemProps) {
  const animation = useAnimatedStyle(() => {
    const offset = index - Math.abs(currentIndex.value);

    const scale = interpolate(
      offset,
      [-1, 0, 1],
      [0.8, 1, 0.8],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity: scale,
    };
  });

  return (
    <Animated.View style={[styles.item, animation]}>
      <Text>{item.label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: layout.itemSize,
    height: layout.itemSize * 1.67,
    borderRadius: layout.radius,
    justifyContent: "flex-end",
    padding: layout.spacing,
    backgroundColor: colors.overlay,
  },
  container: {
    padding: 0,
  },
});
