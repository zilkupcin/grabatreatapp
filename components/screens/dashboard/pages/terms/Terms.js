import React from "react";
import HTML from "react-native-render-html";
import { ScrollView, StyleSheet } from "react-native";
import { Linking } from "expo";

const Terms = React.memo(({ content }) => {
  const handleLinkPress = (event, href) => {
    Linking.openURL(href);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContainer}
      showsVerticalScrollIndicator={false}
    >
      <HTML
        html={content}
        baseFontStyle={{ fontFamily: "roboto_light" }}
        ignoredStyles={["font-family", "letter-spacing"]}
        tagsStyles={{ a: { color: "#FF6363" } }}
        onLinkPress={handleLinkPress}
      />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollViewContainer: {
    padding: 16
  }
});

export default Terms;
