import React from "react";
import {
  Modal,
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";

const SelectDialog = ({ items, onItemSelect, name }) => {
  const handleItemSelect = item => {
    onItemSelect(name, item);
  };

  const getItemValue = item => {
    if (name === "country") {
      return item.name;
    } else if (name === "state") {
      return item;
    }
  };

  const SelectDialogItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleItemSelect(item)} delayPressIn={0}>
        <Text style={styles.itemName}>{getItemValue(item)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="fade"
      visible={true}
      transparent={false}
      backgroundColor="transparent"
    >
      <View style={styles.container}>
        <View style={styles.dialogBox}>
          <FlatList
            data={items}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => <SelectDialogItem item={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  dialogBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 24,
    minWidth: 200,
    maxWidth: 600,
    maxHeight: 400,
    margin: 16,
    flexDirection: "column",
    alignItems: "center"
  },
  itemName: {
    fontSize: 20,
    paddingTop: 8,
    paddingBottom: 8
  }
});

export default SelectDialog;
