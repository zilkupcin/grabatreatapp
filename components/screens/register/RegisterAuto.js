import React, { useEffect, useState } from "react";
import Parse from "parse/react-native";
import LoadingIndicator from "../../loading-indicator/LoadingIndicator";
import RegisterTerms from "./RegisterTerms";
import { checkIfEuropean } from "../../../utils/userUtils";
import { clearParseCache } from "../../../utils/storageUtils";
import { buildGeneralAlert } from "../../../utils/dialogUtils";
import RegisterConsent from "./RegisterConsent";
import { dialogActions } from "../../../constants";
import ActionDialog from "../../dialogs/ActionDialog";

const RegisterAuto = ({ navigation }) => {
  const ipAddress = navigation.getParam("ipAddress");
  const country = navigation.getParam("countryCode");

  const [terms, setTerms] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  //GDPR related
  const [gdprContent, setGdprContent] = useState("");
  const [gdprRequired, setGdprRequired] = useState(false);

  //Dialog State
  const [dialogMessage, setDialogMessage] = useState(null);

  const handleTermsAction = action => {
    if (!action) {
      navigation.goBack();
    } else {
      if (checkIfEuropean(country)) {
        fetchGdpr();
      } else {
        register();
      }
    }
  };

  const handleConsentAction = consent => {
    register(consent);
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const register = async consent => {
    setIsLoading(true);
    try {
      const sessionToken = await Parse.Cloud.run("signUpAuto", {
        gdprAccepted: consent,
        regCountry: country,
        regIp: ipAddress
      });
      await Parse.User.become(sessionToken);
      if (gdprRequired && consent) {
        await Parse.Cloud.run("addGeneralGdprConsent");
      }
      finishRegistration();
    } catch (e) {}
  };

  const finishRegistration = () => {
    navigation.navigate("Intro");
  };

  const fetchTerms = async () => {
    try {
      const terms = await Parse.Cloud.run("fetchTerms");
      const data = await fetch(terms.get("document")._url);
      const text = await data.text();
      setTerms(text);
      setIsLoading(false);
    } catch (e) {
      if (e.code === 209) {
        handleInvalidSession();
      }
    }
  };

  const fetchGdpr = async () => {
    try {
      setIsLoading(true);
      const gdpr = await Parse.Cloud.run("getLatestGdpr");
      const data = await fetch(gdpr._url);
      const text = await data.text();
      setGdprContent(text);
      setGdprRequired(true);
      setIsLoading(false);
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

  const handleDialogAction = action => {
    setDialogMessage(null);
  };

  if (dialogMessage)
    return (
      <ActionDialog
        isVisible={dialogMessage ? true : false}
        onActionPress={handleDialogAction}
        title={dialogMessage.title}
        message={dialogMessage.message}
        positiveAction={dialogMessage.positiveAction}
        negativeAction={dialogMessage.negativeAction}
      />
    );

  if (isLoading) return <LoadingIndicator />;

  if (gdprRequired)
    return (
      <RegisterConsent
        onConsentAction={handleConsentAction}
        content={gdprContent}
      />
    );

  return <RegisterTerms content={terms} onTermsAction={handleTermsAction} />;
};

RegisterAuto.navigationOptions = ({ navigation }) => ({
  header: null
});

export default RegisterAuto;
