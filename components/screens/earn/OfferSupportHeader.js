import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { strings } from "../../../constants";

const OfferSupportHeader = React.memo(() => {
  return (
    <View style={styles.container}>
      <Text style={styles.supportMessage}>{strings.SUPPORT_PAGE_HEADER}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderColor: "#C4C4C4",
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    width: "100%",
    flexDirection: "row",
    alignItems: "center"
  },
  supportMessage: {
    fontFamily: "roboto_light"
  }
});

export default OfferSupportHeader;
