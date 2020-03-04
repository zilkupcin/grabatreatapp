import React from "react";
import { StyleSheet, View, Text } from "react-native";

const PageError = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  message: {
    flex: 1,
    fontFamily: "roboto_light",
    fontSize: 16,
    textAlignVertical: "center",
    textAlign: "center"
  }
});

export default PageError;
