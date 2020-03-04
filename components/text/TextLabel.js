import React from "react";
import { StyleSheet, Text } from "react-native";

const TextLabel = React.memo(
  ({ title, marginTop, marginBottom, marginLeft, marginRight }) => {
    return (
      <Text
        style={[
          styles.label,
          { marginTop, marginBottom, marginLeft, marginRight }
        ]}
      >
        {title}
      </Text>
    );
  }
);

const styles = StyleSheet.create({
  label: {
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#494949",
    alignSelf: "flex-start"
  }
});
export default TextLabel;
