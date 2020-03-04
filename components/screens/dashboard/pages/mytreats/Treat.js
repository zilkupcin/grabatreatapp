import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";

const TreatPriceTag = ({ price }) => {
  return (
    <View style={styles.priceTagContainer}>
      <Text style={styles.priceTagText}>{`${price} Points`}</Text>
    </View>
  );
};

const Treat = ({ treat }) => {
  return (
    <View style={styles.container}>
      <View style={styles.treatImageContainer}>
        <Image style={styles.treatImage} source={{ uri: treat.imageSrc }} />
      </View>
      <View style={styles.treatInfoContainer}>
        <Text style={styles.treatTitle}>
          {treat.title} -{" "}
          {treat.variant !== "Default Title" ? treat.variant : ""}
        </Text>
        <Text style={styles.treatOrderDate}>{`Date ordered: ${
          treat.date
        }`}</Text>
        <Text
          style={styles.treatOrderNumber}
        >{`Order number: #${treat.orderNumber + 1000}`}</Text>
      </View>
      <TreatPriceTag price={treat.price} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderColor: "#C4C4C4",
    borderWidth: 1,
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 16,
    marginBottom: 16,
    alignItems: "center"
  },
  treatImageContainer: {
    borderRadius: 10,
    overflow: "hidden"
  },
  treatImage: {
    width: 60,
    height: 60
  },
  treatInfoContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 8,
    marginRight: 8
  },
  priceTagContainer: {
    backgroundColor: "#B3ECCB",
    padding: 8,
    borderRadius: 10
  },
  priceTagText: {
    color: "#2ECC71",
    fontFamily: "roboto_medium",
    fontSize: 12
  },
  treatTitle: {
    fontFamily: "roboto_medium",
    fontSize: 14
  },
  treatOrderDate: {
    color: "#878787"
  },
  treatOrderNumber: {
    color: "#878787"
  }
});

export default Treat;
