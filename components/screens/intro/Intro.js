import React, { useState } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import OutlineButton from "../../buttons/OutlineButton";
import { introPages } from "../../../data/introPages";
import { getPageContentWidthPercentage } from "../../../utils/dimensUtils";

const Intro = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handlePageChange = () => {
    if (currentStep < introPages.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate("AuthLoader");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image source={introPages[currentStep].image} style={styles.introImg} />
        <Text style={styles.title}>{introPages[currentStep].title}</Text>
        <Text style={styles.description}>
          {introPages[currentStep].description}
        </Text>
        <OutlineButton
          title={currentStep < introPages.length - 1 ? "Next" : "Start!"}
          stretch={true}
          marginTop={24}
          onPress={handlePageChange}
        />
      </View>
    </View>
  );
};

Intro.navigationOptions = ({ navigation }) => ({
  header: null
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: getPageContentWidthPercentage()
  },
  introImg: {
    width: 100,
    height: 100,
    alignSelf: "center"
  },
  title: {
    fontSize: 24,
    marginTop: 24,
    marginBottom: 24,
    textAlign: "center",
    alignSelf: "center"
  },
  description: {
    fontSize: 16,
    fontFamily: "roboto_light",
    alignSelf: "center",
    textAlign: "center"
  }
});

export default Intro;
