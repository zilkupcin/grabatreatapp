import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import FeatureItem from "./FeatureItem";
import { featureList } from "../../../../../data/features";

const Features = React.memo(({ onFeaturePress }) => {
  return (
    <ScrollView
      horizontal={true}
      style={styles.scrollView}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.container}>
        {featureList.map(feature => {
          return (
            <FeatureItem
              feature={feature}
              key={feature.title}
              onPress={onFeaturePress}
            />
          );
        })}
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  scrollView: {
    flexGrow: 0,
    marginLeft: 16,
    alignSelf: "flex-start"
  }
});

export default Features;
