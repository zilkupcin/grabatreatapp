import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { offerTypes } from "../../../constants";
import { TouchableOpacity } from "react-native-gesture-handler";

const medalIcon = require("../../../images/medal.png");

const OfferItem = ({ offer, onOfferPress, onSupportOfferPress }) => {
  const OfferRewardTag = () => {
    return (
      <View style={styles.rewardTagContainer}>
        <Text style={styles.rewardTagText}>{getRewardTagText()}</Text>
      </View>
    );
  };

  const OfferInfo = () => {
    return (
      <View style={styles.offerInfoContainer}>
        <Text style={styles.offerTitle}>{offer.title}</Text>
        <Text style={styles.offerDescription}>{offer.description}</Text>
      </View>
    );
  };

  const OfferSupportInfo = () => {
    return (
      <View style={styles.offerInfoContainer}>
        <Text style={styles.offerTitle}>{offer.title}</Text>
        <Text style={styles.offerDescription}>
          {getSupportOfferDescription()}
        </Text>
      </View>
    );
  };

  const getRewardTagText = () => {
    if (offer.type === offerTypes.OFFER_SUPPORT) {
      return offer.supportContacted
        ? "Ticket submitted"
        : getSupportAvailableTime() < 24
        ? "Please wait"
        : "Submit ticket!";
    } else {
      return offer.reward === 0 ? "Tap and see!" : `${offer.reward} Points`;
    }
  };

  const getSupportAvailableTime = () => {
    const dateNow = new Date();
    const offerClickedDate = new Date(offer.clickedDate);
    return Math.floor((dateNow - offerClickedDate) / 3600000);
  };

  const getSupportOfferDescription = () => {
    const hoursPassed = getSupportAvailableTime();
    if (hoursPassed > 24) {
      return "Status: started";
    } else {
      return `Status: started. support for this offer will be available in ${24 -
        hoursPassed} hours`;
    }
  };

  const handleOfferPress = () => {
    if (offer.type !== offerTypes.OFFER_COMPLETED) {
      onOfferPress(offer);
    }
  };

  const handleSupportOfferPress = () => {
    if (offer.supportContacted) {
      onSupportOfferPress(offer, false);
    } else if (getSupportAvailableTime() < 24) {
      onSupportOfferPress(offer, false);
    } else {
      onSupportOfferPress(offer, true);
    }
  };

  const TopOfferHeader = () => {
    if (offer.title.includes("Hulu")) {
      return (
        <View style={styles.topOfferHeaderContainer}>
          <Image style={styles.topOfferImage} source={medalIcon} />
          <Text style={styles.topOfferText}>Our top offer!</Text>
        </View>
      );
    } else {
      return null;
    }
  };

  const getImageSrc = () => {
    return offer.type === offerTypes.OFFER_COMPLETED ||
      offer.type === offerTypes.OFFER_VIDEO ||
      offer.type === offerTypes.OFFER_TASK
      ? offer.imageSrc
      : { uri: offer.imageSrc };
  };

  return (
    <TouchableOpacity
      onPress={
        offer.type === offerTypes.OFFER_SUPPORT
          ? handleSupportOfferPress
          : handleOfferPress
      }
      style={styles.container}
      activeOpacity={0.5}
    >
      <TopOfferHeader />
      <View style={styles.offerInnerContainer}>
        <Image style={styles.offerImage} source={getImageSrc()} />
        {offer.type === offerTypes.OFFER_SUPPORT ? (
          <OfferSupportInfo />
        ) : (
          <OfferInfo />
        )}
        <OfferRewardTag reward={offer.reward} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: "#C4C4C4",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    width: "100%",
    flexDirection: "column",
    alignItems: "center"
  },
  offerInnerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 16
  },
  rewardTagContainer: {
    backgroundColor: "#FFD4D4",
    padding: 8,
    borderRadius: 10
  },
  rewardTagText: {
    color: "#FF7F7F",
    fontFamily: "roboto_medium",
    fontSize: 12
  },
  offerImage: {
    width: 46,
    height: 46,
    borderRadius: 10
  },
  offerInfoContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 8,
    marginRight: 8
  },
  offerTitle: {
    color: "#333"
  },
  offerDescription: {
    fontSize: 12,
    color: "#909090"
  },
  topOfferImage: {
    height: 24,
    width: 24,
    marginRight: 8
  },
  topOfferText: {
    fontSize: 16
  },
  topOfferHeaderContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#C4C4C4",
    borderBottomWidth: 1,
    padding: 8
  }
});

export default React.memo(OfferItem);
