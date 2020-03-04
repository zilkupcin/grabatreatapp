import React, { useState } from "react";
import { StyleSheet, View, Image, ScrollView } from "react-native";
import DividedMessage from "../../text/DividedMessage";
import MainTextInput from "../../inputs/MainTextInput";
import OutlineButton from "../../buttons/OutlineButton";
import LinkButton from "../../buttons/LinkButton";
import Parse from "parse/react-native";
import ActionDialog from "../../dialogs/ActionDialog";
import { checkInputSignIn } from "../../../utils/inputUtils";
import { buildParseError, buildGeneralAlert } from "../../../utils/dialogUtils";
import { getPageContentWidthPercentage } from "../../../utils/dimensUtils";
import { clearParseCache } from "../../../utils/storageUtils";
import { dialogActions } from "../../../constants";

const screenLogo = require("../../../images/screen_logo.png");

const SignIn = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState("");
  const [dialogMessage, setDialogMessage] = useState(null);

  const handleSignInPress = () => {
    setIsSigningIn(true);
    let inputError = checkInputSignIn(username, password);
    if (inputError) {
      setDialogMessage(inputError);
    } else {
      signIn();
    }
  };

  const signIn = async () => {
    try {
      const sessionKey = await Parse.Cloud.run("login", {
        username: username.trim(),
        password: password.trim()
      });
      await Parse.User.become(sessionKey);
      navigation.navigate("AuthLoader");
    } catch (error) {
      if (error.code === 209) {
        handleInvalidSession();
      } else {
        setDialogMessage(buildParseError(error.message));
      }
    }
  };

  const handleDialogAction = () => {
    setDialogMessage(null);
    setIsSigningIn(false);
  };

  const handleInputChange = (name, text) => {
    if (name === "username") {
      setUsername(text);
    } else if (name === "password") {
      setPassword(text);
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

  const handleResetPasswordPress = () => {
    navigation.navigate("ResetPassword");
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContainer}
      keyboardShouldPersistTaps="always"
    >
      <View style={styles.contentContainer}>
        <Image source={screenLogo} style={styles.logo} />
        <DividedMessage startText={"Sign in &"} endText="Grab a Treat" />
        <MainTextInput
          placeholder="USERNAME OR EMAIL"
          marginTop={0}
          marginBottom={24}
          type="none"
          isSecure={false}
          value={username}
          name="username"
          onChange={handleInputChange}
          editable={true}
        />
        <MainTextInput
          placeholder="PASSWORD"
          marginTop={0}
          marginBottom={16}
          type="password"
          isSecure={true}
          value={password}
          name="password"
          onChange={handleInputChange}
          editable={true}
        />
        <OutlineButton
          title="Sign In"
          marginTop={24}
          marginBottom={0}
          width={250}
          onPress={handleSignInPress}
          disabled={isSigningIn ? true : false}
        />
        <LinkButton
          title="Forgotten your password?"
          marginTop={24}
          onPress={handleResetPasswordPress}
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
};

SignIn.navigationOptions = ({ navigation }) => ({
  header: null
});

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 24
  },
  scrollView: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: getPageContentWidthPercentage()
  },
  logo: {
    width: 100,
    height: 100
  }
});

export default SignIn;
