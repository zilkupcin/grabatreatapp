import { offerTypes } from "../constants";

export const additionalOffers = {
  OFFERWALL_POLLFISH: {
    title: "Pollfish Surveys",
    description:
      "Lots of short surveys with high point rewards. Check it out now!",
    reward: 0,
    imageSrc:
      "https://xc7ftke7rxjehvyefy0cwgr1jaa57t.files-sashido.cloud/f3b53b84459f6d8fa4d63f7d8e0ef37c_pollfish_logo.png",
    network: "Pollfish",
    id: 0,
    type: offerTypes.OFFER_OFFERWALL,
    conversionRate: 0,
    url: ""
  },
  OFFERWALL_THEOREM: {
    title: "Theorem Reach Surveys",
    description: "Our top survey list, new tasks added every day!",
    reward: 0,
    imageSrc:
      "https://xc7ftke7rxjehvyefy0cwgr1jaa57t.files-sashido.cloud/c9fc7df927266e5cea37401e5b26ce07_orem.png",
    network: "Orem",
    id: 0,
    type: offerTypes.OFFER_OFFERWALL,
    conversionRate: 0,
    url: ""
  },
  OFFERWALL_ADCOLONY: {
    title: "Watch videos!",
    description: "Watch videos every day!",
    reward: 1,
    imageSrc: require("../images/video_player.png"),
    network: "Adcolony",
    id: 0,
    type: offerTypes.OFFER_VIDEO,
    conversionRate: 0,
    url: ""
  },
  TASK_ENTER_CODE: {
    title: "Enter an Invitation Code",
    description: "Enter someone's invitation code and get rewarded!",
    reward: 20,
    imageSrc: require("../images/announcement.png"),
    network: "Grab a Treat",
    id: 0,
    type: offerTypes.OFFER_TASK,
    conversionRate: 0,
    url: ""
  },
  TASK_COMPLETE_PROFILE: {
    title: "Complete Registration",
    description:
      "Set an email and a password for this account and get 20 points!",
    reward: 20,
    imageSrc: require("../images/notes.png"),
    network: "Grab a Treat",
    id: 0,
    type: offerTypes.OFFER_TASK,
    conversionRate: 0,
    url: ""
  }
};
