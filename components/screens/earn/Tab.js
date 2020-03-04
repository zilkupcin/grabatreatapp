import React, { useRef } from "react";
import ReactNative, { View, Text, StyleSheet } from "react-native";
import { TouchableNativeFeedback } from "react-native-gesture-handler";

const Tab = ({ title, isSelected, onSelectTab, index, parentRef }) => {
  const tab = useRef(null);

  const handleSelectTab = () => {
    tab.current.measureLayout(
      ReactNative.findNodeHandle(parentRef.current),
      (fx, fy, width, height, px, py) => {
        onSelectTab(index, fx, width);
      }
    );
  };

  return (
    <View>
      <TouchableNativeFeedback
        onPress={handleSelectTab}
        background={TouchableNativeFeedback.Ripple("#FF6363", true)}
        delayPressIn={0}
      >
        <View style={styles.container} ref={tab}>
          <Text style={styles.tabTitle}>{title}</Text>
          {isSelected && <View style={styles.tabIndicator} />}
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column"
  },
  tabIndicator: {
    width: "100%",
    height: 4,
    borderRadius: 5,
    backgroundColor: "#FF6363"
  },
  tabTitle: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    textTransform: "uppercase",
    fontSize: 14,
    fontFamily: "roboto_medium",
    letterSpacing: 1,
    color: "#333"
  }
});

export default React.memo(Tab);
