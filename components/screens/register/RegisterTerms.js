import React from "react";
import { View } from "react-native";
import PageActionBar from "../../action-bars/PageActionBar";
import HTML from "react-native-render-html";
import { ScrollView, StyleSheet } from "react-native";
import { Linking } from "expo";
import OutlineButton from "../../buttons/OutlineButton";
import OutlineButtonReversed from "../../buttons/OutlineButtonReversed";

const RegisterTerms = ({ content, onTermsAction }) => {
  const handleLinkPress = href => {
    Linking.openURL(href);
  };

  return (
    <View style={styles.pageContainer}>
      <PageActionBar
        title="Terms of Service"
        hasParent={false}
        borderEnabled={true}
      />
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <HTML
          html={content}
          baseFontStyle={{ fontFamily: "roboto_light" }}
          ignoredStyles={["font-family", "letter-spacing"]}
          tagsStyles={{ a: { color: "#FF6363" } }}
          onLinkPress={handleLinkPress}
        />
      </ScrollView>
      <View style={styles.actionContainer}>
        <OutlineButton
          title="Disagree"
          marginLeft={8}
          onPress={() => onTermsAction(false)}
        />
        <OutlineButtonReversed
          title="Agree"
          marginLeft={8}
          onPress={() => {
            onTermsAction(true);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1
  },
  scrollViewContainer: {
    padding: 16
  },
  scrollView: {
    flex: 1
  },
  actionContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#dedede"
  }
});

export default RegisterTerms;
