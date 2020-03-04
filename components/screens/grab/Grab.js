import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import StatusActionBar from "../../action-bars/StatusActionBar";
import SolidButton from "../../buttons/SolidButton";
import MainTextInput from "../../inputs/MainTextInput";
import PressableTextInput from "../../inputs/PressableTextInput";
import { ScrollView } from "react-native-gesture-handler";
import ActionDialog from "../../dialogs/ActionDialog";
import { countries } from "../../../data/countries";
import { states } from "../../../data/states";
import SelectDialog from "../../dialogs/SelectDialog";
import { checkInputGrab } from "../../../utils/inputUtils";
import {
  buildGeneralError,
  buildGeneralAlert
} from "../../../utils/dialogUtils";
import { dialogActions } from "../../../constants";
import Parse from "parse/react-native";
import { getPageContentWidthPercentage } from "../../../utils/dimensUtils";

const shippingIcon = require("../../../images/shipping.png");

const Grab = ({ navigation }) => {
  const preselectCountry = () => {
    const foundCountry = countries.find(country => {
      return country.code === user.get("regCountry");
    });

    if (foundCountry) {
      return foundCountry.name;
    } else {
      return "";
    }
  };

  const user = navigation.getParam("user");
  const variantSku = navigation.getParam("variantSku");
  const variantId = navigation.getParam("variantId");
  const productId = navigation.getParam("productId");
  const variantImage = navigation.getParam("variantImage");

  //Page state
  const [dialogMessage, setDialogMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Shipping address state
  const initialShippingState = {
    firstName: "",
    lastName: "",
    country: preselectCountry(),
    addressOne: "",
    addressTwo: "",
    city: "",
    state: "",
    zip: "",
    selectionType: null
  };

  const [shippingInfo, setShippingInfo] = useState(initialShippingState);

  // Selection dialog type
  const [selectionType, setSelectionType] = useState(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const navigateHome = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Dashboard" })]
    });
    navigation.dispatch(resetAction);
  };

  const handleDialogAction = action => {
    setDialogMessage(null);
    if (action === dialogActions.DIALOG_ACTION_COMPLETE_ORDER) {
      navigateHome();
    }
  };

  const handleCountryInputPress = () => {
    setSelectionType("country");
  };

  const handleStateInputPress = () => {
    setSelectionType("state");
  };

  const handleItemSelect = (name, item) => {
    if (name === "country") {
      setShippingInfo({ ...shippingInfo, country: item.name });
    } else if (name === "state") {
      setShippingInfo({ ...shippingInfo, state: item });
    }
    setSelectionType(null);
  };

  const handleCompleteOrderPress = () => {
    if (!isSubmitting) {
      setIsSubmitting(true);

      const inputCheckResponse = checkInputGrab(shippingInfo);
      if (inputCheckResponse) {
        setDialogMessage(buildGeneralError(inputCheckResponse));
        setIsSubmitting(false);
      } else {
        placeOrder();
      }
    }
  };

  const placeOrder = async () => {
    try {
      const params = {
        variantSku: variantSku,
        productId: productId,
        variantId: variantId,
        productImage: variantImage,
        firstName: shippingInfo.firstName.trim(),
        lastName: shippingInfo.lastName.trim(),
        country: shippingInfo.country,
        addressLineOne: shippingInfo.addressOne.trim(),
        addressLineTwo: shippingInfo.addressTwo.trim(),
        city: shippingInfo.city.trim(),
        postalCode: shippingInfo.zip.trim(),
        state: shippingInfo.state.trim()
      };
      await Parse.Cloud.run("orderProductV2", params);
      setDialogMessage(
        buildGeneralAlert(
          "Success!",
          "You've ordered a freebie! It will be with you in 35 - 60 days",
          dialogActions.DIALOG_ACTION_COMPLETE_ORDER
        )
      );
    } catch (e) {
      setDialogMessage(buildGeneralError(e.message));
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (name, text) => {
    if (name === "firstName") {
      setShippingInfo({ ...shippingInfo, firstName: text });
    } else if (name === "lastName") {
      setShippingInfo({ ...shippingInfo, lastName: text });
    } else if (name === "addressOne") {
      setShippingInfo({ ...shippingInfo, addressOne: text });
    } else if (name === "addressTwo") {
      setShippingInfo({ ...shippingInfo, addressTwo: text });
    } else if (name === "city") {
      setShippingInfo({ ...shippingInfo, city: text });
    } else if (name === "state") {
      setShippingInfo({ ...shippingInfo, state: text });
    } else if (name === "zipCode") {
      setShippingInfo({ ...shippingInfo, zip: text });
    }
  };

  const getStateSelector = () => {
    if (shippingInfo.country === "United States") {
      return (
        <PressableTextInput
          placeholder="State/province/region"
          marginTop={0}
          marginBottom={24}
          onPress={handleStateInputPress}
          value={shippingInfo.state}
          name="state"
        />
      );
    } else {
      return (
        <MainTextInput
          placeholder="State/province/region"
          marginTop={0}
          marginBottom={24}
          type="none"
          editable={true}
          value={shippingInfo.state}
          name="state"
          onChange={handleInputChange}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusActionBar
        onBackPress={handleBackPress}
        paddingRight={16}
        paddingLeft={16}
        points={user.get("points")}
        borderEnabled={true}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Image style={styles.pageImage} source={shippingIcon} />
          <Text style={styles.pageText}>
            Please enter your shipping details
          </Text>
          <MainTextInput
            placeholder="First Name"
            marginTop={0}
            marginBottom={24}
            type="none"
            editable={true}
            value={shippingInfo.firstName}
            name="firstName"
            onChange={handleInputChange}
          />
          <MainTextInput
            placeholder="Last Name"
            marginTop={0}
            marginBottom={24}
            type="none"
            editable={true}
            value={shippingInfo.lastName}
            name="lastName"
            onChange={handleInputChange}
          />
          <PressableTextInput
            placeholder="Country"
            marginTop={0}
            marginBottom={24}
            onPress={handleCountryInputPress}
            value={shippingInfo.country}
            name="country"
          />
          <MainTextInput
            placeholder="Address line 1"
            marginTop={0}
            marginBottom={24}
            type="none"
            editable={true}
            value={shippingInfo.addressOne}
            name="addressOne"
            onChange={handleInputChange}
          />
          <MainTextInput
            placeholder="Address Line 2 (Optional)"
            marginTop={0}
            marginBottom={24}
            type="none"
            editable={true}
            value={shippingInfo.addressTwo}
            name="addressTwo"
            onChange={handleInputChange}
          />
          <MainTextInput
            placeholder="City"
            marginTop={0}
            marginBottom={24}
            type="none"
            editable={true}
            value={shippingInfo.city}
            name="city"
            onChange={handleInputChange}
          />
          {getStateSelector()}
          <MainTextInput
            placeholder="Zip/Postal code"
            marginTop={0}
            marginBottom={24}
            type="none"
            editable={true}
            name="zipCode"
            value={shippingInfo.zip}
            onChange={handleInputChange}
          />
          <SolidButton
            title="Complete order"
            width={250}
            onPress={handleCompleteOrderPress}
            disabled={isSubmitting ? true : false}
            marginTop={16}
          />
        </View>
      </ScrollView>
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
      {selectionType && (
        <SelectDialog
          items={selectionType === "country" ? countries : states}
          onItemSelect={handleItemSelect}
          name={selectionType === "country" ? "country" : "state"}
        />
      )}
    </View>
  );
};

Grab.navigationOptions = ({ navigation }) => ({
  header: null
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  scrollView: {
    flex: 1
  },
  scrollViewContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 24
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: getPageContentWidthPercentage()
  },
  pageImage: {
    width: 100,
    height: 100,
    marginBottom: 16
  },
  pageText: {
    fontFamily: "roboto_light",
    marginBottom: 32,
    fontSize: 16
  }
});

export default Grab;
