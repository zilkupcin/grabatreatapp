import React, { useRef } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import Tab from "./Tab";

const TabView = React.memo(({ tabs, selectedTab, onSelectTab }) => {
  const scrollView = useRef(null);
  const tabContainer = useRef(null);

  const SCREEN_WIDTH = Dimensions.get("window").width;

  const handleSelectTab = (event, offsetX, width) => {
    const scrollXCalculated = offsetX - SCREEN_WIDTH / 2 + width / 2;
    scrollView.current.scrollTo({ x: scrollXCalculated, y: 0, animated: true });
    onSelectTab(event);
  };

  return (
    <ScrollView
      horizontal={true}
      style={styles.scrollView}
      showsHorizontalScrollIndicator={false}
      ref={scrollView}
    >
      <View style={styles.container} ref={tabContainer}>
        {tabs.map((tab, index) => {
          return (
            <Tab
              title={tab.title}
              key={index}
              isSelected={selectedTab === index ? true : false}
              index={index}
              onSelectTab={handleSelectTab}
              parentRef={tabContainer}
            />
          );
        })}
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  scrollView: {
    flexGrow: 0,
    alignSelf: "flex-start",
    paddingBottom: 4
  }
});

export default TabView;
