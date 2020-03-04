import { AsyncStorage } from "react-native";
import { offerTypes } from "../constants";

export const setShouldUiRefresh = async shouldRefresh => {
  await AsyncStorage.setItem("shouldUiRefresh", JSON.stringify(shouldRefresh));
};

export const shouldUiRefresh = async () => {
  let shouldRefresh = await AsyncStorage.getItem("shouldUiRefresh");
  return JSON.parse(shouldRefresh);
};

export const shouldRemoveOffer = async () => {
  let shouldRemoveOffer = await AsyncStorage.getItem("shouldRemoveOffer");
  return JSON.parse(shouldRemoveOffer);
};

export const setShouldRemoveOffer = async offer => {
  await AsyncStorage.setItem("shouldRemoveOffer", JSON.stringify(offer));
};

export const getIgnoreGdprVersion = async () => {
  const ignoreGdprVersion = await AsyncStorage.getItem("ignoreGdprVersion");
  return JSON.parse(ignoreGdprVersion);
};

export const setIgnoreGdprVersion = async version => {
  await AsyncStorage.setItem("ignoreGdprVersion", JSON.stringify(version));
};

export const getLastUserPoints = async () => {
  let points = await AsyncStorage.getItem("lastPoints");
  points = JSON.parse(points);
  if (points) {
    return points;
  } else {
    return 0;
  }
};

export const setLastUserPoints = async points => {
  await AsyncStorage.setItem("lastPoints", JSON.stringify(points));
};

export const clearParseCache = async () => {
  const allKeys = await AsyncStorage.getAllKeys();
  const filteredKeys = allKeys.filter(key => {
    return key.includes("Parse");
  });
  filteredKeys.forEach(async key => {
    await AsyncStorage.removeItem(key);
  });
};

export const logOfferForSupport = async offer => {
  let loggedOffers = await AsyncStorage.getItem("loggedOffers");
  if (loggedOffers) {
    loggedOffers = JSON.parse(loggedOffers);
  } else {
    loggedOffers = [];
  }

  let foundOffer = loggedOffers.find(loggedOffer => {
    return loggedOffer.id === offer.id;
  });

  if (!foundOffer) {
    let clickedOffer = { ...offer };
    clickedOffer.clickedDate = new Date();
    clickedOffer.type = offerTypes.OFFER_SUPPORT;
    clickedOffer.supportContacted = false;
    loggedOffers.push(clickedOffer);
    await AsyncStorage.setItem("loggedOffers", JSON.stringify(loggedOffers));
  }
};

const updateLoggedSupportOffer = async offer => {
  let loggedOffers = await AsyncStorage.getItem("loggedOffers");
  loggedOffers = JSON.parse(loggedOffers);
  let foundOffer = loggedOffers.find(loggedOffer => {
    return loggedOffer.id === offer.id;
  });
  foundOffer.supportContacted = true;
  await AsyncStorage.setItem("loggedOffers", JSON.stringify(loggedOffers));
};
