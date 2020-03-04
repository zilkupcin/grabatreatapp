import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text, ScrollView } from "react-native";
import MainTextInput from "../../inputs/MainTextInput";
import OutlineButton from "../../buttons/OutlineButton";
import LoadingIndicator from "../../loading-indicator/LoadingIndicator";
import GdprDialog from "../../dialogs/GdprDialog";
import { checkIfEuropean } from "../../../utils/userUtils";
import Parse from "parse/react-native";
import TosCheckBox from "../../checkboxes/TosCheckbox";
import { checkInputRegistration } from "../../../utils/inputUtils";
import ActionDialog from "../../dialogs/ActionDialog";
import { getPageContentWidthPercentage } from "../../../utils/dimensUtils";
import fetch from "cross-fetch";
import { clearParseCache } from "../../../utils/storageUtils";
import { dialogActions } from "../../../constants";
import { buildParseError, buildGeneralAlert } from "../../../utils/dialogUtils";

const screenLogo = require("../../../images/screen_logo.png");

const Register = React.memo(({ navigation }) => {
  const ipAddress = navigation.getParam("ipAddress");
  const country = navigation.getParam("countryCode");

  //Registration state
  const [tosAccepted, setTosAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  //Dialog State
  const [dialogMessage, setDialogMessage] = useState(null);

  //Gdpr state
  const [gdprContent, setGdprContent] = useState("");
  const [gdprAnswered, setGdprAnswered] = useState(false);
  const [gdprRequired, setGdprRequired] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  //Input state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  useEffect(() => {
    if (checkIfEuropean(data.countryCode)) {
      fetchGdpr();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchGdpr = async () => {
    try {
      const gdpr = await Parse.Cloud.run("getLatestGdpr");
      const data = await fetch(gdpr._url);
      const text = await data.text();
      setGdprContent(text);
      setGdprRequired(true);
    } catch (error) {
      if (error.code === 209) {
        handleInvalidSession();
      }
    }
  };

  const handleInvalidSession = async () => {
    await clearParseCache();
    setDialogMessage(
      buildGeneralAlert(
        "Error!",
        "There's been a syncing error, please force close and reopen the app and it will be back to normal",
        dialogActions.DIALOG_ACTION_EXIT
      )
    );
  };

  const handleTosCheck = () => {
    setTosAccepted(!tosAccepted);
  };

  const handleConsent = isAccepted => {
    setConsentGiven(isAccepted);
    setGdprAnswered(true);
    setIsLoading(false);
  };

  const handleRegisterPress = () => {
    setIsRegistering(true);
    let inputError = checkInputRegistration(
      username,
      password,
      repeatPassword,
      gdprRequired,
      consentGiven,
      tosAccepted
    );
    if (inputError) {
      setDialogMessage(inputError);
      setIsRegistering(false);
    } else {
      register();
    }
  };

  const register = async () => {
    try {
      await Parse.Cloud.run("signUp", {
        username: username.trim(),
        password: password.trim(),
        regCountry: country,
        regIp: ipAddress,
        gdprAccepted: gdprRequired && consentGiven ? true : false
      });
      await signIn();
      finishRegistration();
    } catch (error) {
      if (error.code === 209) {
        handleInvalidSession();
      } else {
        setDialogMessage(buildParseError(error.message));
        setIsRegistering(false);
      }
    }
  };

  const signIn = async () => {
    const sessionKey = await Parse.Cloud.run("login", { username, password });
    await Parse.User.become(sessionKey);
    if (gdprRequired && consentGiven) {
      await Parse.Cloud.run("addGeneralGdprConsent");
    }
  };

  const finishRegistration = () => {
    navigation.navigate("Intro");
  };

  const handleDialogAction = () => {
    setDialogMessage(null);
  };

  const handleInputChange = (name, text) => {
    if (name === "username") {
      setUsername(text);
    } else if (name === "password") {
      setPassword(text);
    } else if (name === "repeatPassword") {
      setRepeatPassword(text);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.contentContainer}>
        <LoadingIndicator />
        {gdprRequired && !gdprAnswered && (
          <GdprDialog content={gdprContent} onConsent={handleConsent} />
        )}
        {dialogMessage && (
          <ActionDialog
            isVisible={dialogMessage ? true : false}
            onActionPress={handleDialogAction}
            title={dialogMessage.title}
            message={dialogMessage.message}
            positiveAction={dialogMessage.positiveAction}
            negativeAction={dialogMessage.negativeAction}
          />
        )}
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContainer}
      keyboardShouldPersistTaps="always"
    >
      <View style={styles.contentContainer}>
        <Image source={screenLogo} style={styles.logo} />
        <Text />
        <MainTextInput
          placeholder={
            checkIfEuropean(country) && !consentGiven
              ? "USERNAME"
              : "EMAIL ADDRESS"
          }
          marginTop={0}
          marginBottom={24}
          type="emailAddress"
          isSecure={false}
          value={username}
          onChange={handleInputChange}
          name="username"
          editable={true}
        />
        <MainTextInput
          placeholder="PASSWORD"
          marginTop={0}
          marginBottom={24}
          type="password"
          isSecure={true}
          value={password}
          onChange={handleInputChange}
          name="password"
          editable={true}
        />
        <MainTextInput
          placeholder="CONFIRM PASSWORD"
          marginTop={0}
          marginBottom={24}
          type="password"
          isSecure={true}
          value={repeatPassword}
          onChange={handleInputChange}
          name="repeatPassword"
          editable={true}
        />

        <TosCheckBox tosAccepted={tosAccepted} onCheck={handleTosCheck} />

        <OutlineButton
          title="Create an Account"
          marginTop={24}
          marginBottom={0}
          stretch={true}
          disabled={isRegistering}
          onPress={handleRegisterPress}
        />
        {dialogMessage && (
          <ActionDialog
            isVisible={dialogMessage ? true : false}
            onActionPress={handleDialogAction}
            title={dialogMessage.title}
            message={dialogMessage.message}
            positiveAction={dialogMessage.positiveAction}
            negativeAction={dialogMessage.negativeAction}
          />
        )}
      </View>
    </ScrollView>
  );
});

Register.navigationOptions = ({ navigation }) => ({
  header: null
});

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: getPageContentWidthPercentage()
  },
  logo: {
    width: 100,
    height: 100
  },
  checkBox: {
    marginLeft: 0,
    marginTop: 0,
    marginRight: 8,
    marginBottom: 0,
    padding: 0
  },
  termsText: {
    flex: 1
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start"
  }
});

export default Register;
