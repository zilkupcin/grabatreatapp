import React from "react";
import { StyleSheet, Text, Image, TouchableOpacity } from "react-native";

const shoppingBagIcon = require("../../images/shopping_bag.png");

const SolidButton = React.memo(
  ({
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    width,
    onPress,
    title,
    disabled
  }) => {
    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            marginTop,
            marginBottom,
            marginLeft,
            marginRight,
            width,
            opacity: disabled ? 0.5 : 1
          }
        ]}
        activeOpacity={0.6}
        disabled={disabled}
        onPress={onPress}
      >
        <Image style={styles.btnIcon} source={shoppingBagIcon} />
        <Text style={styles.btnText}>{title}</Text>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    backgroundColor: "#FF6363",
    padding: 12
  },
  btnIcon: {
    width: 20,
    height: 20,
    marginRight: 16
  },
  btnText: {
    textTransform: "uppercase",
    fontFamily: "roboto_medium",
    color: "#fff"
  }
});

export default SolidButton;
