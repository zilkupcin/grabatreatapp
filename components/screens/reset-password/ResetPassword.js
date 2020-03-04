import React, { useState } from "react";
import { View, ScrollView, Image, StyleSheet } from "react-native";
import DividedMessage from "../../text/DividedMessage";
import MainTextInput from "../../inputs/MainTextInput";
import OutlineButton from "../../buttons/OutlineButton";
import ActionDialog from "../../dialogs/ActionDialog";
import { checkInputResetPassword } from "../../../utils/inputUtils";
import { getPageContentWidthPercentage } from "../../../utils/dimensUtils";
import Parse from "parse/react-native";
import { dialogActions, errorMessages } from "../../../constants";
import { clearParseCache } from "../../../utils/storageUtils";
import {
  buildGeneralError,
  buildGeneralAlert
} from "../../../utils/dialogUtils";

const screenLogo = require("../../../images/screen_logo.png");

const ResetPassword = () => {
  const [dialogMessage, setDialogMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  const handleDialogAction = action => {
    if (action !== dialogActions.DIALOG_ACTION_PASSWORD_RESET_SUCCESS) {
      setIsSubmitting(false);
    }
    setDialogMessage(null);
  };

  const handleInputChange = (name, text) => {
    if (name === "email") {
      setEmail(text);
    }
  };

  const handleSubmitPress = () => {
    setIsSubmitting(true);
    const inputResponse = checkInputResetPassword(email);
    if (inputResponse) {
      setDialogMessage(buildGeneralError(inputResponse));
    } else {
      handleResetPassword();
    }
  };

  const handleResetPassword = async () => {
    try {
      await Parse.User.requestPasswordReset(email.trim());
      setDialogMessage(
        buildGeneralAlert(
          "Success!",
          "A password reset link will be shortly sent to your email address, please also check your spam folder if you can't find it",
          dialogActions.DIALOG_ACTION_PASSWORD_RESET_SUCCESS
        )
      );
    } catch (error) {
      if (error.code === 209) {
        handleInvalidSession();
      } else if (error.code === 205) {
        setDialogMessage(
          buildGeneralError(errorMessages.ERROR_RESET_INVALID_EMAIL)
        );
      } else {
        setDialogMessage(buildGeneralError(error.message));
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

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContainer}
      keyboardShouldPersistTaps="always"
    >
      <View style={styles.contentContainer}>
        <Image source={screenLogo} style={styles.logo} />
        <DividedMessage startText={"Reset your password"} endText="" />
        <MainTextInput
          placeholder="EMAIL ADDRESS"
          marginTop={0}
          marginBottom={24}
          type="none"
          isSecure={false}
          value={email}
          name="email"
          onChange={handleInputChange}
          editable={true}
        />
        <OutlineButton
          title="Reset Password"
          marginTop={24}
          marginBottom={0}
          width={250}
          onPress={handleSubmitPress}
          disabled={isSubmitting ? true : false}
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

ResetPassword.navigationOptions = ({ navigation }) => ({
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
export default ResetPassword;
