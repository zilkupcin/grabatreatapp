import React from "react";
import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import ProductItem from "./ProductItem";
import {
  getNumOfProductColumns,
  calculateLeftPaddingProducts,
  calculateRightPaddingProducts
} from "../../../utils/dimensUtils";

const ProductList = React.memo(({ products, onEndReached, onProductPress }) => {
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const NUM_OF_COLUMNS = getNumOfProductColumns(SCREEN_WIDTH);

  return (
    <FlatList
      style={styles.container}
      data={products}
      numColumns={NUM_OF_COLUMNS}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <ProductItem
          product={item}
          onProductPress={onProductPress}
          index={item.id}
          itemWidth={SCREEN_WIDTH / NUM_OF_COLUMNS}
          paddingLeft={calculateLeftPaddingProducts(index, NUM_OF_COLUMNS)}
          paddingRight={calculateRightPaddingProducts(index, NUM_OF_COLUMNS)}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={0.5}
      onEndReached={onEndReached}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingTop: 8,
    paddingBottom: 8
  }
});

export default ProductList;
