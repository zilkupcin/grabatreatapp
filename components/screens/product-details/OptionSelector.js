import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import TextLabel from "../../text/TextLabel";
import TextSelector from "./TextSelector";
import ImageSelector from "./ImageSelector";

const OptionSelector = React.memo(
  ({
    variants,
    optionIndex,
    selectedOptions,
    filteredValues,
    onOptionSelect
  }) => {
    const getSelectorType = () => {
      if (
        variants[0].options[optionIndex].name.toLowerCase().includes("color") &&
        hasImages()
      ) {
        return (
          <ImageSelector
            imageOptions={getUniqueImageOptions()}
            onOptionSelect={onOptionSelect}
            filteredValues={filteredValues}
            selectedOptions={selectedOptions}
            optionIndex={optionIndex}
          />
        );
      } else {
        return (
          <TextSelector
            textOptions={getUniqueTextValues()}
            onOptionSelect={onOptionSelect}
            filteredValues={filteredValues}
            selectedOptions={selectedOptions}
            optionIndex={optionIndex}
          />
        );
      }
    };

    const getUniqueTextValues = () => {
      const uniqueValues = [
        ...new Set(variants.map(variant => variant.options[optionIndex].value))
      ];

      return uniqueValues.map(uniqueValue => {
        return {
          value: uniqueValue
        };
      });
    };

    const getUniqueImageOptions = () => {
      const uniqueValues = [
        ...new Set(variants.map(variant => variant.options[optionIndex].value))
      ];
      return uniqueValues.map(uniqueValue => {
        return {
          value: uniqueValue,
          imageSrc: findImage(uniqueValue).imageSrc
        };
      });
    };

    const findImage = value => {
      return variants.find(variant => {
        return variant.options[optionIndex].value === value;
      });
    };

    const hasImages = () => {
      const foundVariant = variants.find(
        variant => variant.imageSrc !== variants[0].imageSrc
      );
      if (foundVariant) {
        return true;
      } else {
        return false;
      }
    };

    const getSelectorLabel = () => {
      const title = variants[0].options[optionIndex].name;
      if (title.includes("Main Stone Color") || title.includes("Metal Color")) {
        return "Select Type";
      }
      return title;
    };

    return (
      <View style={styles.container}>
        <TextLabel
          title={getSelectorLabel()}
          marginTop={16}
          marginBottom={16}
        />
        {getSelectorType()}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignSelf: "flex-start",
    width: "100%"
  }
});

export default OptionSelector;
