import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TextDivider = () => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.dividerText}>or</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  dividerText: {
    textTransform: "uppercase",
    color: "#333",
    marginLeft: 4,
    marginRight: 4
  },
  line: {
    borderBottomWidth: 1,
    borderColor: "#333",
    width: "20%"
  }
});

export default TextDivider;
