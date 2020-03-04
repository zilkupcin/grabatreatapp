import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { getPageContentWidthPercentage } from "../../../utils/dimensUtils";

const TutorialStep = ({ title, description, image }) => {
  return (
    <View style={styles.container}>
      {title ? <Text style={styles.tutorialHeading}>{title}</Text> : null}
      {description ? (
        <Text style={styles.tutorialDescription}>{description}</Text>
      ) : null}
      {image && (
        <Image
          source={image}
          style={styles.tutorialImage}
          resizeMode="contain"
        ></Image>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: getPageContentWidthPercentage()
  },
  tutorialImage: {
    width: 200,
    height: 400
  },
  tutorialHeading: {
    fontSize: 20
  },
  tutorialDescription: {
    fontFamily: "roboto_light",
    marginTop: 12,
    marginBottom: 12,
    fontSize: 16,
    textAlign: "center"
  }
});

export default TutorialStep;
