import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

const OutlineButtonReversed = React.memo(
  ({
    title,
    action,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    width,
    stretch,
    onPress,
    disabled,
    center
  }) => {
    const handleButtonPress = () => {
      onPress(action);
    };

    const getButtonStyle = () => {
      const mainStyle = disabled ? styles.buttonDisabled : styles.button;
      const additionalStyle = {
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        width: width ? width : "auto",
        alignSelf: stretch && !width ? "stretch" : "auto",
        flex: stretch || width ? 0 : 1,
        alignSelf: center ? "center" : "auto"
      };
      return [mainStyle, additionalStyle];
    };

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        delayPressIn={0}
        disabled={disabled ? true : false}
        style={getButtonStyle()}
        onPress={handleButtonPress}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    backgroundColor: "#FF6363",
    borderColor: "#FF6363",
    borderWidth: 1
  },
  buttonDisabled: {
    opacity: 0.5,
    borderRadius: 20,
    backgroundColor: "#FF6363",
    borderColor: "#FF6363",
    borderWidth: 1
  },
  buttonText: {
    color: "#fff",
    paddingTop: 12,
    paddingBottom: 12,
    textAlign: "center",
    fontFamily: "roboto_medium"
  }
});

export default OutlineButtonReversed;
