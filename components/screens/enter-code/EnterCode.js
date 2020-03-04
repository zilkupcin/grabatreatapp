import React, { useState } from "react";
import { Image, Text, View, StyleSheet, ScrollView } from "react-native";
import PageActionBar from "../../action-bars/PageActionBar";
import OutlineButton from "../../buttons/OutlineButton";
import MainTextInput from "../../inputs/MainTextInput";
import { strings, dialogActions } from "../../../constants";
import { checkInputInvite } from "../../../utils/inputUtils";
import ActionDialog from "../../dialogs/ActionDialog";
import Parse from "parse/react-native";
import { setShouldRemoveOffer } from "../../../utils/storageUtils";
import { getPageContentWidthPercentage } from "../../../utils/dimensUtils";
import {
  buildGeneralError,
  buildGeneralAlert,
  buildParseError
} from "../../../utils/dialogUtils";

const announcementIcon = require("../../../images/announcement.png");

const EnterCode = ({ navigation }) => {
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [invitationCode, setInvitationCode] = useState("");
  const [dialogMessage, setDialogMessage] = useState(null);
  const [codeSubmitted, setCodeSubmitted] = useState(false);

  const userInvitationCode = navigation.getParam("invitationCode");

  const handleCodeSubmit = () => {
    setSubmitEnabled(false);

    //Check for errors
    const inputCheckResponse = checkInputInvite(
      invitationCode,
      userInvitationCode
    );

    if (inputCheckResponse) {
      setDialogMessage(buildGeneralError(inputCheckResponse));
      setSubmitEnabled(true);
    } else {
      submitInvitationCode();
    }
  };

  const submitInvitationCode = async () => {
    try {
      const response = await Parse.Cloud.run("enterInvitationCode", {
        InvCode: invitationCode.trim()
      });
      parseResponse(response);
    } catch (e) {
      setDialogMessage(buildParseError(e.message));
      setSubmitEnabled(true);
    }
  };

  const parseResponse = async response => {
    if (response === 0) {
      setDialogMessage(
        buildGeneralError("You've already entered an invitation code")
      );
    } else if (response === 1) {
      setDialogMessage(
        buildGeneralError("The code you've entered is incorrect")
      );
      setSubmitEnabled(true);
    } else if (response === 2) {
      setDialogMessage(buildGeneralError("You can't enter your own code"));
      setSubmitEnabled(true);
    } else if (response === 3) {
      setDialogMessage(
        buildGeneralAlert(
          "Success!",
          "Code accepted!",
          dialogActions.DIALOG_ACTION_DO_NOTHING
        )
      );
      setCodeSubmitted(true);
    }
  };

  const handleBackPress = () => {
    goBack();
  };

  const goBack = async () => {
    if (codeSubmitted) {
      await setShouldRemoveOffer(true);
    }
    navigation.goBack();
  };

  const handleCodeInputChange = (name, text) => {
    setInvitationCode(text);
  };

  const handleDialogActionPress = () => {
    setDialogMessage(null);
  };

  return (
    <View style={styles.container}>
      <PageActionBar
        hasParent={true}
        title="Enter Invitation Code"
        onBackPress={handleBackPress}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.contentContainer}>
          <Image style={styles.pageImage} source={announcementIcon} />
          <Text style={styles.pageTitle}>Have you been invited?</Text>
          <Text style={styles.pageMessage}>
            {strings.ENTER_CODE_REWARD_MESSAGE}
          </Text>
          <MainTextInput
            placeholder="INVITATION CODE"
            type="none"
            marginTop={24}
            marginBottom={24}
            editable={true}
            value={invitationCode}
            onChange={handleCodeInputChange}
            name="invCode"
          />
          <OutlineButton
            title="Submit"
            onPress={handleCodeSubmit}
            width={250}
            disabled={!submitEnabled}
          />
        </View>
      </ScrollView>
      {dialogMessage && (
        <ActionDialog
          isVisible={dialogMessage ? true : false}
          onActionPress={handleDialogActionPress}
          title={dialogMessage.title}
          message={dialogMessage.message}
          positiveAction={dialogMessage.positiveAction}
          negativeAction={dialogMessage.negativeAction}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  scrollViewContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    flex: 1
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: getPageContentWidthPercentage()
  },
  pageImage: {
    width: 100,
    height: 100
  },
  pageTitle: {
    fontSize: 20,
    marginBottom: 24,
    marginTop: 16
  },
  pageMessage: {
    fontFamily: "roboto_light",
    fontSize: 16
  }
});

EnterCode.navigationOptions = ({ navigation }) => ({
  header: null
});

export default EnterCode;
