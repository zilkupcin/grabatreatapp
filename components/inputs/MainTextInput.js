import React from "react";
import { TextInput, StyleSheet } from "react-native";

const MainTextInput = ({
  placeholder,
  marginTop,
  marginBottom,
  type,
  isSecure,
  value,
  onChange,
  name,
  editable
}) => {
  const handleInputChange = text => {
    onChange(name, text);
  };

  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#333"
      textContentType={type}
      value={value}
      autoCapitalize="none"
      editable={editable}
      selectionColor={"#FF6363"}
      style={[
        styles.textInput,
        { marginTop: marginTop, marginBottom: marginBottom }
      ]}
      secureTextEntry={isSecure}
      onChangeText={handleInputChange}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderColor: "#333",
    borderBottomWidth: 1,
    alignSelf: "stretch"
  }
});

export default MainTextInput;
