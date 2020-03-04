import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import {
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native-gesture-handler";
import { actionIcons } from "../../constants";

const backIcon = require("../../images/back.png");
const heartFilledIcon = require("../../images/heart_filled.png");
const heartIcon = require("../../images/heart_red.png");

const StatusActionBar = React.memo(
  ({
    onBackPress,
    points,
    onRightIconPress,
    isFavorite,
    rightIcon,
    borderEnabled
  }) => {
    const IconFavorite = () => {
      return (
        <TouchableWithoutFeedback onPress={onRightIconPress}>
          <Image
            style={styles.rightIcon}
            source={isFavorite ? heartFilledIcon : heartIcon}
          />
        </TouchableWithoutFeedback>
      );
    };

    const IconRefresh = () => {
      return (
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={onRightIconPress}
        >
          <Image
            style={styles.refreshIcon}
            source={require("../../images/refresh.png")}
          />
        </TouchableOpacity>
      );
    };

    const getRightComponent = () => {
      return rightIcon === actionIcons.ICON_FAVORITE ? (
        <IconFavorite />
      ) : rightIcon === actionIcons.ICON_REFRESH ? (
        <IconRefresh />
      ) : (
        <View style={styles.flexItem} />
      );
    };

    return (
      <View
        style={[
          styles.container,
          {
            borderBottomWidth: borderEnabled && 1,
            borderBottomColor: borderEnabled && "#dedede"
          }
        ]}
      >
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple("#FF6363", true)}
          onPress={onBackPress}
        >
          <Image style={styles.backIcon} source={backIcon} />
        </TouchableNativeFeedback>
        <View>
          <Text style={styles.balanceText}>Your balance</Text>
          <Text style={styles.pointsText}>
            {points} <Text style={styles.pointsLabel}>Points!</Text>
          </Text>
        </View>
        {getRightComponent()}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    height: 64
  },
  balanceText: {
    letterSpacing: 3,
    textTransform: "uppercase",
    fontSize: 14,
    fontFamily: "roboto_medium"
  },
  pointsText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16
  },
  pointsLabel: {
    fontWeight: "normal"
  },
  backIcon: {
    width: 18,
    height: 18,
    marginLeft: 16,
    marginRight: 16
  },
  rightIcon: {
    width: 18,
    height: 18,
    marginRight: 16,
    marginLeft: 16
  },
  refreshButton: {
    backgroundColor: "#FFD4D4",
    borderRadius: 16,
    padding: 8,
    marginRight: 16,
    marginLeft: 16
  },
  refreshIcon: {
    width: 10,
    height: 10
  },
  flexItem: {
    width: 18,
    height: 18,
    marginRight: 16
  }
});

export default StatusActionBar;
