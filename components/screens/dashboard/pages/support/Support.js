import React from "react";
import { StyleSheet, View, Text, Image, ScrollView } from "react-native";
import OutlineButton from "../../../../buttons/OutlineButton";
import { strings, features } from "../../../../../constants";
import { getPageContentWidthPercentage } from "../../../../../utils/dimensUtils";

const emailIcon = require("../../../../../images/email.png");

const Support = React.memo(({ onTutorialPress }) => {
  const onReadTutorialPress = () => {
    onTutorialPress(features.FEATURE_TUTORIAL);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      style={styles.scrollView}
    >
      <View style={styles.contentContainer}>
        <Image source={emailIcon} style={styles.pageImg} />
        <Text style={styles.primaryHeading}>Have a question?</Text>
        <Text style={styles.pageDescription}>
          {strings.SUPPORT_PAGE_DESCRIPTION}
        </Text>
        <Text style={styles.email}>grabatreatapp@gmail.com</Text>
        <Text style={styles.secondaryHeading}>
          Not sure how to use the app?
        </Text>
        <OutlineButton
          title="READ THE TUTORIAL"
          width={200}
          marginBottom={16}
          onPress={onReadTutorialPress}
        />
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: getPageContentWidthPercentage()
  },
  pageImg: {
    width: 100,
    height: 100
  },
  pageTitle: {
    fontSize: 24,
    marginTop: 24,
    marginBottom: 24,
    textAlign: "center"
  },
  primaryHeading: {
    fontSize: 20,
    marginTop: 24,
    marginBottom: 24,
    textAlign: "center"
  },
  secondaryHeading: {
    fontSize: 18,
    marginTop: 56,
    marginBottom: 12,
    textAlign: "center"
  },
  pageDescription: {
    fontSize: 16,
    fontFamily: "roboto_light",
    textAlign: "center"
  },
  email: {
    fontFamily: "roboto_bold",
    fontSize: 18
  }
});

export default Support;
