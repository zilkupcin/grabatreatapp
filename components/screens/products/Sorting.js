import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import TextLabel from "../../text/TextLabel";
import { sortModes } from "../../../data/sortModes";
import SortingItem from "./SortingItem";

const Sorting = React.memo(({ onSortModeChange, selectedSortModeId }) => {
  return (
    <View style={styles.container}>
      <TextLabel title="sort by:" marginBottom={16} />
      <ScrollView
        horizontal={true}
        style={styles.scrollView}
        showsHorizontalScrollIndicator={false}
      >
        {sortModes.map(sortMode => {
          return (
            <SortingItem
              selectedSortModeId={selectedSortModeId}
              sortMode={sortMode}
              onSortModeChange={onSortModeChange}
              key={sortMode.id}
            />
          );
        })}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomColor: "#DEDEDE",
    borderBottomWidth: 1
  },
  scrollView: {
    flexGrow: 0,
    alignSelf: "flex-start",
    marginBottom: 16
  },
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
export default Sorting;
