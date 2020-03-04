import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";

const giftIcon = require("../../../../../images/gift.png");

const TagWithImage = ({ minPrice, maxPrice }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.tagImage} source={giftIcon} />
      <Text style={styles.tagText}>
        {minPrice !== maxPrice
          ? `From ${minPrice} Points!`
          : `${minPrice} Points!`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFD4D4",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 5,
    paddingTop: 4,
    paddingBottom: 4
  },
  tagImage: {
    width: 20,
    height: 20,
    marginRight: 4
  },
  tagText: {
    color: "#FF7F7F",
    fontSize: 12,
    fontFamily: "roboto_medium"
  }
});

export default TagWithImage;
