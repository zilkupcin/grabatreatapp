import React from "react";
import { StyleSheet, View, Text } from "react-native";
import OutlineButton from "../buttons/OutlineButton";

const CriticalError = React.memo(({ message, onRetryPress, retryDisabled }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorHeader}>Error!</Text>
      <Text style={styles.errorMessage}>{message}</Text>
      {!retryDisabled && (
        <OutlineButton
          title="Retry"
          width={200}
          marginTop={16}
          marginBottom={16}
          onPress={onRetryPress}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 16
  },
  errorHeader: {
    fontSize: 20,
    marginBottom: 16
  },
  errorMessage: {
    fontFamily: "roboto_light",
    fontSize: 16,
    textAlign: "center"
  }
});

export default CriticalError;
