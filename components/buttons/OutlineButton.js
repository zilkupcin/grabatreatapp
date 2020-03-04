import React, { useState } from "react";
import { TouchableHighlight, StyleSheet, Text } from "react-native";

const OutlineButton = React.memo(
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
    disabled
  }) => {
    const [buttonPressed, setButtonPressed] = useState(false);

    const onShowUnderlay = () => {
      setButtonPressed(true);
    };

    const onHideUnderlay = () => {
      setButtonPressed(false);
    };

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
        flex: stretch || width ? 0 : 1
      };
      return [mainStyle, additionalStyle];
    };

    return (
      <TouchableHighlight
        activeOpacity={1}
        delayPressIn={0}
        disabled={disabled ? true : false}
        style={getButtonStyle()}
        onPress={handleButtonPress}
        underlayColor="#ff6363"
        onShowUnderlay={onShowUnderlay}
        onHideUnderlay={onHideUnderlay}
      >
        <Text
          style={buttonPressed ? styles.buttonTextPressed : styles.buttonText}
        >
          {title}
        </Text>
      </TouchableHighlight>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    backgroundColor: "#fff",
    borderColor: "#FF6363",
    borderWidth: 1
  },
  buttonDisabled: {
    opacity: 0.5,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderColor: "#FF6363",
    borderWidth: 1
  },
  buttonText: {
    color: "#FF6363",
    paddingTop: 12,
    paddingBottom: 12,
    textAlign: "center",
    fontFamily: "roboto_medium"
  },
  buttonTextPressed: {
    color: "#fff",
    paddingTop: 12,
    paddingBottom: 12,
    textAlign: "center",
    fontFamily: "roboto_medium"
  }
});

export default OutlineButton;
