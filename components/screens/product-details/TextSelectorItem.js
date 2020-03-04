import React from "react";
import { View, TouchableWithoutFeedback, StyleSheet, Text } from "react-native";

const TextSelectorItem = ({
  option,
  onOptionSelect,
  isEnabled,
  isSelected,
  optionIndex,
  itemWidth,
  paddingLeft,
  paddingRight
}) => {
  const handleOptionSelect = () => {
    isEnabled && onOptionSelect(option.name, option.value, optionIndex);
  };

  const getSelectorStyle = () => {
    return isSelected
      ? styles.optionTextSelected
      : isEnabled
      ? styles.optionText
      : styles.optionTextDisabled;
  };

  return (
    <View
      style={[
        styles.optionItem,
        { width: itemWidth, paddingLeft, paddingRight }
      ]}
    >
      <TouchableWithoutFeedback onPress={handleOptionSelect}>
        <Text style={getSelectorStyle()}>{option.value}</Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  optionItem: {
    paddingBottom: 8
  },
  optionTextSelected: {
    width: "100%",
    borderColor: "#FF6363",
    borderWidth: 1,
    borderRadius: 10,
    color: "#fff",
    fontFamily: "roboto_medium",
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 4,
    paddingLeft: 4,
    fontSize: 10,
    backgroundColor: "#FF6363",
    textAlign: "center"
  },
  optionTextDisabled: {
    width: "100%",
    borderColor: "#FF6363",
    borderWidth: 1,
    borderRadius: 10,
    color: "#FF6363",
    fontFamily: "roboto_medium",
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 4,
    paddingLeft: 4,
    fontSize: 10,
    textAlign: "center",
    opacity: 0.5
  },
  optionText: {
    width: "100%",
    borderColor: "#FF6363",
    borderWidth: 1,
    borderRadius: 10,
    color: "#FF6363",
    fontFamily: "roboto_medium",
    fontSize: 10,
    textAlign: "center",
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 4,
    paddingLeft: 4
  }
});

export default TextSelectorItem;
