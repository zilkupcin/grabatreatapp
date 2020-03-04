import React from "react";
import Parse from "parse/react-native";
import LoadingIndicator from "../loading-indicator/LoadingIndicator";
import { apiEndpoints } from "../../constants";

const AuthLoader = ({ navigation }) => {
  Parse.User.currentAsync().then(user => {
    if (user) {
      navigation.navigate("App");
    } else {
      fetchAppConfig();
    }
  });

  const fetchLocationData = async (registrationFlow, countriesToTrack) => {
    try {
      const response = await fetch(apiEndpoints.IPGEOLOCATION);
      const data = await response.json();
      navigation.navigate("Welcome", {
        registrationFlow: registrationFlow,
        ipAddress: data.ip,
        countryCode: data.country_code2,
        countriesToTrack
      });
    } catch (e) {
      navigation.navigate("Welcome", {
        registrationFlow: registrationFlow,
        ipAddress: "",
        countryCode: "",
        countriesToTrack: [""]
      });
    }
  };

  const fetchAppConfig = async () => {
    try {
      const config = await Parse.Config.get();
      const registrationFlow = config.get("registrationFlow");
      const countriesToTrack = config.get("countriesToTrack");
      fetchLocationData(registrationFlow, countriesToTrack);
    } catch (e) {
      fetchLocationData("manual");
    }
  };

  return <LoadingIndicator />;
};

export default AuthLoader;
