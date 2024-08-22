import React from "react";

import { Container } from "@/components/Container";
import { tabsList } from "@/lib/mock";
import { hitSlop } from "@/lib/reanimated";
import { colorShades, layout } from "@/lib/theme";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type TabsProps = {
  name: string;
  index: number;
  onPress: (start: number, stop: number) => void;
};

const Tab = memo(({ name, index, onPress }: TabsProps) => {
  const start = useSharedValue(0);
  const stop = useSharedValue(0);

  return (
    <View style={styles.tab}>
      <TouchableOpacity
        hitSlop={hitSlop}
        onLayout={(event) =>
          event.target.measure(
            (_x, _y, w, _h, pageX) => (
              (start.value = pageX - 10), (stop.value = pageX + w)
            )
          )
        }
        style={{ marginHorizontal: layout.spacing }}
        onPress={() => onPress(start.value, stop.value)}
      >
        <Text>{name}</Text>
      </TouchableOpacity>
    </View>
  );
});

// This component should receive the selected tab measurements as props
function Indicator({
  start,
  stop,
}: {
  start: SharedValue<number>;
  stop: SharedValue<number>;
}) {
  const animated = useAnimatedStyle(() => {
    return {
      marginLeft: start.value,
      width: stop.value - start.value,
    };
  });
  return <Animated.View style={[styles.indicator, animated]} />;
}

export function DynamicTabsLesson() {
  const start = useSharedValue(0);
  const stop = useSharedValue(100);

  const onChangeTab = (newStart: number, newStop: number) => {
    console.log(newStart, newStop);
    start.value = withSpring(newStart);
    stop.value = withSpring(newStop);
  };

  return (
    <Container>
      <ScrollView
        horizontal
        style={{ flexGrow: 0 }}
        contentContainerStyle={styles.scrollViewContainer}
        pagingEnabled
      >
        {tabsList.map((tab, index) => (
          <Tab
            key={`tab-${tab}-${index}`}
            name={tab}
            index={index}
            onPress={onChangeTab}
          />
        ))}
        <Indicator start={start} stop={stop} />
      </ScrollView>
      <FlatList
        data={new Array(10).fill(0)}
        renderItem={() => <View style={styles.flatTab} />}
        pagingEnabled
        horizontal
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  indicator: {
    position: "absolute",
    backgroundColor: colorShades.purple.base,
    height: 4,
    borderRadius: 2,
    bottom: 0,
    left: 0,
    width: 100,
  },
  tab: {
    marginHorizontal: layout.spacing,
  },
  scrollViewContainer: {
    paddingVertical: layout.spacing * 2,
  },
  flatTab: {
    backgroundColor: "purple",
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 5,
  },
});
