import React from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import TagWithImage from "../dashboard/pages/home/TagWithImage";

class ProductItem extends React.PureComponent {
  render() {
    const {
      product,
      onProductPress,
      itemWidth,
      paddingLeft,
      paddingRight
    } = this.props;

    return (
      <TouchableOpacity
        delayPressIn={10}
        activeOpacity={0.7}
        style={[
          styles.container,
          { width: itemWidth, paddingLeft, paddingRight }
        ]}
        onPress={() => onProductPress(product.handle)}
      >
        <View style={styles.product}>
          <Image
            source={{ uri: product.imageSrc }}
            style={styles.productImage}
          />
          <Text style={styles.productTitle}>{product.title}</Text>
          <TagWithImage
            minPrice={product.minPrice}
            maxPrice={product.maxPrice}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 8
  },
  product: {
    overflow: "hidden",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#EAEAEA",
    borderWidth: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    height: 270
  },
  productImage: {
    width: "100%",
    height: 150
  },
  productTitle: {
    fontSize: 14,
    textAlign: "center",
    margin: 16
  }
});

export default ProductItem;
