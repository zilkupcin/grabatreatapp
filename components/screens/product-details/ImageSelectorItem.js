import React from "react";
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Image
} from "react-native";

const ImageSelectorItem = ({
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
    isEnabled &&
      onOptionSelect(option.name, option.value, optionIndex, option.imageSrc);
  };

  const getSelectorStyle = () => {
    return isSelected
      ? styles.optionImageSelected
      : isEnabled
      ? styles.optionImage
      : styles.optionImageDisabled;
  };

  return (
    <View
      style={[
        styles.optionItemImage,
        { width: itemWidth, paddingLeft, paddingRight }
      ]}
    >
      <TouchableWithoutFeedback onPress={handleOptionSelect}>
        <Image
          style={[getSelectorStyle(), { height: itemWidth }]}
          source={{
            uri: option.imageSrc
          }}
        />
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  optionItemImage: {
    paddingBottom: 8
  },
  optionImage: {
    width: "100%",
    height: 60,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10
  },
  optionImageSelected: {
    width: "100%",
    height: 60,
    borderColor: "#FF6363",
    borderWidth: 1,
    borderRadius: 10
  },
  optionImageDisabled: {
    width: "100%",
    height: 60,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    opacity: 0.5
  }
});

export default ImageSelectorItem;
