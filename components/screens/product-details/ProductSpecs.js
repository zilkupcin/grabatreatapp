import React from "react";
import { StyleSheet, View } from "react-native";
import TextLabel from "../../text/TextLabel";
import HTML from "react-native-render-html";

const ProductSpecs = React.memo(({ content }) => {
  return (
    <View style={styles.container}>
      <TextLabel title="DETAILS" marginBottom={16} marginTop={16} />
      <HTML
        html={content}
        baseFontStyle={{ fontSize: 16 }}
        ignoredStyles={["font-family", "letter-spacing"]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignSelf: "flex-start"
  }
});

export default ProductSpecs;
