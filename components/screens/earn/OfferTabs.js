import React, { useRef, useState } from "react";
import { StyleSheet, ViewPagerAndroid, View } from "react-native";
import OffersTab from "./OffersTab";
import TabView from "./TabView";
import { offerTabs } from "../../../data/offerTabs";
import { extraOfferTabs } from "../../../constants";

const OfferTabs = ({
  offers,
  onOfferPress,
  onSupportOfferPress,
  userPoints,
  userCountry,
  guideTier,
  appSettings
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const viewPager = useRef(null);

  // If CPI is turned off, remove the Apps tab from the tab list
  if (!appSettings.get("installsOn")) {
    if (offerTabs[0].title === "Apps") {
      offerTabs.splice(0, 1);
    }
  }

  //Change tab order if required
  if (
    appSettings.get("separateQuizes") &&
    appSettings.get("quizCountries").includes(userCountry)
  ) {
    let tabOrder = appSettings.get("offerTabOrder")[userCountry];
    let quizTabIndex = tabOrder ? tabOrder.QUIZES : 1;

    if (offerTabs[quizTabIndex].title !== "Quizzes") {
      offerTabs.splice(quizTabIndex, 0, extraOfferTabs.QUIZES);
    }
  }

  const handleSelectTab = index => {
    setSelectedTab(index);
    viewPager.current.setPage(index);
  };

  const handlePageSelected = event => {
    setSelectedTab(event.nativeEvent.position);
  };

  return (
    <View style={styles.container}>
      <TabView
        tabs={offerTabs}
        selectedTab={selectedTab}
        onSelectTab={handleSelectTab}
      />
      <ViewPagerAndroid
        style={styles.viewPager}
        initialPage={0}
        onPageSelected={handlePageSelected}
        ref={viewPager}
      >
        {offerTabs.map((tab, index) => {
          return (
            <OffersTab
              offers={offers}
              key={index}
              type={tab.type}
              guideTier={guideTier}
              points={userPoints}
              onOfferPress={onOfferPress}
              onSupportOfferPress={onSupportOfferPress}
            />
          );
        })}
      </ViewPagerAndroid>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  viewPager: {
    flex: 1
  }
});

export default OfferTabs;
