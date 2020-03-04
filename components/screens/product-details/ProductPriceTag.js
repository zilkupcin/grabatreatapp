import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

const tagIcon = require("../../../images/tag.png");

const ProductPriceTag = React.memo(({ price }) => {
  return (
    <View style={styles.priceTagContainer}>
      <Image style={styles.priceTagImage} source={tagIcon} />
      <Text style={styles.priceTagText}>{`${price} Points!`}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  priceTagContainer: {
    borderColor: "#FF6363",
    borderRadius: 10,
    borderWidth: 1,
    padding: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 200
  },
  priceTagText: {
    fontFamily: "roboto_medium",
    marginLeft: 16,
    color: "#FF6363"
  },
  priceTagImage: {
    width: 25,
    height: 25
  }
});

export default ProductPriceTag;
