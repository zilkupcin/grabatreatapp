import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, DatePickerAndroid } from "react-native";
import OutlineButton from "../buttons/OutlineButton";
import MainTextInput from "../inputs/MainTextInput";
import PlainButton from "../buttons/PlainButton";
import PressableTextInput from "../inputs/PressableTextInput";
import { strings } from "../../constants";
import TextError from "../text/TextError";
import { checkInputSupport } from "../../utils/inputUtils";
import Parse from "parse/react-native";

const OfferSupportDialog = ({
  offer,
  onSupportDialogActionPress,
  onCancelTicket
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  //Controller input values
  const [offerCompletionDate, setOfferCompletionDate] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleDateInputPress = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        setOfferCompletionDate(formatDate(year, month, day));
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  };

  const handleActionPress = () => {
    if (submitted) {
      onSupportDialogActionPress(offer);
    } else {
      const inputCheckResult = checkInputSupport(
        name,
        email,
        offerCompletionDate
      );
      if (inputCheckResult) {
        setError(inputCheckResult);
      } else {
        submitTicket();
      }
    }
  };

  const submitTicket = async () => {
    setError("");
    setIsSubmitting(true);
    const submissionUrl = buildSubmissionUrl();
    try {
      const response = await fetch(submissionUrl, { method: "POST" });
      if (response.status !== 201) {
        setError("Something went wrong, please try again");
      } else {
        setSubmitted(true);
        setIsSubmitting(false);
      }
    } catch (e) {
      isSubmitting(false);
      setError("Something went wrong, please try again.");
    }
  };

  const buildSubmissionUrl = () => {
    return `https://adscendmedia.com/adwall/api/publisher/37495/profile/15556/user/${
      Parse.User.current().id
    }/tickets.json?name=${name.trim()}&email=${email.trim()}&subject_id=1&offer_name=${
      offer.title
    }&completed_at=${offerCompletionDate}`;
  };

  const formatDate = (year, month, day) => {
    month = month + 1;
    let monthString = month + "";
    let dayString = day + "";

    if (monthString.length == 1) {
      monthString = "0" + monthString;
    }
    if (dayString.length == 1) {
      dayString = "0" + dayString;
    }

    return `${year}-${monthString}-${dayString}`;
  };

  const handleInputChange = (name, text) => {
    if (name === "name") {
      setName(text);
    } else if (name === "email") {
      setEmail(text);
    } else if (date) {
      setOfferCompletionDate(text);
    }
  };

  return (
    <Modal
      animationType="fade"
      visible={true}
      transparent={false}
      backgroundColor="transparent"
    >
      <View style={styles.container}>
        <View style={styles.dialogBox}>
          <Text style={styles.dialogTitle}>
            {submitted ? "Ticket submitted!" : "Submit ticket"}
          </Text>
          <Text style={styles.dialogMessage}>
            {submitted
              ? strings.SUPPORT_SUCCESS
              : strings.SUPPORT_DIALOG_MESSAGE}
          </Text>
          {!submitted && (
            <MainTextInput
              placeholder="NAME"
              marginTop={0}
              marginBottom={12}
              type="name"
              isSecure={false}
              editable={true}
              name="name"
              onChange={handleInputChange}
            />
          )}
          {!submitted && (
            <MainTextInput
              placeholder="EMAIL ADDRESS"
              marginTop={0}
              marginBottom={12}
              type="emailAddress"
              isSecure={false}
              editable={true}
              value={email}
              name="email"
              onChange={handleInputChange}
            />
          )}
          {!submitted && (
            <PressableTextInput
              placeholder="TASK COMPLETION DATE"
              marginTop={0}
              marginBottom={error !== "" ? 12 : 24}
              onPress={handleDateInputPress}
              value={offerCompletionDate}
              name="date"
              onChange={handleInputChange}
            />
          )}
          {error !== "" && <TextError message={error} marginBottom={12} />}
          <OutlineButton
            title={submitted ? "Ok" : "Submit"}
            onPress={handleActionPress}
            width={200}
            disabled={isSubmitting && true}
          />
          {!submitted && (
            <PlainButton
              title="NOT NOW"
              marginTop={12}
              marginBottom={12}
              onPress={onCancelTicket}
            />
          )}
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
    maxWidth: 600,
    maxHeight: 600,
    margin: 16,
    flexDirection: "column",
    alignItems: "center"
  },
  dialogTitle: {
    fontFamily: "roboto_medium",
    fontSize: 18
  },
  dialogMessage: {
    fontFamily: "roboto_light",
    fontSize: 16,
    marginBottom: 16,
    marginTop: 16,
    alignSelf: "center",
    textAlign: "center"
  }
});

export default OfferSupportDialog;
