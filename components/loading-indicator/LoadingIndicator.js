import React from "react";
import { ActivityIndicator, View, StyleSheet, Text } from "react-native";

const LoadingIndicator = React.memo(({ willTakeLong }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={52} color="#FF6363" />
      {willTakeLong && (
        <Text style={styles.text}>This might take up to 10 seconds</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  text: {
    fontFamily: "roboto_light",
    marginTop: 8
  }
});

export default LoadingIndicator;
