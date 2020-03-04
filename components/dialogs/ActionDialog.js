import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import OutlineButton from "../buttons/OutlineButton";

const ActionDialog = ({
  isVisible,
  onActionPress,
  positiveAction,
  negativeAction,
  title,
  message
}) => {
  const SingleAction = () => {
    return (
      <View style={styles.dialogActionContainer}>
        <OutlineButton
          title={positiveAction.title}
          action={positiveAction.actionType}
          onPress={onActionPress}
        />
      </View>
    );
  };

  const MultiAction = () => {
    return (
      <View style={styles.dialogActionContainer}>
        <OutlineButton
          marginRight={8}
          title={positiveAction.title}
          action={positiveAction.actionType}
          onPress={onActionPress}
        />
        <OutlineButton
          title={negativeAction.title}
          action={negativeAction.actionType}
          onPress={onActionPress}
          marginLeft={8}
        />
      </View>
    );
  };

  return (
    <Modal
      animationType="fade"
      visible={isVisible}
      transparent={false}
      backgroundColor="transparent"
    >
      <View style={styles.container}>
        <View style={styles.dialogBox}>
          <Text style={styles.dialogTitle}>{title}</Text>
          <Text style={styles.dialogMessage}>{message}</Text>
          {positiveAction && negativeAction ? (
            <MultiAction />
          ) : (
            <SingleAction />
          )}
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
  dialogActionContainer: {
    display: "flex",
    flexDirection: "row"
  },
  dialogTitle: {
    fontSize: 20
  },
  dialogMessage: {
    fontFamily: "roboto_light",
    fontSize: 16,
    marginBottom: 32,
    marginTop: 16,
    alignSelf: "center",
    textAlign: "center"
  }
});

export default ActionDialog;
