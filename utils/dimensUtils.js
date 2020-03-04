import { Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export const getNumOfProductColumns = screenWidth => {
  if (screenWidth >= 1280) {
    return 8;
  } else if (screenWidth >= 768) {
    return 5;
  } else if (screenWidth >= 600) {
    return 4;
  } else if (screenWidth >= 480) {
    return 3;
  } else {
    return 2;
  }
};

export const getNumOfOptionColumns = screenWidth => {
  if (screenWidth >= 1280) {
    return 16;
  } else if (screenWidth >= 768) {
    return 10;
  } else if (screenWidth >= 600) {
    return 8;
  } else if (screenWidth >= 480) {
    return 6;
  } else {
    return 5;
  }
};

export const calculateLeftPaddingProducts = (index, numOfColumns) => {
  const newIndex = index + 1;
  const previousIndex = index;
  if (newIndex === 1) {
    return 16;
  }

  if (previousIndex % numOfColumns === 0) {
    return 16;
  } else {
    return 8;
  }
};

export const calculateRightPaddingProducts = (index, numOfColumns) => {
  const newIndex = index + 1;
  if (newIndex % numOfColumns === 0) {
    return 16;
  } else {
    return 8;
  }
};

export const getPageContentWidthPercentage = () => {
  if (SCREEN_WIDTH >= 1280) {
    return "30%";
  } else if (SCREEN_WIDTH >= 768) {
    return "50%";
  } else if (SCREEN_WIDTH >= 600) {
    return "70%";
  } else if (SCREEN_WIDTH >= 480) {
    return "90%";
  } else {
    return "100%";
  }
};
