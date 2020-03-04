import { features } from "../constants";

export const featureList = [
  {
    icon: require("../images/store.png"),
    title: "Rate us!",
    description: "It will help us stay on top of charts!",
    bgColor: "#FDCB6E",
    featureId: features.FEATURE_RATE_US
  },
  {
    icon: require("../images/add.png"),
    title: "Refer friends!",
    description: "And get more points!",
    bgColor: "#FF7675",
    featureId: features.FEATURE_INVITE
  },
  {
    icon: require("../images/diamond.png"),
    title: "Tutorial",
    description: "Learn how to earn points!",
    bgColor: "#A29BFE",
    featureId: features.FEATURE_TUTORIAL
  }
];
