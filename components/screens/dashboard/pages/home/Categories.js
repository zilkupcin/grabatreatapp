import React from "react";
import { StyleSheet, FlatList, Dimensions } from "react-native";
import CategoryItem from "./CategoryItem";
import {
  getNumOfProductColumns,
  calculateLeftPaddingProducts,
  calculateRightPaddingProducts
} from "../../../../../utils/dimensUtils";

const Categories = React.memo(({ onCategoryPress, categories }) => {
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const NUM_OF_COLUMNS = getNumOfProductColumns(SCREEN_WIDTH);

  return (
    <FlatList
      style={styles.container}
      data={categories}
      scrollEnabled={false}
      numColumns={NUM_OF_COLUMNS}
      renderItem={({ item, index }) => (
        <CategoryItem
          itemWidth={SCREEN_WIDTH / NUM_OF_COLUMNS}
          category={item}
          key={item.title}
          onCategoryPress={onCategoryPress}
          paddingLeft={calculateLeftPaddingProducts(index, NUM_OF_COLUMNS)}
          paddingRight={calculateRightPaddingProducts(index, NUM_OF_COLUMNS)}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingBottom: 8
  }
});

export default Categories;
