import React from "react";
import { TouchableHighlight, Text, StyleSheet } from "react-native";

const SortingItem = React.memo(
  ({ sortMode, selectedSortModeId, onSortModeChange }) => {
    const handleSortModePress = () => {
      onSortModeChange(sortMode.id);
    };

    return (
      <TouchableHighlight
        style={
          sortMode.id === selectedSortModeId ? styles.tagActive : styles.tag
        }
        underlayColor="#FF6363"
        onPress={handleSortModePress}
      >
        <Text
          style={
            sortMode.id === selectedSortModeId
              ? styles.tagTitleActive
              : styles.tagTitle
          }
        >
          {sortMode.name}
        </Text>
      </TouchableHighlight>
    );
  }
);

const styles = StyleSheet.create({
  tag: {
    borderRadius: 15,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    borderWidth: 1,
    borderColor: "#FF6363",
    marginRight: 4
  },
  tagActive: {
    borderRadius: 15,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    borderWidth: 1,
    backgroundColor: "#FF6363",
    borderColor: "#FF6363",
    marginRight: 4
  },
  tagTitle: {
    color: "#FF6363",
    fontSize: 12,
    fontFamily: "roboto_medium"
  },
  tagTitleActive: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "roboto_medium"
  }
});

export default SortingItem;
