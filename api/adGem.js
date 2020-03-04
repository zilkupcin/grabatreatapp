import UserAgent from "react-native-user-agent";
import RNAdvertisingId from "react-native-advertising-id";
import { logError } from "../utils/loggingUtils";
import { ADGEM_TOKEN, ADGEM_APP_ID } from "react-native-dotenv";

export const buildAdGemEndpointCpi = countryCode => {
  return `https://api.adgem.com/v1/all/campaigns?&appid=${ADGEM_APP_ID}&country_codes=${countryCode}&categories=app&token=${ADGEM_TOKEN}&platform=android`;
};

const getAdvertisingId = async () => {
  try {
    const response = await RNAdvertisingId.getAdvertisingId();
    return response.advertisingId;
  } catch (error) {
    return undefined;
  }
};

export const fetchAdGemOffers = async (appSettings, sessionCountry, signal) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("User-Agent", UserAgent.getWebViewUserAgent());

    let shouldIncludeAdgate = appSettings.get("adGateCpi");

    const advertisingId = await getAdvertisingId();
    if (!advertisingId) {
      shouldIncludeAdgate = false;
    }

    let adGemCpiOffers = [];
    if (shouldIncludeAdgate) {
      const adGemCpiResponse = await fetch(
        buildAdGemEndpointCpi(sessionCountry),
        {
          signal: signal,
          headers: myHeaders
        }
      );

      adGemCpiOffers = await adGemCpiResponse.json();
      adGemCpiOffers = adGemCpiOffers.data;
      return adGemCpiOffers;
    } else {
      return [];
    }
  } catch (e) {
    logError(e.message + " AdGem");
    return [];
  }
};
