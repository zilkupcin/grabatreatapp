import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const awardIcon = require("../../../images/award.png");

const GuideItem = React.memo(({ tier, points }) => {
  const GuideItemComplete = () => {
    return (
      <View style={styles.container}>
        <Image style={styles.guideImage} source={awardIcon} />
        <Text style={styles.guideText}>
          Congratulations! You have enough points for at least one of any of our
          free treats!
        </Text>
      </View>
    );
  };

  const GuideItemIncomplete = () => {
    return (
      <View style={styles.container}>
        <Image style={styles.guideImage} source={awardIcon} />
        <Text style={styles.guideText}>
          Earn{" "}
          <Text style={styles.guideTextBold}>
            {`${tier.get("goalPoints") - points} `}
          </Text>
          {`more points and you'll have enough points for at least one of `}
          <Text style={styles.guideTextBold}>
            {`${tier.get("productCount")} free treats`}
          </Text>
        </Text>
      </View>
    );
  };

  return tier ? <GuideItemIncomplete /> : <GuideItemComplete />;
});

const styles = StyleSheet.create({
  container: {
    borderColor: "#C4C4C4",
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    width: "100%",
    flexDirection: "row",
    alignItems: "center"
  },
  guideText: {
    fontFamily: "roboto_light",
    flex: 1,
    marginLeft: 8
  },
  guideTextBold: {
    fontFamily: "roboto_medium"
  },
  guideImage: {
    width: 46,
    height: 46
  }
});

export default GuideItem;
