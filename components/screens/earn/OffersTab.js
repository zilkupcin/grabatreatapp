import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import OfferItem from "./OfferItem";
import GuideItem from "./GuideItem";
import PageError from "../../errors/PageError";
import { filterOffersByType } from "../../../utils/offerUtils";
import { errorMessages, offerTypes } from "../../../constants";
import OfferSupportHeader from "./OfferSupportHeader";

const OffersTab = ({
  offers,
  guideTier,
  points,
  type,
  onOfferPress,
  onSupportOfferPress
}) => {
  const getListHeader = () => {
    return type === offerTypes.OFFER_SUPPORT ? (
      <OfferSupportHeader />
    ) : (
      <GuideItem tier={guideTier} points={points} />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listContainer}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
        data={filterOffersByType(offers, type)}
        ListEmptyComponent={
          <PageError message={errorMessages.ERROR_NO_OFFERS} />
        }
        renderItem={({ item }) => (
          <OfferItem
            offer={item}
            key={item.title}
            onOfferPress={onOfferPress}
            onSupportOfferPress={onSupportOfferPress}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={getListHeader()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listContainer: {
    padding: 16,
    flex: 1
  },
  listContentContainer: {
    paddingBottom: 16
  }
});

export default OffersTab;
