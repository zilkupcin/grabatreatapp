import React from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import TagWithImage from "./TagWithImage";

const CategoryItem = ({
  category,
  onCategoryPress,
  itemWidth,
  paddingLeft,
  paddingRight
}) => {
  return (
    <TouchableOpacity
      delayPressIn={10}
      style={[
        styles.container,
        { width: itemWidth, paddingLeft, paddingRight }
      ]}
      activeOpacity={0.7}
      onPress={() => onCategoryPress(category.handle)}
    >
      <View style={styles.category}>
        <Image
          source={{ uri: category.imageSrc }}
          style={styles.categoryImage}
        />
        <Text style={styles.categoryTitle}>{category.title}</Text>
        <Text
          style={styles.categoryItemCount}
        >{`${category.itemCount}+ Items`}</Text>
        <TagWithImage minPrice={category.minPrice} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 16
  },
  category: {
    overflow: "hidden",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#EAEAEA",
    borderWidth: 1
  },
  categoryImage: {
    width: "100%",
    height: 150
  },
  categoryTitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 4
  },
  categoryItemCount: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8
  }
});

export default CategoryItem;
