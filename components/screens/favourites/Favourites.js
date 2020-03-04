import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, AsyncStorage } from "react-native";
import PageActionBar from "../../action-bars/PageActionBar";
import ProductList from "../products/ProductList";
import LoadingIndicator from "../../loading-indicator/LoadingIndicator";
import PageError from "../../errors/PageError";
import { errorMessages } from "../../../constants";

const Favourites = ({ navigation }) => {
  const user = navigation.getParam("user");

  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const willFocusSubscription = navigation.addListener(
      "willFocus",
      handleWillFocus
    );

    fetchFavorites();
    return () => {
      willFocusSubscription.remove();
    };
  }, []);

  const handleWillFocus = () => {
    fetchFavorites();
  };

  const fetchFavorites = async () => {
    let favorites = await AsyncStorage.getItem("favorites");
    if (favorites !== null) {
      favorites = JSON.parse(favorites);
      setFavorites(favorites);
    } else {
      setFavorites([]);
    }
    setIsLoading(false);
  };

  const handleFavoritePress = productHandle => {
    navigation.navigate("ProductDetails", { user, productHandle });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  if (isLoading) return <LoadingIndicator />;

  return (
    <View style={styles.container}>
      <PageActionBar
        hasParent={true}
        title="Favorite Treats"
        onBackPress={handleBackPress}
      />
      {favorites.length > 0 ? (
        <ProductList
          products={favorites}
          onProductPress={handleFavoritePress}
        />
      ) : (
        <PageError message={errorMessages.ERROR_FAVORITES_EMPTY} />
      )}
    </View>
  );
};

Favourites.navigationOptions = ({ navigation }) => ({
  header: null
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Favourites;
