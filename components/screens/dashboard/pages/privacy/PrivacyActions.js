import React from "react";
import { View, StyleSheet, TouchableHighlight, Text } from "react-native";

const PrivacyActions = ({ hasAgreed, onSettingChange }) => {
  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={[styles.agreeButton, hasAgreed && styles.btnActive]}
        underlayColor="#FF6363"
        onPress={() => onSettingChange(true)}
      >
        <Text style={[styles.text, hasAgreed && styles.textHighlighted]}>
          Agree
        </Text>
      </TouchableHighlight>
      <TouchableHighlight
        onPress={() => onSettingChange(false)}
        underlayColor="#FF6363"
        style={[styles.disagreeButton, !hasAgreed && styles.btnActive]}
      >
        <Text style={[styles.text, !hasAgreed && styles.textHighlighted]}>
          Disagree
        </Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "60%",
    alignSelf: "center"
  },
  agreeButton: {
    flex: 1,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    borderWidth: 1,
    borderColor: "#FF6363",
    padding: 8
  },
  btnActive: {
    backgroundColor: "#FF6363"
  },
  disagreeButton: {
    flex: 1,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 1,
    borderColor: "#FF6363",
    padding: 8
  },
  textHighlighted: {
    textAlign: "center",
    fontFamily: "roboto_medium",
    color: "#fff"
  },
  text: {
    textAlign: "center",
    color: "#FF6363",
    fontFamily: "roboto_medium"
  }
});

export default PrivacyActions;
