import React, { useState } from "react";
import * as Font from "expo-font";
import LoadingIndicator from "../loading-indicator/LoadingIndicator";

const FontLoader = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  React.useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        roboto_light: require("../../assets/fonts/Roboto-Light.ttf"),
        roboto_medium: require("../../assets/fonts/Roboto-Medium.ttf")
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <LoadingIndicator />;
  }

  return children;
};

export default FontLoader;
