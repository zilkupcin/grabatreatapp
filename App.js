import React, { Component } from "react";
import Welcome from "./components/screens/welcome/Welcome";
import SignIn from "./components/screens/sign-in/SignIn";
import Register from "./components/screens/register/Register";
import RegisterAuto from "./components/screens/register/RegisterAuto";
import Intro from "./components/screens/intro/Intro";
import FontLoader from "./components/font-loader/FontLoader";
import Dashboard from "./components/screens/dashboard/Dashboard";
import AuthLoader from "./components/auth-loader/AuthLoader";
import Favourites from "./components/screens/favourites/Favourites";
import Products from "./components/screens/products/Products";
import Earn from "./components/screens/earn/Earn";
import ProductDetails from "./components/screens/product-details/ProductDetails";
import ResetPassword from "./components/screens/reset-password/ResetPassword";
import Grab from "./components/screens/grab/Grab";
import Invite from "./components/screens/invite/Invite";
import EnterCode from "./components/screens/enter-code/EnterCode";
import Tutorial from "./components/screens/tutorial/Tutorial";
import CompleteProfile from "./components/screens/complete-profile/CompleteProfile";
import Parse from "parse/react-native";
import { fromRight } from "react-navigation-transitions";
import { APP_ID, CLIENT_KEY, SERVER_URL } from "react-native-dotenv";

const AsyncStorage = require("react-native").AsyncStorage;

Parse.setAsyncStorage(AsyncStorage);

Parse.initialize(APP_ID, CLIENT_KEY);
Parse.serverURL = SERVER_URL;

import {
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator
} from "react-navigation";

const AppStack = createStackNavigator(
  {
    Dashboard: Dashboard,
    Favourites: Favourites,
    Products: Products,
    Earn: Earn,
    ProductDetails: ProductDetails,
    Grab: Grab,
    Invite: Invite,
    EnterCode: EnterCode,
    Tutorial: Tutorial,
    CompleteProfile: CompleteProfile
  },
  {
    transitionConfig: () => fromRight()
  }
);
const AuthStack = createStackNavigator({
  Welcome: Welcome,
  SignIn: SignIn,
  Register: Register,
  RegisterAuto: RegisterAuto,
  Intro: Intro,
  ResetPassword: ResetPassword
});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoader: AuthLoader,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "AuthLoader",
      transitionConfig: () => fromRight()
    }
  )
);
