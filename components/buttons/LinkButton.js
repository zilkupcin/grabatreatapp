import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const LinkButton = ({ title, marginTop, marginBottom, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.buttonText, { marginTop, marginBottom }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: "#333",
    textTransform: "uppercase"
  }
});

export default LinkButton;
