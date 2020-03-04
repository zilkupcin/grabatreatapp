import { logError } from "../utils/loggingUtils";
import Parse from "parse/react-native";
import { OGADS_AFFILIATE_ID } from "react-native-dotenv";

export const buildOgadsEndpointCpi = (userId, countryCode) => {
  return `https://mobverify.com/api/v1/?affiliateid=${OGADS_AFFILIATE_ID}&device=android&ctype=1&aff_sub5=gatow&aff_sub4=${userId}&country=${countryCode}`;
};

export const buildOgadsEndpointOther = (userId, countryCode) => {
  return `https://mobverify.com/api/v1/?affiliateid=${OGADS_AFFILIATE_ID}&device=android&ctype=2&aff_sub5=gatow&aff_sub4=${userId}&country=${countryCode}`;
};

export const fetchOgadsCpi = async (sessionCountry, signal) => {
  try {
    const ogadsCpiResponse = await fetch(
      buildOgadsEndpointCpi(Parse.User.current().id, sessionCountry),
      {
        signal: signal
      }
    );
    const ogadsCpiOffers = await ogadsCpiResponse.json();
    return ogadsCpiOffers;
  } catch (e) {
    logError(e.message + " OgAds CPI");
    return [];
  }
};

export const fetchOgadsOther = async (sessionCountry, signal) => {
  try {
    const ogadsOtherOffersResponse = await fetch(
      buildOgadsEndpointOther(Parse.User.current().id, sessionCountry),
      { signal: signal }
    );
    const ogadsOtherOffers = await ogadsOtherOffersResponse.json();
    return ogadsOtherOffers;
  } catch (e) {
    logError(e.message + " OgAds Offers");
    return [];
  }
};
