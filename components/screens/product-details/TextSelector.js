import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import TextSelectorItem from "./TextSelectorItem";
import { getNumOfOptionColumns } from "../../../utils/dimensUtils";

const TextSelector = ({
  textOptions,
  onOptionSelect,
  filteredValues,
  selectedOptions,
  optionIndex
}) => {
  const PAGE_SIDE_PADDING = 16;
  const ITEM_PADDING = 4;
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const PAGE_WIDTH = Dimensions.get("window").width - PAGE_SIDE_PADDING * 2;
  const NUM_OF_COLUMNS = getNumOfOptionColumns(SCREEN_WIDTH);
  const ITEM_WIDTH = PAGE_WIDTH / NUM_OF_COLUMNS;

  const checkIfOptionEnabled = value => {
    if (optionIndex === 1 && filteredValues.length !== 0) {
      return filteredValues.find(filteredValue => value === filteredValue);
    } else {
      return true;
    }
  };

  return (
    <View style={styles.container}>
      {textOptions.map(option => {
        return (
          <TextSelectorItem
            option={option}
            key={option.value}
            isEnabled={checkIfOptionEnabled(option.value)}
            isSelected={selectedOptions[optionIndex].value === option.value}
            optionIndex={optionIndex}
            onOptionSelect={onOptionSelect}
            itemWidth={ITEM_WIDTH}
            paddingLeft={ITEM_PADDING}
            paddingRight={ITEM_PADDING}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap"
  }
});

export default TextSelector;
