import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import HTML from "react-native-render-html";
import PrivacyActions from "./PrivacyActions";

const PrivacySettings = React.memo(
  ({ content, hasAgreed, onSettingChange }) => {
    return (
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <HTML
          html={content}
          baseFontStyle={{ fontFamily: "roboto_light" }}
          ignoredStyles={["font-family", "letter-spacing"]}
        />
        <PrivacyActions
          onSettingChange={onSettingChange}
          hasAgreed={hasAgreed}
        />
      </ScrollView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  scrollViewContainer: {
    padding: 16
  }
});

export default PrivacySettings;
