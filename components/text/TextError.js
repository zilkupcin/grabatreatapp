import React from "react";
import { Text, StyleSheet } from "react-native";

const TextError = ({ message, marginTop, marginBottom }) => {
  return (
    <Text style={[styles.errorText, { marginTop, marginBottom }]}>
      {message}
    </Text>
  );
};

const styles = StyleSheet.create({
  errorText: {
    fontFamily: "roboto_light",
    color: "#f03434"
  }
});

export default TextError;
