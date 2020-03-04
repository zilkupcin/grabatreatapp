import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import PageActionBar from "../../action-bars/PageActionBar";
import { tutorialSteps } from "../../../data/tutorialSteps";
import TutorialStep from "./TutorialStep";

const Tutorial = ({ navigation }) => {
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <PageActionBar
        hasParent={true}
        title="Tutorial"
        onBackPress={handleBackPress}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        {tutorialSteps.map((step, index) => {
          return (
            <TutorialStep
              key={index}
              title={step.title}
              description={step.description}
              image={step.image}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

Tutorial.navigationOptions = ({ navigation }) => ({
  header: null
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  scrollViewContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 24
  }
});

export default Tutorial;
