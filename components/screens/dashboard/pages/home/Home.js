import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import HomeActionBar from "../../../../action-bars/HomeActionBar";
import OutlineButton from "../../../../buttons/OutlineButton";
import Categories from "./Categories";
import Features from "./Features";
import TextLabel from "../../../../text/TextLabel";

const Home = React.memo(
  ({
    onEarnMorePress,
    onFavouritesPress,
    onFeaturePress,
    categories,
    onCategoryPress,
    user,
    onRefresh
  }) => {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <HomeActionBar
            onFavouritesPress={onFavouritesPress}
            points={user.get("points")}
            onRefresh={onRefresh}
          />
          <OutlineButton
            title="EARN POINTS"
            width={200}
            marginBottom={16}
            marginTop={16}
            onPress={onEarnMorePress}
          />
          <Features onFeaturePress={onFeaturePress} />
          <TextLabel
            title="choose a category"
            marginLeft={16}
            marginTop={16}
            marginBottom={16}
          />
          <Categories
            onCategoryPress={onCategoryPress}
            categories={categories}
          />
        </View>
      </ScrollView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center"
  }
});

export default Home;
