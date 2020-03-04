import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableNativeFeedback
} from "react-native";

const BottomNavBarItem = ({ item, isSelected, onTabChange }) => {
  return (
    <TouchableNativeFeedback
      onPress={() => onTabChange(item.id)}
      background={TouchableNativeFeedback.Ripple("#FF6363", true)}
    >
      <View style={styles.container}>
        <Image
          source={isSelected ? item.selectedIcon : item.icon}
          style={styles.icon}
          fadeDuration={0}
        />
        {isSelected && (
          <Text
            style={isSelected ? styles.itemSelectedTitle : styles.itemTitle}
          >
            {item.title}
          </Text>
        )}
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    width: 24,
    height: 24
  },
  itemTitle: {
    color: "#333"
  },
  itemSelectedTitle: {
    color: "#FF6363",
    fontSize: 12,
    marginTop: 4
  }
});

export default BottomNavBarItem;
