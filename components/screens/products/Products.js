import React, { useState, useEffect } from "react";
import StatusActionBar from "../../action-bars/StatusActionBar";
import { View, StyleSheet } from "react-native";
import Sorting from "./Sorting";
import ProductList from "./ProductList";
import { apiEndpoints } from "../../../constants";
import { buildCategoryProductRequest } from "../../../utils/shopifyUtils";
import { parseProducts } from "../../../utils/objectUtils";
import LoadingIndicator from "../../loading-indicator/LoadingIndicator";
import CriticalError from "../../errors/CriticalError";
import "abortcontroller-polyfill";
import Snackbar from "react-native-snackbar";
import fetch from "cross-fetch";
import { getPricingMargin } from "../../../utils/userUtils";
import { logError } from "../../../utils/loggingUtils";

const Products = ({ navigation }) => {
  //Data state
  const [products, setProducts] = useState([]);

  //Shopify state
  const [cursor, setCursor] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [sortMode, setSortMode] = useState(0);

  //Page state
  const [isLoading, setIsLoading] = useState(true);
  const [criticalError, setCriticalError] = useState("");

  const categoryHandle = navigation.getParam("handle");
  const user = navigation.getParam("user");
  const shippingDelay = navigation.getParam("shippingDelay");
  const consentRequired = navigation.getParam("consentRequired");
  const consentGiven = navigation.getParam("consentGiven");

  const AbortController = window.AbortController;
  const abortController = new AbortController();
  const signal = abortController.signal;

  useEffect(() => {
    fetchProducts(false);

    return function cleanup() {
      abortController.abort();
    };
  }, [sortMode]);

  const showSnackbar = () => {
    Snackbar.show({
      title: "Loading more freebies!",
      duration: Snackbar.LENGTH_SHORT
    });
  };

  const fetchProducts = async nextPage => {
    try {
      const response = await fetch(
        apiEndpoints.SHOPIFY,
        buildCategoryProductRequest(
          nextPage ? cursor : null,
          categoryHandle,
          sortMode,
          signal
        )
      );

      const data = await response.json();
      const edges = data.data.collectionByHandle.products.edges;
      const fetchedProducts = parseProducts(
        edges,
        getPricingMargin(user.get("regCountry"))
      );
      const hasNextPage =
        data.data.collectionByHandle.products.pageInfo.hasNextPage;
      setHasNextPage(hasNextPage);

      if (products.length > 0) {
        setProducts(() => [...products, ...fetchedProducts]);
      } else {
        setProducts(fetchedProducts);
      }

      setCursor(fetchedProducts[fetchedProducts.length - 1].cursor);
      setIsLoading(false);
    } catch (error) {
      setCriticalError("Failed to fetch products\n" + error);
      logError(error.message + " Shopify - Category Products");
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEndReached = () => {
    if (hasNextPage) {
      fetchProducts(true);
      showSnackbar();
    }
  };

  const handleSortModeChange = newSortMode => {
    if (newSortMode !== sortMode) {
      setSortMode(newSortMode);
      setProducts([]);
      setCursor("");
      setIsLoading(true);
    }
  };

  const handleProductPress = productHandle => {
    navigation.navigate("ProductDetails", {
      productHandle,
      categoryHandle,
      shippingDelay,
      user,
      consentRequired,
      consentGiven
    });
  };

  const handleRetryPress = () => {
    setCriticalError("");
    setIsLoading(true);
    fetchProducts(false);
  };

  if (criticalError)
    return (
      <CriticalError onRetryPress={handleRetryPress} message={criticalError} />
    );

  if (isLoading) return <LoadingIndicator />;

  return (
    <View style={styles.container}>
      <StatusActionBar
        onBackPress={handleBackPress}
        points={user.get("points")}
        paddingLeft={16}
        paddingRight={16}
        paddingBottom={8}
      />
      <Sorting
        selectedSortModeId={sortMode}
        onSortModeChange={handleSortModeChange}
      />
      <ProductList
        products={products}
        onEndReached={handleEndReached}
        onProductPress={handleProductPress}
      />
    </View>
  );
};

Products.navigationOptions = ({ navigation }) => ({
  header: null
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  loadingContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Products;
