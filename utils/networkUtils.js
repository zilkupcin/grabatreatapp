import { NetInfo } from "react-native";

export const addNetworkChangeListener = handleConnectivityChange => {
  NetInfo.isConnected.addEventListener(
    "connectionChange",
    handleConnectivityChange
  );
};

export const removeNetworkChangeListener = handleConnectivityChange => {
  NetInfo.isConnected.removeEventListener(
    "connectionChange",
    handleConnectivityChange
  );
};
