import React, { useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import PageActionBar from "../../action-bars/PageActionBar";
import ActionDialog from "../../dialogs/ActionDialog";
import MainTextInput from "../../inputs/MainTextInput";
import { getPageContentWidthPercentage } from "../../../utils/dimensUtils";
import OutlineButtonReversed from "../../buttons/OutlineButtonReversed";
import { checkInputCompleteProfile } from "../../../utils/inputUtils";
import {
  buildGeneralAlert,
  buildGeneralError
} from "../../../utils/dialogUtils";
import { dialogActions } from "../../../constants";
import Parse from "parse/react-native";
import { setShouldRemoveOffer } from "../../../utils/storageUtils";

const CompleteProfile = ({ navigation }) => {
  //Page state
  const [dialogMessage, setDialogMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Form state
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const requireOfferRemoval = navigation.getParam("requireOfferRemoval");

  const handleInputChange = (name, text) => {
    if (name === "emailAddress") {
      setEmailAddress(text);
    } else if (name === "password") {
      setPassword(text);
    } else if (name === "repeatPassword") {
      setRepeatPassword(text);
    }
  };

  const handleSubmit = () => {
    const inputCheckResponse = checkInputCompleteProfile(
      emailAddress,
      password,
      repeatPassword
    );
    if (inputCheckResponse) {
      setDialogMessage(inputCheckResponse);
      setIsSubmitting(false);
    } else {
      completeProfile();
    }
  };

  const completeProfile = async () => {
    setIsSubmitting(true);
    try {
      await Parse.Cloud.run("completeSignup", { emailAddress, password });
      setIsCompleted(true);
      setDialogMessage(
        buildGeneralAlert(
          "Success!",
          "You've completed your registration!",
          dialogActions.DIALOG_ACTION_GO_BACK
        )
      );
    } catch (error) {
      setDialogMessage(buildGeneralError(error.message));
      setIsSubmitting(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const goBack = async () => {
    if (isCompleted) {
      if (requireOfferRemoval) {
        await setShouldRemoveOffer(true);
        navigation.goBack();
      } else {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: "Dashboard" })]
        });
        navigation.dispatch(resetAction);
      }
    }
  };

  const handleDialogAction = action => {
    if (action === dialogActions.DIALOG_ACTION_GO_BACK) {
      goBack();
    } else {
      setDialogMessage(null);
    }
  };

  return (
    <View style={styles.pageContainer}>
      <PageActionBar
        title="Complete Profile"
        borderEnabled={true}
        hasParent={true}
        onBackPress={handleBackPress}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.contentContainerStyle}>
          <Text style={styles.subText}>
            Please set an email address and a password for this account so you
            don't lose it and we can update you on the status of your orders
          </Text>
          <MainTextInput
            placeholder="EMAIL ADDRESS"
            marginTop={0}
            marginBottom={24}
            type="none"
            editable={true}
            value={emailAddress}
            name="emailAddress"
            onChange={handleInputChange}
          />
          <MainTextInput
            placeholder="PASSWORD"
            marginTop={0}
            marginBottom={24}
            type="password"
            editable={true}
            isSecure={true}
            value={password}
            name="password"
            onChange={handleInputChange}
          />
          <MainTextInput
            placeholder="CONFIRM PASSWORD"
            marginTop={0}
            isSecure={true}
            marginBottom={24}
            type="password"
            editable={true}
            value={repeatPassword}
            name="repeatPassword"
            onChange={handleInputChange}
          />
          <OutlineButtonReversed
            title="Submit"
            width={200}
            disabled={isSubmitting}
            onPress={handleSubmit}
            center={true}
          />
        </View>
      </ScrollView>
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
};

CompleteProfile.navigationOptions = ({ navigation }) => ({
  header: null
});

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1
  },
  subText: {
    fontFamily: "roboto_light",
    marginBottom: 32,
    fontSize: 16,
    textAlign: "center"
  },
  scrollView: {
    flex: 1
  },
  scrollViewContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 24
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: getPageContentWidthPercentage()
  }
});

export default CompleteProfile;
