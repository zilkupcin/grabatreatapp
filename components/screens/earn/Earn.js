import React, { useState, useEffect } from "react";
import { View, StyleSheet, AsyncStorage, AppState } from "react-native";
import StatusActionBar from "../../action-bars/StatusActionBar";
import LoadingIndicator from "../../loading-indicator/LoadingIndicator";
import ActionDialog from "../../dialogs/ActionDialog";
import TheoremReach from "react-native-theorem-reach";
import { actionIcons } from "../../../constants";
import { Linking } from "expo";
import { checkIfEuropean } from "../../../utils/userUtils";
import OfferSupportDialog from "../../dialogs/OfferSupportDialog";
import { additionalOffers } from "../../../data/additionalOffers";
import "abortcontroller-polyfill";
import Parse from "parse/react-native";
import CriticalError from "../../errors/CriticalError";
import OfferTabs from "./OfferTabs";
import Snackbar from "react-native-snackbar";
import Pollfish from "react-native-pollfish";
import RNAdColony from "react-native-ad-colony";
import RNAdvertisingId from "react-native-advertising-id";
import { logError } from "../../../utils/loggingUtils";
import { fetchOgadsCpi, fetchOgadsOther } from "../../../api/ogAds";
import { fetchAdscendOffers } from "../../../api/adscendMedia";
import { fetchAdGemOffers } from "../../../api/adGem";
import {
  parseOgadsOffers,
  parseAdscendOffers,
  parseCompletedOffers,
  applyOfferTiers,
  parseAdGemOffers,
  sortByConversionDescending,
  markCompletedOffers,
  pushBestOfferToTop
} from "../../../utils/offerUtils";

import {
  offerTypes,
  errorMessages,
  dialogActions,
  strings,
  apiEndpoints
} from "../../../constants";
import {
  buildGeneralError,
  buildGeneralAlert
} from "../../../utils/dialogUtils";
import {
  shouldUiRefresh,
  setShouldUiRefresh,
  setLastUserPoints,
  getLastUserPoints,
  setShouldRemoveOffer,
  shouldRemoveOffer,
  logOfferForSupport,
  updateLoggedSupportOffer
} from "../../../utils/storageUtils";

const Earn = React.memo(({ navigation }) => {
  //Page state
  const [isLoading, setIsLoading] = useState(true);
  const [dialogMessage, setDialogMessage] = useState(null);
  const [criticalError, setCriticalError] = useState("");
  const [refreshAvailable, setRefreshAvailable] = useState(true);

  //Data state
  const [offers, setOffers] = useState([]);
  const [pressedOffer, setPressedOffer] = useState({});
  const [guideTiers, setGuideTiers] = useState([]);
  const [supportOffer, setSupportOffer] = useState(null);

  //User state
  const [user, setUser] = useState(null);

  const consentRequired = navigation.getParam("consentRequired");
  const consentGiven = navigation.getParam("consentGiven");
  const appSettings = navigation.getParam("appSettings");

  const AbortController = window.AbortController;
  const abortController = new AbortController();
  const signal = abortController.signal;

  useEffect(() => {
    const willFocusSubscription = navigation.addListener(
      "willFocus",
      handleWillFocus
    );
    AppState.addEventListener("change", handleAppStateChange);
    fetchUser();

    return function cleanup() {
      AppState.removeEventListener("change", handleAppStateChange);
      willFocusSubscription.remove();
      abortController.abort();
    };
  }, []);

  const handleWillFocus = async () => {
    const shouldRefresh = await shouldUiRefresh();
    const offerToRemove = await shouldRemoveOffer();

    if (offerToRemove) {
      setIsLoading(true);
      setShouldRemoveOffer(false);
      fetchUser();
    } else if (shouldRefresh) {
      handleRefresh(true);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAppStateChange = async nextState => {
    if (nextState === "active") {
      handleRefresh(true);
    }
  };

  const fetchLocationData = async user => {
    try {
      const response = await fetch(apiEndpoints.IPGEOLOCATION, {
        signal: signal
      });
      const data = await response.json();
      const sessionCountry = data.country_code2;
      const sessionIp = data.ip;
      updateSessionDetails(user, sessionCountry, sessionIp);

      fetchOfferStats(user, sessionCountry, sessionIp);
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
      setCriticalError("Error:\n" + error);
      logError(error.message + "  IPGeolocation");
    }
  };

  const fetchOfferStats = async (user, sessionCountry, sessionIp) => {
    try {
      if (appSettings.get("sortOffersByConversion")) {
        const offerStats = await Parse.Cloud.run("fetchOfferStats");
        fetchOffers(user, sessionCountry, sessionIp, offerStats);
      } else {
        fetchOffers(user, sessionCountry, sessionIp, []);
      }
    } catch (error) {
      setCriticalError("Error:\n" + error);
      logError(error.message + "  Offer Stats");
    }
  };

  const updateSessionDetails = async (user, sessionCountry, sessionIp) => {
    const userSessionIp = user.get("sessionIp");
    const userSessionCountry = user.get("sessionCountry");

    if (userSessionIp !== sessionIp || userSessionCountry !== sessionCountry) {
      await Parse.Cloud.run("addUserSessionDetails", {
        sessionCountry,
        sessionIp
      });
    }
  };

  const getAdvertisingId = async () => {
    try {
      const response = await RNAdvertisingId.getAdvertisingId();
      return response.advertisingId;
    } catch (error) {
      return undefined;
    }
  };

  const fetchOffers = async (user, sessionCountry, sessionIp, offerStats) => {
    try {
      const offerRequests = [
        fetchOgadsCpi(sessionCountry, signal),
        fetchOgadsOther(sessionCountry, signal),
        fetchAdscendOffers(sessionIp, signal),
        fetchAdGemOffers(appSettings, sessionCountry, signal)
      ];

      const [
        ogadsCpiOffers,
        ogadsOtherOffers,
        adscendOffers,
        adGemCpiOffers
      ] = await Promise.all(offerRequests);

      //Get logged offers from async storage
      let loggedOffers = await AsyncStorage.getItem("loggedOffers");
      if (loggedOffers) {
        loggedOffers = JSON.parse(loggedOffers);
      } else {
        loggedOffers = [];
      }

      prepareOffers(
        user,
        ogadsCpiOffers,
        ogadsOtherOffers,
        adGemCpiOffers,
        adscendOffers,
        loggedOffers,
        offerStats,
        appSettings
      );
    } catch (e) {
      logError(e);
      setCriticalError("Failed to fetch offers" + e);
    }
  };

  const prepareOffers = async (
    user,
    ogadsCpiOffers,
    ogadsOtherOffers,
    adGemCpiOffers,
    adscendOffers,
    loggedOffers,
    offerStats,
    appSettings
  ) => {
    let offers = [];
    const advertisingId = await getAdvertisingId();

    // Prepare and add Ogads CPI Offers to the full list of offers
    offers.push(
      ...parseOgadsOffers(ogadsCpiOffers, true, false, appSettings, offerStats)
    );

    // Prepare and add AdGem offers Offers to the full list of offers
    offers.push(
      ...parseAdGemOffers(
        adGemCpiOffers,
        Parse.User.current().id,
        advertisingId,
        offerStats,
        appSettings
      )
    );

    // Prepare and add Ogads other Offers to the full list of offers
    offers.push(
      ...parseOgadsOffers(
        ogadsOtherOffers,
        false,
        false,
        appSettings,
        offerStats
      )
    );

    // Prepare and add AdcendMedia Offers to the full list of offers
    offers.push(...parseAdscendOffers(adscendOffers, offerStats, appSettings));

    // Prepare and add Logged offers to the full list of offers
    offers.push(...loggedOffers);

    //Sorts all offers by conversion rate
    if (appSettings.get("removeLeastPerformingOffers")) {
      offers = offers.filter(offer => !offer.hidden);
    }
    if (appSettings.get("sortOffersByConversion")) {
      offers = offers.sort(sortByConversionDescending);
    }

    // fetchCompletedOffers(user, offers);
    modifyOffers(user, offers);
  };

  const modifyOffers = async (user, offers) => {
    //Fetch the rest of the data needed to modify offers
    const requests = [
      Parse.Cloud.run("fetchOfferTiers"),
      Parse.Cloud.run("fetchGuideTiers"),
      Parse.Cloud.run("getCompletedOffers")
    ];

    let [offerTiers, guideTiers, completedOffers] = await Promise.all(requests);

    // Mark offers that have been completed
    completedOffers = parseCompletedOffers(completedOffers);
    markCompletedOffers(offers, completedOffers);
    offers.push(...completedOffers);

    //Apply offer tiers for dynamic rewards
    applyOfferTiers(offers, offerTiers);

    //Set up additional offers, not included in the APIs
    setUpAdditionalOffers(user, offers);

    //Set state
    setOffers(offers);
    setGuideTiers(guideTiers);
    setIsLoading(false);
  };

  const showSnackbar = isAvailable => {
    Snackbar.show({
      title: isAvailable
        ? "Everything's up to date!"
        : "You can only refresh once in every 10 seconds!",
      duration: Snackbar.LENGTH_SHORT
    });
  };

  const setUpAdditionalOffers = (user, offers) => {
    if (appSettings.get("pollfishOn")) {
      offers.push(additionalOffers.OFFERWALL_POLLFISH);
      Pollfish.initialize(
        "e0e7c450-9391-4e6e-97fe-f1469a06f8f9",
        false,
        true,
        Parse.User.current().id
      );
    }
    if (!checkIfEuropean(user.get("regCountry"))) {
      if (appSettings.get("theOremOn")) {
        offers.push(additionalOffers.OFFERWALL_THEOREM);
        TheoremReach.initWithApiKeyAndUserId(
          "ad524e8146a5a58090377f1360bd",
          Parse.User.current().id
        );
      }
    }

    if (user.get("regCountry") === "US") {
      if (appSettings.get("adColonyOn")) {
        offers.push(additionalOffers.OFFERWALL_ADCOLONY);
        RNAdColony.initialize(
          "vz2cb2819242834156a1",
          "app85bb1825b35a4929bd",
          Parse.User.current().id
        );
      }
    }

    if (user.get("profileCompleted") === false) {
      offers.push(additionalOffers.TASK_COMPLETE_PROFILE);
    }

    if (user.get("referredBy") === "") {
      offers.push(additionalOffers.TASK_ENTER_CODE);
    }

    pushBestOfferToTop(offers, appSettings);
  };

  const fetchUser = async () => {
    try {
      const user = await Parse.Cloud.run("fetchUser");
      await setLastUserPoints(user.get("points"));
      setUser(user);

      //If consent is not needed or is given, continue fetching data, else, stop
      if (!consentRequired || (consentRequired && consentGiven)) {
        fetchLocationData(user);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      if (error.code === 209) {
        navigation.navigate("Auth");
      } else {
        setCriticalError("Failed to fetch user\n" + error.message);
      }
    }
  };

  const matchGuideTier = () => {
    return guideTiers.find(tier => user.get("points") < tier.get("goalPoints"));
  };

  const handleRefresh = async skipSnackbar => {
    const prevPoints = await getLastUserPoints();
    if (refreshAvailable) {
      setRefreshAvailable(false);
      !skipSnackbar && showSnackbar(true);
      setTimeout(() => {
        setRefreshAvailable(true);
      }, 10000);

      const fetchedUser = await Parse.Cloud.run("fetchUser");
      await setLastUserPoints(fetchedUser.get("points"));

      if (prevPoints !== fetchedUser.get("points")) {
        await setShouldUiRefresh(true);
      }

      setUser(fetchedUser);
    } else {
      !skipSnackbar && showSnackbar(false);
    }
  };

  const handleOfferPress = offer => {
    setPressedOffer(offer);

    if (offer.type === offerTypes.OFFER_OFFERWALL) {
      showNoticeIfNeeded(offer);
    } else if (offer.type === offerTypes.OFFER_TASK) {
      if (offer.title === additionalOffers.TASK_ENTER_CODE.title) {
        navigation.navigate("EnterCode", {
          invitationCode: user.get("invCode")
        });
      } else if (offer.title === additionalOffers.TASK_COMPLETE_PROFILE.title) {
        navigation.navigate("CompleteProfile", { requireOfferRemoval: true });
      }
    } else if (offer.type === offerTypes.OFFER_VIDEO) {
      showVideo();
    } else {
      handleOfferNavigation(offer);
    }
  };

  const handleOfferNavigation = offer => {
    if (offer.url) {
      showNoticeIfNeeded(offer);
      if (offer.network === "Adscend") {
        logOfferForSupport(offer);
      }
    }
  };

  const showVideo = () => {
    RNAdColony.showAdReward("vz2cb2819242834156a1");
  };

  const showTheoremReachOfferwall = async () => {
    TheoremReach.isSurveyAvailable(isAvailable => {
      if (isAvailable) {
        TheoremReach.showRewardCenter();
      }
    });
  };

  const showNoticeIfNeeded = async offer => {
    let noticeAccepted = true;
    let dialogAction;

    //If offer title includes any of matching keywords
    if (
      offer.title.toLowerCase().includes("win") ||
      offer.title.toLowerCase().includes("$") ||
      offer.title.toLowerCase().includes("£")
    ) {
      dialogAction = dialogActions.DIALOG_ACTION_OFFER_WARNING;
      noticeAccepted = await AsyncStorage.getItem("offerWarningAccepted");
      await AsyncStorage.setItem("offerWarningAccepted", JSON.stringify(true));
    }
    //If selected offer is a Theorem Reach Survey offerwall
    else if (offer.title === "Theorem Reach Surveys") {
      dialogAction = dialogActions.DIALOG_ACTION_ACCEPT_THEOREM_NOTICE;
      noticeAccepted = await AsyncStorage.getItem("theoremNoticeAccepted");
      await AsyncStorage.setItem("theoremNoticeAccepted", JSON.stringify(true));
    }
    //If selected offer is a pollfish survey offerwall
    else if (offer.title === "Pollfish Surveys") {
      dialogAction = dialogActions.DIALOG_ACTION_ACCEPT_POLLFISH_NOTICE;
      noticeAccepted = await AsyncStorage.getItem("pollfishNoticeAccepted");
      await AsyncStorage.setItem(
        "pollfishNoticeAccepted",
        JSON.stringify(true)
      );
    }

    noticeAccepted = JSON.parse(noticeAccepted);

    if (noticeAccepted) {
      if (offer.title === "Theorem Reach Surveys") {
        showTheoremReachOfferwall();
      } else if (offer.title === "Pollfish Surveys") {
        Pollfish.show();
      } else {
        Linking.openURL(offer.url);
      }
    } else {
      showNotice(dialogAction);
    }
  };

  const showNotice = dialogAction => {
    let message;
    if (dialogAction === dialogActions.DIALOG_ACTION_ACCEPT_THEOREM_NOTICE) {
      message = strings.NOTICE_THEOREM;
    } else if (
      dialogAction === dialogActions.DIALOG_ACTION_ACCEPT_POLLFISH_NOTICE
    ) {
      message = strings.NOTICE_POLLFISH;
    } else if (dialogAction === dialogActions.DIALOG_ACTION_OFFER_WARNING) {
      message = strings.NOTICE_OFFER;
    }
    setDialogMessage(
      buildGeneralAlert("One more thing...", message, dialogAction)
    );
  };

  const handleSupportOfferPress = (offer, supportAvailable) => {
    setPressedOffer(offer);
    if (supportAvailable) {
      setSupportOffer(offer);
    } else {
      if (offer.supportContacted) {
        setDialogMessage(
          buildGeneralError(errorMessages.ERROR_SUPPORT_CONTACTED)
        );
      } else {
        setDialogMessage(
          buildGeneralError(errorMessages.ERROR_SUPPORT_NOT_AVAILABLE_YET)
        );
      }
    }
  };

  const handleCancelSupportTicket = () => {
    setSupportOffer(null);
  };

  const handleSupportDialogActionPress = submittedOffer => {
    let offersCopy = [...offers];
    let updatedOffer = offersCopy.find(offer => {
      return (
        offer.type === offerTypes.OFFER_SUPPORT &&
        offer.id === submittedOffer.id
      );
    });
    if (updatedOffer) {
      updatedOffer.supportContacted = true;
      updateLoggedSupportOffer(updatedOffer);
      setOffers(offersCopy);
      setSupportOffer(null);
    } else {
      setSupportOffer(null);
    }
  };

  const handleDialogAction = async actionType => {
    setDialogMessage(null);

    if (actionType === dialogActions.DIALOG_ACTION_ACCEPT_THEOREM_NOTICE) {
      showTheoremReachOfferwall();
    } else if (
      actionType === dialogActions.DIALOG_ACTION_ACCEPT_POLLFISH_NOTICE
    ) {
      Pollfish.show();
    } else if (pressedOffer.type !== offerTypes.OFFER_SUPPORT) {
      Linking.openURL(pressedOffer.url);
    }
  };

  const handleRetryPress = () => {
    setCriticalError("");
    setIsLoading(true);
    fetchUser();
  };

  if (criticalError)
    return (
      <CriticalError onRetryPress={handleRetryPress} message={criticalError} />
    );

  if (isLoading) return <LoadingIndicator willTakeLong={true} />;

  return (
    <View style={styles.container}>
      <StatusActionBar
        onBackPress={handleBackPress}
        points={user && user.get("points")}
        rightIcon={actionIcons.ICON_REFRESH}
        onRightIconPress={handleRefresh}
        paddingLeft={16}
        paddingRight={16}
      />
      <OfferTabs
        offers={offers}
        onOfferPress={handleOfferPress}
        onSupportOfferPress={handleSupportOfferPress}
        userPoints={user.get("points")}
        userCountry={user.get("regCountry")}
        guideTier={matchGuideTier()}
        appSettings={appSettings}
      />
      {supportOffer && (
        <OfferSupportDialog
          offer={supportOffer}
          onSupportDialogActionPress={handleSupportDialogActionPress}
          onCancelTicket={handleCancelSupportTicket}
        />
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
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  viewPager: {
    flex: 1
  }
});

Earn.navigationOptions = ({ navigation }) => ({
  header: null
});

export default Earn;
