import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

const PlainButton = ({ title, marginTop, marginBottom, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { marginTop: marginTop, marginBottom: marginBottom }
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 0
  },
  buttonText: {
    color: "#FF6363"
  }
});

export default PlainButton;
