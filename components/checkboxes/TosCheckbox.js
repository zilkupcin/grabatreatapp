import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { CheckBox } from "react-native-elements";
import { Linking } from "expo";

const TosCheckBox = ({ tosAccepted, onCheck }) => {
  return (
    <View style={styles.checkboxContainer}>
      <CheckBox
        checked={tosAccepted}
        containerStyle={styles.checkBox}
        onPress={onCheck}
        uncheckedColor="#FF6363"
        checkedColor="#FF6363"
        checkedIcon="check-circle"
        uncheckedIcon="circle-o"
      />
      <Text style={styles.termsText}>
        {`I agree with the `}
        <Text
          onPress={() => Linking.openURL("http://grabatreat.com/terms.html")}
          style={styles.hyperlink}
        >
          {` Terms of Service `}
        </Text>
        {`and the `}
        <Text
          style={styles.hyperlink}
          onPress={() => Linking.openURL("http://grabatreat.com/privacy.html")}
        >
          Privacy Policy
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  checkBox: {
    marginLeft: 0,
    marginTop: 0,
    marginRight: 8,
    marginBottom: 0,
    padding: 0
  },
  termsText: {
    flex: 1
  },
  hyperlink: {
    color: "#FF6363"
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start"
  }
});

export default TosCheckBox;
