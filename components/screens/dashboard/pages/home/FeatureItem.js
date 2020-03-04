import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

const FeatureItem = ({ feature, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: feature.bgColor }]}
      onPress={() => onPress(feature.featureId)}
      activeOpacity={0.7}
    >
      <View style={styles.feature}>
        <Image source={feature.icon} style={styles.featureImage} />
        <View style={styles.featureInfo}>
          <Text style={styles.featureTitle}>{feature.title}</Text>
          <Text style={styles.featureDescription}>{feature.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    marginRight: 16
  },
  feature: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  featureInfo: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    maxWidth: 150
  },
  featureImage: {
    width: 35,
    height: 35
  },
  featureTitle: {
    color: "#fff",
    fontFamily: "roboto_medium"
  },
  featureDescription: {
    color: "#fff",
    fontFamily: "roboto_light",
    textAlign: "center",
    fontSize: 12
  }
});

export default FeatureItem;
