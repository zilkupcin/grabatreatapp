import { offerTypes } from "../constants";

export const parseOgadsOffers = (
  offers,
  isCpi,
  shouldFilterBlacklisted,
  appSettings,
  offerStats
) => {
  if (!offers.offers) {
    return [];
  }

  const separateQuizes = appSettings.get("separateQuizes");
  const minClicks = appSettings.get("minClicks");
  const minConversion = appSettings.get("minConversion");

  let parsedOffers = offers.offers.map(offer => {
    let offerType = isCpi ? offerTypes.OFFER_CPI : offerTypes.OFFER;
    const offerId = offer.offerid;
    let offerDescription = offer.adcopy;
    let conversionRate = 0.005;
    let offerHidden = false;

    offerDescription = offerDescription.replace(
      "to unlock this content",
      "to earn points"
    );

    if (separateQuizes) {
      if (
        offer.name_short.toLowerCase().includes("quiz") ||
        offer.name_short.toLowerCase().includes("twitch trivia")
      ) {
        offerType = offerTypes.OFFER_QUIZ;
      }
    }

    const matchingStats = offerStats.find(stats => {
      return stats.id === offerId && stats.network === "OgAds";
    });

    if (matchingStats) {
      conversionRate = matchingStats.conversionRate;
      const clicks = matchingStats.clicks;

      if (clicks >= minClicks && conversionRate < minConversion) {
        offerHidden = true;
      }

      // Offer is most likely new with good CR, place it near the top for now
      if (clicks === 1 && conversionRate === 100) {
        conversionRate = 15;
      }
    } else {
      conversionRate = 5;
    }

    return {
      title: offer.name_short,
      description: offerDescription,
      reward: offer.payout,
      imageSrc: offer.picture,
      network: "OgAds",
      id: offerId,
      type: offerType,
      conversionRate: conversionRate,
      url: offer.link,
      completed: false,
      hidden: offerHidden
    };
  });

  if (shouldFilterBlacklisted) {
    return filterBlacklisted(parsedOffers);
  } else {
    return parsedOffers;
  }
};

const filterBlacklisted = offers => {
  return offers.filter(offer => {
    const offerTitle = offer.title;
    return (
      !offerTitle.includes("Portal Quest") &&
      !offerTitle.includes("PopSlots") &&
      !offerTitle.includes("Castle Clash")
    );
  });
};

export const parseAdscendOffers = (offers, offerStats, appSettings) => {
  if (!offers.offers) {
    return [];
  }

  const separateQuizes = appSettings.get("separateQuizes");
  const minClicks = appSettings.get("minClicks");
  const minConversion = appSettings.get("minConversion");

  const parsedOffers = offers.offers.map(offer => {
    let conversionRate = offer.conversion_rate ? offer.conversion_rate : 0.005;
    let offerHidden = false;
    const offerId = offer.offer_id;

    const matchingStats = offerStats.find(stats => {
      return stats.id === offerId && stats.network === "Adscend";
    });

    if (matchingStats) {
      conversionRate = matchingStats.conversionRate;
      const clicks = matchingStats.clicks;

      if (clicks >= minClicks && conversionRate < minConversion) {
        offerHidden = true;
      }

      // Offer is most likely new with good CR, place it near the top for now
      if (clicks === 1 && conversionRate === 100) {
        conversionRate = 15;
      }
    } else {
      conversionRate = 5.0;
    }

    return {
      title: offer.name,
      description: offer.description,
      reward: offer.payout,
      imageSrc: offer.creative_url,
      network: "Adscend",
      id: offer.offer_id,
      type: getAdscendOfferType(offer, separateQuizes),
      conversionRate: conversionRate,
      url: offer.click_url,
      completed: false,
      hidden: offerHidden
    };
  });
  return parsedOffers.filter(offer => offer.type !== offerTypes.OFFER_INVALID);
};

export const parseAdGemOffers = (
  offers,
  userId,
  advertisingId,
  offerStats,
  appSettings
) => {
  const minClicks = appSettings.get("minClicks");
  const minConversion = appSettings.get("minConversion");

  const adGemKeys = Object.keys(offers);
  let parsedOffers = adGemKeys.map(key => {
    const currentOffer = offers[key].Offer;
    let offerUrl = currentOffer.tracking_url;
    let conversionRate = currentOffer.network_epc;
    let description = currentOffer.instructions;
    let offerHidden = false;
    const offerId = currentOffer.campaign_id;
    const offerName = currentOffer.name;

    description = description.replace(
      "Redeem your points!",
      "Receive your points!"
    );

    const matchingStats = offerStats.find(stats => {
      return stats.id === offerId && stats.network === "AdGem";
    });

    if (matchingStats) {
      conversionRate = matchingStats.conversionRate;
      const clicks = matchingStats.clicks;

      if (clicks >= minClicks && conversionRate < minConversion) {
        offerHidden = true;
      }

      // Offer is most likely new with good CR, place it near the top for now
      if (clicks === 1 && conversionRate === 100) {
        conversionRate = 15;
      }

      if (offerName.includes("King of Avalon") && conversionRate < 5) {
        conversionRate = 10;
      }
    } else {
      conversionRate = 5;
    }

    offerUrl = offerUrl.replace("{playerid}", userId);
    offerUrl = offerUrl.concat(`&gaid=${advertisingId}`);

    return {
      title: currentOffer.name,
      description: description,
      reward: parseFloat(currentOffer.payout_usd),
      imageSrc: currentOffer.icon,
      network: "AdGem",
      id: offerId,
      type: offerTypes.OFFER_CPI,
      conversionRate: conversionRate,
      url: offerUrl,
      completed: false,
      hidden: offerHidden
    };
  });

  const sortAdGateOffers = (a, b) => {
    if (a.conversionRate < b.conversionRate) {
      return 1;
    }
    if (a.conversionRate > b.conversionRate) {
      return -1;
    }
    return 0;
  };

  return parsedOffers.sort(sortAdGateOffers);
};

export const sortByConversionDescending = (a, b) => {
  if (a.conversionRate < b.conversionRate) {
    return 1;
  }
  if (a.conversionRate > b.conversionRate) {
    return -1;
  }
  return 0;
};

export const parseCompletedOffers = offers => {
  return offers.map(offer => {
    return {
      title: offer.get("offerName"),
      description: offer.get("createdAt").toString(),
      reward: offer.get("reward"),
      imageSrc: require("../images/completed.png"),
      network: offer.get("network"),
      id: offer.get("offerId"),
      type: offerTypes.OFFER_COMPLETED,
      conversionRate: 0,
      url: "",
      completed: true
    };
  });
};

export const applyOfferTiers = (offers, offerTiers) => {
  offers.forEach(offer => {
    if (offer.title === "Portal Quest") {
    }
    if (
      offer.type !== offerTypes.OFFER_COMPLETED &&
      offer.type !== offerTypes.OFFER_SUPPORT
    ) {
      offer.reward = calculateReward(offer, offerTiers);
    }
  });
  return offers;
};

export const filterOffersByType = (offers, type) => {
  let filteredOffers = offers.filter(offer => {
    if (type === offerTypes.OFFER_CPI) {
      return offer.type === offerTypes.OFFER_CPI && offer.completed === false;
    } else if (type === offerTypes.OFFER_SURVEY) {
      return (
        (offer.type === offerTypes.OFFER_SURVEY && offer.completed === false) ||
        offer.type === offerTypes.OFFER_OFFERWALL
      );
    } else if (type === offerTypes.OFFER) {
      return offer.type === offerTypes.OFFER && offer.completed === false;
    } else if (type === offerTypes.OFFER_VIDEO) {
      return offer.type === offerTypes.OFFER_VIDEO;
    } else if (type === offerTypes.OFFER_TASK) {
      return offer.type === offerTypes.OFFER_TASK;
    } else if (type === offerTypes.OFFER_COMPLETED) {
      return offer.type === offerTypes.OFFER_COMPLETED;
    } else if (type === offerTypes.OFFER_SUPPORT) {
      return (
        offer.type === offerTypes.OFFER_SUPPORT && offer.completed === false
      );
    } else if (type === offerTypes.OFFER_QUIZ) {
      return offer.type === offerTypes.OFFER_QUIZ;
    } else {
      return false;
    }
  });

  if (type === offerTypes.OFFER_SURVEY) {
    filteredOffers = sortOfferwallsToTop(filteredOffers);
  }

  return filteredOffers;
};

const sortOfferwallsToTop = offers => {
  const compare = (a, b) => {
    if (a.type < b.type) {
      return -1;
    }
    if (a.type > b.type) {
      return 1;
    }
    return 0;
  };

  return offers.sort(compare);
};

const getAdscendOfferType = (offer, separateQuizes) => {
  let categories = offer.category_id;
  let offerName = offer.name;
  let description = offer.description;

  if (description.toLowerCase().includes("win")) {
    return offerTypes.OFFER;
  }

  if (separateQuizes) {
    if (
      offerName.toLowerCase().includes("quiz") ||
      offerName.toLowerCase().includes("twitch trivia")
    ) {
      return offerTypes.OFFER_QUIZ;
    }
  }

  if (categories.includes(17) && categories.includes(18)) {
    return offerTypes.OFFER_CPI;
  } else if (categories.includes(20)) {
    return offerTypes.OFFER_SURVEY;
  } else if (categories.includes(19)) {
    return offerTypes.OFFER_INVALID;
  } else {
    return offerTypes.OFFER;
  }
};

const calculateReward = (offer, offerTiers) => {
  const matchingTier = offerTiers.find(
    tier =>
      offer.reward >= tier.get("fromPayout") &&
      offer.reward <= tier.get("toPayout")
  );

  if (!matchingTier) {
    throw new Error("TypeError tier not found: " + offer.reward);
  }

  return Math.round((offer.reward * matchingTier.get("pointsRate")) / 2);
};

export const isMultiCompletionOffer = offer => {
  if (
    offer.description.includes("unlimited rewards") ||
    offer.description.includes("unlimited points") ||
    offer.description.includes("unlimited number") ||
    offer.description.includes("unlimited videos")
  ) {
    return true;
  } else {
    return false;
  }
};

export const markCompletedOffers = (offers, completedOffers) => {
  completedOffers.forEach(completedOffer => {
    let foundOffers = offers.filter(offer => {
      return (
        offer.id === completedOffer.id &&
        offer.network === completedOffer.network &&
        !isMultiCompletionOffer(offer)
      );
    });
    foundOffers.forEach(offer => {
      offer.completed = true;
    });
  });

  return offers;
};

export const pushBestOfferToTop = (offers, appSettings) => {
  const offerName = appSettings.get("topOffer");
  const topOffer = offers.find(offer => {
    return (
      offer.title.includes(offerName) && offer.type !== offerTypes.OFFER_SUPPORT
    );
  });
  if (topOffer) {
    const offerIndex = offers.indexOf(topOffer);
    offers.splice(offerIndex, 1);
    offers.unshift(topOffer);
  }
};
