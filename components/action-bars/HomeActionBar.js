import React from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native";

const heartIcon = require("../../images/heart_red.png");
const refreshIcon = require("../../images/refresh.png");

const HomeActionBar = React.memo(({ onFavouritesPress, points, onRefresh }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={[styles.button, styles.favoritesButton]}
        onPress={onFavouritesPress}
      >
        <Image style={styles.buttonImage} source={heartIcon} />
      </TouchableOpacity>
      <View>
        <Text style={styles.balanceText}>Your balance</Text>
        <Text style={styles.pointsText}>
          {points} <Text style={styles.pointsLabel}>Points!</Text>
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.button, styles.refreshButton]}
        onPress={onRefresh}
      >
        <Image style={styles.buttonImage} source={refreshIcon} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16
  },
  button: {
    backgroundColor: "#FFD4D4",
    borderRadius: 16,
    padding: 8
  },
  buttonImage: {
    width: 16,
    height: 16
  },
  refreshButton: {
    marginRight: 16
  },
  favoritesButton: {
    marginLeft: 16
  },
  balanceText: {
    letterSpacing: 3,
    textTransform: "uppercase",
    fontSize: 16,
    fontFamily: "roboto_medium"
  },
  pointsText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18
  },
  pointsLabel: {
    fontWeight: "normal"
  }
});

export default HomeActionBar;
