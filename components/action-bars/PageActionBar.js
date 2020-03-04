import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { TouchableNativeFeedback } from "react-native-gesture-handler";

const backIcon = require("../../images/back.png");

const PageActionBar = React.memo(
  ({ title, hasParent, onBackPress, borderEnabled }) => {
    const NavHeader = () => {
      return (
        <View style={styles.navHeaderContainer}>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple("#FF6363", true)}
            onPress={onBackPress}
          >
            <Image style={styles.backIcon} source={backIcon} />
          </TouchableNativeFeedback>
          <Text style={styles.titleCenter}>{title}</Text>
          <View style={styles.flexItem} />
        </View>
      );
    };

    const TitleHeader = () => {
      return (
        <View
          style={
            borderEnabled
              ? [styles.container, styles.borderBottom]
              : styles.container
          }
        >
          <Text style={styles.title}>{title}</Text>
        </View>
      );
    };

    return hasParent ? <NavHeader /> : <TitleHeader />;
  }
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    paddingTop: 16,
    paddingBottom: 16
  },
  title: {
    textAlign: "center",
    fontSize: 16
  },
  titleCenter: {
    textAlign: "center",
    fontSize: 16
  },
  navHeaderContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    borderBottomColor: "#DEDEDE",
    borderBottomWidth: 1
  },
  backIcon: {
    width: 18,
    height: 18,
    marginLeft: 16,
    marginRight: 16
  },
  flexItem: {
    width: 18,
    height: 18,
    marginLeft: 16,
    marginRight: 16
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#dedede"
  }
});

export default PageActionBar;
