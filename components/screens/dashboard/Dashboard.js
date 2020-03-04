import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, ViewPagerAndroid } from "react-native";
import Snackbar from "react-native-snackbar";
import BottomNavBar from "./bottom-nav-bar/BottomNavBar";
import Home from "./pages/home/Home";
import Support from "./pages/support/Support";
import PageActionBar from "../../action-bars/PageActionBar";
import PrivacySettings from "./pages/privacy/PrivacySettings";
import Terms from "./pages/terms/Terms";
import MyTreats from "./pages/mytreats/MyTreats";
import ActionDialog from "../../dialogs/ActionDialog";
import LoadingIndicator from "../../loading-indicator/LoadingIndicator";
import Parse from "parse/react-native";
import { checkIfEuropean, getPricingMargin } from "../../../utils/userUtils";
import { parseCategories, parseTreats } from "../../../utils/objectUtils";
import { dialogActions, strings } from "../../../constants";
import { features } from "../../../constants";
import { Linking } from "expo";
import VersionNumber from "react-native-version-number";
import CriticalError from "../../errors/CriticalError";
import {
  addNetworkChangeListener,
  removeNetworkChangeListener
} from "../../../utils/networkUtils";
import FontLoader from "../../font-loader/FontLoader";
import {
  setShouldUiRefresh,
  shouldUiRefresh,
  getIgnoreGdprVersion,
  setIgnoreGdprVersion
} from "../../../utils/storageUtils";
import GdprDialog from "../../dialogs/GdprDialog";
import {
  buildParseError,
  buildAppVersionError,
  buildGeneralAlert
} from "../../../utils/dialogUtils";

const Dashboard = ({ navigation }) => {
  //Page state
  const [selectedTab, setSelectedTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogMessage, setDialogMessage] = useState(null);
  const [appVersionError, setAppVersionError] = useState(null);
  const [refreshAvailable, setRefreshAvailable] = useState(true);
  const [criticalError, setCriticalError] = useState("");
  const [isConnected, setIsConnected] = useState(true);

  //Data state
  const [categories, setCategories] = useState([]);
  const [terms, setTerms] = useState("");
  const [treats, setTreats] = useState([]);
  const [appSettings, setAppSettings] = useState({});

  //Gdpr state
  const [gdprContent, setGdprContent] = useState();
  const [gdprSettingEnabled, setGdprSettingEnabled] = useState(true);
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentRequired, setConsentRequired] = useState(false);
  const [gdprVersion, setGdprVersion] = useState("");
  const [showGdprDialog, setShowGdprDialog] = useState(false);

  //User state
  const [user, setUser] = useState({});

  const viewPager = useRef(null);

  useEffect(() => {
    const willFocusSubscription = navigation.addListener(
      "willFocus",
      handleWillFocus
    );
    addNetworkChangeListener(handleConnectivityChange);
    if (isConnected) {
      fetchData();
    }
    return function() {
      willFocusSubscription.remove();
      removeNetworkChangeListener(handleConnectivityChange);
    };
  }, []);

  const fetchData = async () => {
    try {
      const requests = [
        Parse.Cloud.run("fetchUser"),
        Parse.Cloud.run("fetchAppSettingsV2"),
        Parse.Cloud.run("fetchCategories"),
        fetchTerms(),
        Parse.Cloud.run("fetchUserOrders")
      ];

      const [user, settings, categories, terms, treats] = await Promise.all(
        requests
      );

      showNoticeIfNeeded(settings);

      //Check if the user is using the latest version of the app
      const hasLatestVersion = checkIfLatestVersion(settings);
      if (!hasLatestVersion) {
        const updateMessage = settings.get("updateMessage");
        setAppVersionError(buildAppVersionError(updateMessage));
      }

      // Set state
      setTreats(parseTreats(treats));
      setTerms(terms);
      setCategories(
        parseCategories(categories, getPricingMargin(user.get("regCountry")))
      );
      setUser(user);
      setGdprVersion(settings.get("gdprVersion"));
      setAppSettings(settings);

      setUpGdpr(settings, user);
    } catch (e) {
      if (e.code === 209) {
        navigation.navigate("Auth");
      } else {
        setCriticalError("Something went wrong...  \n" + e.message);
      }
    }
  };

  const handleWillFocus = async () => {
    const shouldRefresh = await shouldUiRefresh();
    if (shouldRefresh) {
      handleRefresh(true);
      await setShouldUiRefresh(false);
    }
  };

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      setIsConnected(isConnected);
    } else {
      setIsConnected(isConnected);
      setCriticalError(
        "Failed to connect. Please check if you're connected to the internet."
      );
    }
  };

  const showNoticeIfNeeded = settings => {
    const showNotice = settings.get("showNotice");
    if (showNotice) {
      const noticeMessage = settings.get("noticeMessage");
      setDialogMessage(
        buildGeneralAlert(
          "Hey!",
          noticeMessage,
          dialogActions.DIALOG_ACTION_DO_NOTHING
        )
      );
    }
  };

  const fetchTerms = async () => {
    const terms = await Parse.Cloud.run("fetchTerms");
    const data = await fetch(terms.get("document")._url);
    const text = await data.text();
    return text;
  };

  const showSnackbar = isAvailable => {
    Snackbar.show({
      title: isAvailable
        ? "Everything's up to date!"
        : "You can only refresh once in every 10 seconds!",
      duration: Snackbar.LENGTH_SHORT
    });
  };

  const refresh = async () => {
    try {
      const user = await Parse.Cloud.run("fetchUser");
      const treats = await Parse.Cloud.run("fetchUserOrders");
      setUser(user);
      setTreats(parseTreats(treats));
    } catch (error) {
      setCriticalError("Failed to refresh \n" + error.message);
    }
  };

  const setUpGdpr = (settings, user) => {
    const currentGdprVersion = settings.get("gdprVersion");
    if (checkIfEuropean(user.get("regCountry"))) {
      setConsentRequired(true);
      fetchUserConsent(currentGdprVersion, user);
    } else {
      updateUserActivity();
      setIsLoading(false);
      checkProfileCompletion(user);
    }
  };

  const checkProfileCompletion = (user, consentRequired, consentGiven) => {
    if (!consentRequired || (consentRequired && consentGiven)) {
      if (user.get("points") > 0 && user.get("profileCompleted") === false) {
        setDialogMessage(
          buildGeneralAlert(
            "Hi!",
            strings.PROFILE_INCOMPLETE_MESSAGE,
            dialogActions.DIALOG_ACTION_COMPLETE_PROFILE
          )
        );
      }
    }
  };

  const fetchUserConsent = async (currentGdprVersion, user) => {
    try {
      const consent = await Parse.Cloud.run("getUserGeneralConsent");
      if (consent !== null && consent !== undefined) {
        // User gave consent for some version of the form
        const withdrawalDate = consent.get("withdrawalDate");
        const formVersion = consent.get("formVersion");
        if (withdrawalDate === undefined) {
          if (formVersion === currentGdprVersion) {
            // User gave consent for current version of the consent form
            // New Gdpr form dialog not needed
            setConsentGiven(true);
            await fetchLatestGdprForm(user, true, false, currentGdprVersion);
          } else {
            // User gave consent for a different version of the consent form
            // New Gdpr form dialog needed
            setConsentGiven(false);
            await fetchLatestGdprForm(user, false, true, currentGdprVersion);
          }
        } else {
          // User withdrew consent
          // New Gdpr form dialog not needed
          setConsentGiven(false);
          await fetchLatestGdprForm(user, false, false, currentGdprVersion);
        }
      } else {
        // User didn't give consent for any version of the consent form
        // New Gdpr form dialog not needed
        setConsentGiven(false);
        fetchLatestGdprForm(user, false, false, currentGdprVersion);
      }
    } catch (error) {
      setCriticalError("Failed to fetch GDPR info \n" + error.message);
    }
  };

  const fetchLatestGdprForm = async (
    user,
    consentGiven,
    shouldShowGdprDialog,
    currentGdprVersion
  ) => {
    const gdpr = await Parse.Cloud.run("getLatestGdpr");
    const data = await fetch(gdpr._url);
    const text = await data.text();

    setGdprContent(text);
    updateUserActivity();

    if (shouldShowGdprDialog) {
      displayGdprDialogIfNeeded(currentGdprVersion);
    } else {
      setIsLoading(false);
      checkProfileCompletion(user, true, consentGiven);
    }
  };

  const updateUserActivity = () => {
    Parse.Cloud.run("updateUserActivity");
  };

  const displayGdprDialogIfNeeded = async currentGdprVersion => {
    const ignoreGdprVersion = await getIgnoreGdprVersion();

    if (ignoreGdprVersion === currentGdprVersion) {
      setConsentGiven(false);
      setIsLoading(false);
    } else {
      setShowGdprDialog(true);
    }
  };

  const checkIfLatestVersion = settings => {
    const appVersion = VersionNumber.appVersion;
    const appLatestVersion = settings.get("appLatestVersion");
    const justReleased = settings.get("justReleased");
    if (appVersion !== appLatestVersion && !justReleased) {
      return false;
    } else {
      return true;
    }
  };

  const handleTabChange = id => {
    viewPager.current.setPage(id);
    setSelectedTab(id);
  };

  const handlePageSelect = event => {
    setSelectedTab(event.nativeEvent.position);
  };

  const handleCategoryPress = handle => {
    navigation.navigate("Products", {
      handle,
      user,
      shippingDelay: appSettings.get("shippingDelay"),
      consentGiven,
      consentRequired
    });
  };

  const handleEarnMorePress = () => {
    navigation.navigate("Earn", { consentRequired, consentGiven, appSettings });
  };

  const handleFavouritesPress = () => {
    navigation.navigate("Favourites", { user });
  };

  const handleRefresh = () => {
    if (refreshAvailable) {
      showSnackbar(true);
      setRefreshAvailable(false);
      refresh();
      setTimeout(() => {
        setRefreshAvailable(true);
      }, 10000);
    } else {
      showSnackbar(false);
    }
  };

  const handleDialogAction = action => {
    if (action === dialogActions.DIALOG_ACTION_LINK_TO_STORE) {
      Linking.openURL(
        "https://play.google.com/store/apps/details?id=com.gudekoi.grabatreat"
      );
    } else if (action === dialogActions.DIALOG_ACTION_COMPLETE_PROFILE) {
      navigation.navigate("CompleteProfile");
    }
    setDialogMessage(null);
  };

  const handlePrivacySettingChange = agree => {
    if (gdprSettingEnabled && agree !== consentGiven) {
      setGdprSettingEnabled(false);
      Parse.Cloud.run("updateConsent", {
        consentType: "General Consent",
        formVersion: appSettings.get("gdprVersion")
      }).then(
        function(response) {
          setConsentGiven(agree);
          setGdprSettingEnabled(true);
        },
        function(error) {
          setDialogMessage(buildParseError(error.message));
          setGdprSettingEnabled(true);
        }
      );
    }
  };

  const handleFeaturePress = feature => {
    switch (feature) {
      case features.FEATURE_INVITE:
        navigation.navigate("Invite", {
          invitationCode: user.get("invCode")
        });
        break;
      case features.FEATURE_RATE_US:
        Linking.openURL(
          "https://play.google.com/store/apps/details?id=com.gudekoi.grabatreat"
        );
        break;
      case features.FEATURE_TUTORIAL:
        navigation.navigate("Tutorial");
      default:
        break;
    }
  };

  const handleRetryPress = () => {
    setCriticalError("");
    setIsLoading(true);
    fetchData();
  };

  const handleConsent = hasAgreed => {
    if (hasAgreed) {
      addConsent();
      setShowGdprDialog(false);
    } else {
      setConsentGiven(false);
      setShowGdprDialog(false);
      setIsLoading(false);
      setIgnoreGdprVersion(gdprVersion);
    }
  };

  const addConsent = async () => {
    try {
      await Parse.Cloud.run("addGeneralGdprConsent");
      setConsentGiven(true);
      setIsLoading(false);
    } catch (e) {}
  };

  if (criticalError)
    return (
      <CriticalError onRetryPress={handleRetryPress} message={criticalError} />
    );

  if (appVersionError)
    return (
      <FontLoader>
        <ActionDialog
          isVisible={true}
          onActionPress={handleDialogAction}
          title={appVersionError.title}
          message={appVersionError.message}
          positiveAction={appVersionError.positiveAction}
          negativeAction={appVersionError.negativeAction}
        />
      </FontLoader>
    );

  if (showGdprDialog)
    return <GdprDialog content={gdprContent} onConsent={handleConsent} />;

  if (isLoading) return <LoadingIndicator />;

  return (
    <FontLoader>
      <View style={styles.container}>
        <ViewPagerAndroid
          style={styles.viewPager}
          initialPage={0}
          onPageSelected={handlePageSelect}
          ref={viewPager}
        >
          <Home
            navigation={navigation}
            categories={categories}
            onCategoryPress={handleCategoryPress}
            onFavouritesPress={handleFavouritesPress}
            onEarnMorePress={handleEarnMorePress}
            onFeaturePress={handleFeaturePress}
            user={user}
            onRefresh={handleRefresh}
            key={0}
          />
          <View key={1}>
            <PageActionBar title="My Treats" />
            <MyTreats treats={treats} />
          </View>
          <View key={2}>
            <PageActionBar title="Support" />
            <Support onTutorialPress={handleFeaturePress} />
          </View>
          {consentRequired && (
            <View key={3}>
              <PageActionBar title="Privacy Settings" />
              <PrivacySettings
                content={gdprContent}
                hasAgreed={consentGiven}
                onSettingChange={handlePrivacySettingChange}
              />
            </View>
          )}
          <View key={4}>
            <PageActionBar title="Terms of Service" />
            <Terms content={terms} />
          </View>
        </ViewPagerAndroid>
        <BottomNavBar
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
          consentRequired={consentRequired}
        />
      </View>
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
    </FontLoader>
  );
};

Dashboard.navigationOptions = ({ navigation }) => ({
  header: null
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  viewPager: {
    flex: 24
  }
});

export default Dashboard;
