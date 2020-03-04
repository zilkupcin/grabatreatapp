import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions
} from "react-native";
import PlainButton from "../buttons/PlainButton";
import OutlineButton from "../buttons/OutlineButton";
import HTML from "react-native-render-html";
import { Linking } from "expo";
import OutlineButtonReversed from "../buttons/OutlineButtonReversed";

const handleLinkPress = () => {
  Linking.openURL("http://grabatreat.com/privacy.html");
};

const GdprDialog = ({ content, onConsent }) => {
  return (
    <Modal animationType="fade" visible={true} transparent={false}>
      <View style={styles.container}>
        <View style={styles.dialogBox}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.headerText}>We care about your privacy!</Text>
            <HTML
              html={content}
              baseFontStyle={{ fontFamily: "roboto_light" }}
              ignoredStyles={["font-family", "letter-spacing"]}
            />
          </ScrollView>
          <PlainButton
            title="Tap to read our privacy policy"
            marginTop={16}
            marginBottom={16}
            onPress={handleLinkPress}
          />
          <View style={styles.dialogActionContainer}>
            <OutlineButton
              title="Disagree"
              marginLeft={8}
              onPress={() => onConsent(false)}
            />
            <OutlineButtonReversed
              title="Agree"
              marginLeft={8}
              onPress={() => onConsent(true)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  dialogBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 24,
    minWidth: 200,
    maxWidth: Dimensions.get("window").width * 0.9,
    maxHeight: Dimensions.get("window").height * 0.8,
    margin: 16,
    flexDirection: "column",
    alignItems: "center"
  },
  headerText: {
    fontFamily: "roboto_light",
    fontSize: 20,
    alignSelf: "center",
    marginBottom: 16
  },
  dialogBoxContent: {
    height: 300,
    flexDirection: "column",
    alignItems: "center"
  },
  dialogActionContainer: {
    display: "flex",
    flexDirection: "row"
  }
});

export default GdprDialog;
