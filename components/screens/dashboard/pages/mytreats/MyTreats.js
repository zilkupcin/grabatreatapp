import React from "react";
import { ScrollView, Image, Text, StyleSheet, View } from "react-native";
import Treat from "./Treat";
import { strings } from "../../../../../constants";
import { getPageContentWidthPercentage } from "../../../../../utils/dimensUtils";

const shippingIcon = require("../../../../../images/shipping.png");

const MyTreats = React.memo(({ treats }) => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.contentContainer}>
        <Image style={styles.pageImage} source={shippingIcon} />
        <Text style={styles.pageDescription}>
          {treats.length > 0
            ? strings.ORDER_ARRIVAL_NOTICE
            : strings.ORDER_NO_TREATS}
        </Text>
        {treats.map((treat, index) => {
          return <Treat treat={treat} key={index} />;
        })}
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: "column",
    alignItems: "center"
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: getPageContentWidthPercentage()
  },
  pageImage: {
    width: 100,
    height: 100,
    marginBottom: 24
  },
  pageDescription: {
    fontFamily: "roboto_light",
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center"
  }
});

export default MyTreats;
