import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  AsyncStorage,
  TouchableWithoutFeedback
} from "react-native";
import StatusActionBar from "../../action-bars/StatusActionBar";
import ProductShipping from "./ProductShipping";
import ProductSpecs from "./ProductSpecs";
import SolidButton from "../../buttons/SolidButton";
import LoadingIndicator from "../../loading-indicator/LoadingIndicator";
import ActionDialog from "../../dialogs/ActionDialog";
import { parseVariants, parseProductInfo } from "../../../utils/objectUtils";
import ProductOptions from "./ProductOptions";
import ImageZoomDialog from "../../dialogs/ImageZoomDialog";
import CriticalError from "../../errors/CriticalError";
import "abortcontroller-polyfill";
import fetch from "cross-fetch";
import Parse from "parse/react-native";
import ProductPriceTag from "./ProductPriceTag";
import { getPricingMargin } from "../../../utils/userUtils";
import ProductExtra from "./ProductExtra";
import {
  apiEndpoints,
  actionIcons,
  dialogActions,
  strings,
  dialogTypes
} from "../../../constants";
import {
  buildGeneralAlert,
  buildDecisionAlert,
  getDialog
} from "../../../utils/dialogUtils";
import {
  buildProductDetailsRequest,
  filterProductDetails
} from "../../../utils/shopifyUtils";

const ProductDetails = React.memo(({ navigation }) => {
  const categoryHandle = navigation.getParam("categoryHandle");
  const productHandle = navigation.getParam("productHandle");
  const user = navigation.getParam("user");
  const shippingDelay = navigation.getParam("shippingDelay");

  // Product related state
  const [productInfo, setProductInfo] = useState({});
  const [productDetails, setProductDetails] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filteredValues, setFilteredValues] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [productSizingData, setProductSizingData] = useState(null);

  // Page state
  const [zoomModeEnabled, setZoomModeEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [criticalError, setCriticalError] = useState("");
  const [criticalErrorRetryDisabled, setCriticalErrorRetryDisabled] = useState(
    false
  );
  const [dialogMessage, setDialogMessage] = useState(null);

  const consentRequired = navigation.getParam("consentRequired");
  const consentGiven = navigation.getParam("consentGiven");

  const AbortController = window.AbortController;
  const abortController = new AbortController();
  const signal = abortController.signal;

  useEffect(() => {
    checkIfFavorite();
    fetchProductDetails();

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const fetchProductSizing = async store => {
    try {
      const sizing = await Parse.Cloud.run("fetchProductSizing", {
        store: store,
        category: categoryHandle
      });
      setProductSizingData(sizing);
    } catch (e) {}
  };

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(
        apiEndpoints.SHOPIFY,
        buildProductDetailsRequest(productHandle, signal)
      );
      const data = await response.json();
      const tags = data.data.productByHandle.tags;

      if (tags) {
        const foundExtraTag = tags.find(tag => {
          return tag.includes("store");
        });
        if (foundExtraTag) {
          await fetchProductSizing(foundExtraTag);
        }
      }

      const fetchedVariants = data.data.productByHandle.variants.edges;
      const parsedVariants = parseVariants(
        fetchedVariants,
        getPricingMargin(user.get("regCountry"))
      );

      setProductDetails(
        filterProductDetails(data.data.productByHandle.descriptionHtml)
      );
      setProductInfo(
        parseProductInfo(
          data.data.productByHandle,
          getPricingMargin(user.get("regCountry"))
        )
      );
      setVariants(parsedVariants);

      if (parsedVariants.length === 1) {
        setSelectedVariant({
          sku: parsedVariants[0].sku,
          imageSrc: parsedVariants[0].imageSrc,
          price: parsedVariants[0].price
        });
      } else {
        setDefaultOptionState(parsedVariants[0].options);
      }

      setIsLoading(false);
    } catch (error) {
      if (error.name === "TypeError") {
        setCriticalErrorRetryDisabled(true);
        setCriticalError(
          "It looks like this freebie is not available anymore."
        );
      } else {
        setCriticalError("Failed to fetch product details" + error);
      }
    }
  };

  const setDefaultOptionState = options => {
    setSelectedOptions(
      options.map(option => {
        return {
          name: option.name,
          value: ""
        };
      })
    );
  };

  const handleOptionSelect = (name, value, optionIndex, imageSrc) => {
    const newOptions = [...selectedOptions];

    if (selectedOptions.length > 1) {
      optionIndex === 0 && filterOptions({ name, value });
      if (optionIndex === 0 && selectedOptions[1].value) {
        newOptions[optionIndex] = { name, value };
        newOptions[1].value = "";
      } else {
        newOptions[optionIndex] = { name, value };
      }
    } else {
      newOptions[optionIndex] = { name, value };
    }

    setSelectedOptions(newOptions);
    const foundVariant = findVariantMatch(newOptions);

    if (foundVariant !== undefined) {
      setSelectedVariant({
        sku: foundVariant.sku,
        imageSrc: foundVariant.imageSrc,
        price: foundVariant.price
      });
    } else if (imageSrc !== undefined) {
      setSelectedVariant({
        sku: "",
        imageSrc: imageSrc,
        price: productInfo.minVariantPrice
      });
    }
  };

  const findVariantMatch = options => {
    if (variants[0].options.length === 1) {
      return variants.find(variant => {
        return variant.options[0].value === options[0].value;
      });
    } else {
      return variants.find(variant => {
        return (
          variant.options[0].value === options[0].value &&
          variant.options[1].value === options[1].value
        );
      });
    }
  };

  const filterOptions = selectedOption => {
    const filteredVariants = variants.filter(variant => {
      return variant.options.find(option => {
        return (
          option.name === selectedOption.name &&
          option.value === selectedOption.value
        );
      });
    });

    const filteredValues = [
      ...new Set(filteredVariants.map(variant => variant.options[1].value))
    ];
    setFilteredValues(filteredValues);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleGrabPress = () => {
    let dialogMessage;

    //Freebie type is not selected
    if (!selectedVariant || !selectedVariant.sku) {
      dialogMessage = getDialog(dialogTypes.GRAB_TYPE_NOT_SELECTED);
      //Not enough points
    } else if (user.get("points") < selectedVariant.price) {
      dialogMessage = getDialog(dialogTypes.GRAB_NOT_ENOUGH_POINTS);
      // User profile is incomplete
    } else if (user.get("profileCompleted") === false) {
      //Show dialog only if user has given consent or consent is not required
      if (!consentRequired || (consentRequired && consentGiven)) {
        dialogMessage = getDialog(dialogTypes.GRAB_PROFILE_INCOMPLETE);
      }
      // Ask if the use has viewed the sizing chart
    } else if (productSizingData) {
      dialogMessage = getDialog(dialogTypes.GRAB_CHECK_SIZING);
      // Warn about shipping delays
    } else if (shippingDelay) {
      dialogMessage = getDialog(dialogTypes.GRAB_SHIPPING_DELAY);
    }

    if (dialogMessage !== undefined) {
      setDialogMessage(dialogMessage);
    } else {
      getProductByHandle();
    }
  };

  const getProductByHandle = async () => {
    try {
      const products = await Parse.Cloud.run("getProductsWithHandle", {
        handle: productHandle
      });

      if (products.length > 1) {
        setDialogMessage(
          buildGeneralAlert(
            "Oops!",
            "More than one product found, please contact support",
            dialogActions.DIALOG_ACTION_DO_NOTHING
          )
        );
        return;
      }
      const productVariants = products[0].get("productVariants");

      const matchedVariant = getMatchingVariant(productVariants);
      if (matchedVariant) {
        navigation.navigate("Grab", {
          productId: products[0].get("productId"),
          variantId: matchedVariant.id,
          variantSku: selectedVariant.sku,
          variantImage: selectedVariant.imageSrc,
          user: user
        });
      } else {
        setDialogMessage(
          buildGeneralAlert(
            "Error!",
            "Matching variant not found, please contact support",
            dialogActions.DIALOG_ACTION_DO_NOTHING
          )
        );
      }
    } catch (e) {
      setDialogMessage(
        buildGeneralAlert(
          "Error!",
          e.message,
          dialogActions.DIALOG_ACTION_DO_NOTHING
        )
      );
    }
  };

  const getMatchingVariant = productVariants => {
    return productVariants.find(variant => {
      return variant.sku === selectedVariant.sku;
    });
  };

  const checkIfFavorite = async () => {
    try {
      let favorites = await AsyncStorage.getItem("favorites");
      if (favorites === null) {
        await AsyncStorage.setItem("favorites", JSON.stringify([]));
      } else {
        favorites = JSON.parse(favorites);
        const foundProduct = favorites.find(
          product => product.handle === productHandle
        );
        foundProduct && setIsFavorite(true);
      }
    } catch (error) {}
  };

  const handleFavoritePress = () => {
    toggleFavorite();
  };

  const handleZoomBackPress = () => {
    setZoomModeEnabled(false);
  };

  const handleImageZoomPress = () => {
    setZoomModeEnabled(true);
  };

  const toggleFavorite = async () => {
    let favorites = await AsyncStorage.getItem("favorites");
    favorites = JSON.parse(favorites);

    let foundProduct = favorites.find(
      product => product.handle === productHandle
    );

    if (foundProduct) {
      favorites.splice(favorites.indexOf(foundProduct), 1);
      await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(false);
    } else {
      favorites.push({
        handle: productHandle,
        title: productInfo.title,
        imageSrc: productInfo.imageSrc,
        minPrice: productInfo.minVariantPrice,
        maxPrice: productInfo.maxVariantPrice
      });

      await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const handleRetryPress = () => {
    setCriticalError("");
    setIsLoading(true);
    fetchProductDetails();
  };

  const handleDialogAction = action => {
    if (action === dialogActions.DIALOG_ACTION_COMPLETE_PROFILE) {
      navigation.navigate("CompleteProfile");
    } else if (action === dialogActions.DIALOG_GRAB_SIZING_PROMPT_ACCEPTED) {
      getProductByHandle();
    } else if (action === dialogActions.DIALOG_GRAB_SHIPPING_DELAY_PROMPTED) {
      getProductByHandle();
    }
    setDialogMessage(null);
  };

  if (criticalError)
    return (
      <View style={styles.container}>
        <StatusActionBar
          onBackPress={handleBackPress}
          points={user.get("points")}
          paddingBottom={8}
        />
        <CriticalError
          onRetryPress={handleRetryPress}
          message={criticalError}
          retryDisabled={criticalErrorRetryDisabled}
        />
      </View>
    );

  if (isLoading) return <LoadingIndicator />;

  return (
    <View style={styles.container}>
      <StatusActionBar
        onBackPress={handleBackPress}
        points={user.get("points")}
        onRightIconPress={handleFavoritePress}
        rightIcon={actionIcons.ICON_FAVORITE}
        isFavorite={isFavorite}
        paddingBottom={8}
        borderEnabled={true}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{productInfo.title}</Text>
        <TouchableWithoutFeedback onPress={handleImageZoomPress}>
          <Image
            style={styles.image}
            source={{
              uri: selectedVariant
                ? selectedVariant.imageSrc
                : productInfo.imageSrc
            }}
          />
        </TouchableWithoutFeedback>
        <ProductPriceTag
          price={
            selectedVariant
              ? selectedVariant.price
              : productInfo.minVariantPrice
          }
        />
        {variants.length > 1 && (
          <ProductOptions
            variants={variants}
            selectedOptions={selectedOptions}
            filteredValues={filteredValues}
            onOptionSelect={handleOptionSelect}
          />
        )}
        <ProductSpecs content={productDetails} />
        <ProductShipping />
        {productSizingData && (
          <ProductExtra
            imperial={user.get("regCountry") === "US" ? true : false}
            data={productSizingData}
          />
        )}
        <SolidButton
          width={250}
          marginTop={16}
          marginBottom={16}
          onPress={handleGrabPress}
          title="Grab now"
        />
      </ScrollView>
      {zoomModeEnabled && (
        <ImageZoomDialog
          onBackPress={handleZoomBackPress}
          imageSrc={
            selectedVariant ? selectedVariant.imageSrc : productInfo.imageSrc
          }
        />
      )}
      {dialogMessage && (
        <ActionDialog
          isVisible={dialogMessage ? true : false}
          onActionPress={handleDialogAction}
          title={dialogMessage.title}
          message={dialogMessage.message}
          positiveAction={dialogMessage.positiveAction}
          negativeAction={dialogMessage.negativeAction}
        />
      )}
    </View>
  );
});

ProductDetails.navigationOptions = ({ navigation }) => ({
  header: null
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1
  },
  scrollView: {
    width: "100%"
  },
  scrollViewContent: {
    flexDirection: "column",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16
  },
  title: {
    marginBottom: 16,
    marginTop: 16,
    fontSize: 16,
    textAlign: "center"
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 16
  },
  loadingContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default ProductDetails;
