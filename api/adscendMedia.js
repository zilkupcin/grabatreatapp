import UserAgent from "react-native-user-agent";
import { logError } from "../utils/loggingUtils";
import Parse from "parse/react-native";
import { ADSCEND_PUBLISHER_ID, ADSCEND_PROFILE_ID } from "react-native-dotenv";

export const buildAdscendEndpoint = (userId, ipAddress) => {
  return `https://adscendmedia.com/adwall/api/publisher/${ADSCEND_PUBLISHER_ID}/profile/${ADSCEND_PROFILE_ID}/offers.json?subid1=${userId}&ip=${ipAddress}`;
};

export const fetchAdscendOffers = async (sessionIp, signal) => {
  const myHeaders = new Headers();
  myHeaders.append("User-Agent", UserAgent.getWebViewUserAgent());

  try {
    const adscendOffersResponse = await fetch(
      buildAdscendEndpoint(Parse.User.current().id, sessionIp),
      {
        signal: signal,
        headers: myHeaders
      }
    );

    const adscendOffers = await adscendOffersResponse.json();
    return adscendOffers;
  } catch (e) {
    logError(e.message + " Adscend");
    return [];
  }
};
