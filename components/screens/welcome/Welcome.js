import React from "react";
import { StyleSheet, Image, ScrollView } from "react-native";
import OutlineButton from "../../buttons/OutlineButton";
import PlainButton from "../../buttons/PlainButton";
import DividedMessage from "../../text/DividedMessage";
import TextDivider from "../../text/TextDivider";
import KochavaTracker from "react-native-kochava-tracker";
import FontLoader from "../../font-loader/FontLoader";

const screenLogo = require("../../../images/screen_logo.png");

const Welcome = ({ navigation }) => {
  const registrationFlow = navigation.getParam("registrationFlow");
  const ipAddress = navigation.getParam("ipAddress");
  const countryCode = navigation.getParam("countryCode");
  const countriesToTrack = navigation.getParam("countriesToTrack");

  if (countriesToTrack.includes(countryCode)) {
    var configMapObject = {};
    configMapObject[KochavaTracker.PARAM_ANDROID_APP_GUID_STRING_KEY] =
      "kograb-a-treat-dm9m";
    KochavaTracker.configure(configMapObject);
  }

  const handleSignInPress = () => {
    navigation.navigate("SignIn");
  };

  const handleRegisterPress = () => {
    if (registrationFlow === "manual") {
      navigation.navigate("Register", { ipAddress, countryCode });
    } else {
      navigation.navigate("RegisterAuto", { ipAddress, countryCode });
    }
  };

  return (
    <FontLoader>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        <Image source={screenLogo} style={styles.logo} />
        <DividedMessage startText="Welcome to" endText="Grab a Treat" />
        <OutlineButton
          title={
            registrationFlow === "manual" ? "Create an Account" : "Get Started!"
          }
          marginTop={24}
          marginBottom={24}
          width={250}
          onPress={handleRegisterPress}
        />
        <TextDivider />
        <PlainButton
          title="Login"
          marginTop={24}
          marginBottom={24}
          onPress={handleSignInPress}
        />
      </ScrollView>
    </FontLoader>
  );
};

Welcome.navigationOptions = ({ navigation }) => ({
  header: null
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  logo: {
    width: 100,
    height: 100
  }
});

export default Welcome;
