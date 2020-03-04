import React from "react";
import { Text, View, StyleSheet } from "react-native";

const DividedMessage = ({ startText, endText }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.startText}>{startText}</Text>
      <Text style={styles.endText}>{endText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30
  },
  startText: {
    fontSize: 24,
    fontWeight: "300",
    color: "#333",
    textAlign: "center",
    fontFamily: "roboto_light"
  },
  endText: {
    fontWeight: "500",
    fontSize: 24,
    color: "#FF6363",
    textAlign: "center"
  }
});

export default DividedMessage;
