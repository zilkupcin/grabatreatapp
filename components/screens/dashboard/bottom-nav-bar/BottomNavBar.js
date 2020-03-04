import React from "react";
import { View, StyleSheet } from "react-native";
import BottomNavBarItem from "./BottomNavBarItem";
import { bottomNavItems } from "../../../../data/bottomNavItems";

const BottomNavBar = React.memo(
  ({ selectedTab, consentRequired, onTabChange }) => {
    //Remove the Privacy Settings option if not from Europe
    if (!consentRequired && bottomNavItems[3].title === "Privacy") {
      bottomNavItems.splice(3, 1);
      bottomNavItems[3].id = 3;
    }

    return (
      <View style={styles.container}>
        <View style={styles.bottomNavBar}>
          {bottomNavItems.map(item => {
            return (
              <BottomNavBarItem
                key={item.title}
                item={item}
                isSelected={item.id === selectedTab ? true : false}
                onTabChange={onTabChange}
              />
            );
          })}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: "#fff",
    flex: 2,
    flexDirection: "row"
  },
  bottomNavBar: {
    width: "100%",
    flexDirection: "row"
  }
});

export default BottomNavBar;
