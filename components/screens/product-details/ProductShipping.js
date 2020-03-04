import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TextLabel from "../../text/TextLabel";

const ProductShipping = React.memo(() => {
  return (
    <View style={styles.container}>
      <TextLabel title="SHIPPING" marginTop={16} marginBottom={16} />
      <Text style={styles.shippingText}>
        Shipping is <Text style={styles.shippingTextBold}>FREE!</Text>
      </Text>
      <Text style={styles.shippingText}>
        Delivery time: <Text style={styles.shippingTextBold}>35 - 60 Days</Text>
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignSelf: "flex-start",
    marginBottom: 16
  },
  shippingText: {
    fontSize: 16
  },
  shippingTextBold: {
    fontWeight: "bold"
  }
});

export default ProductShipping;
