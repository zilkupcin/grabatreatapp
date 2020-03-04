import React from "react";
import { TextInput, StyleSheet, TouchableOpacity } from "react-native";

const PressableTextInput = ({
  placeholder,
  marginTop,
  marginBottom,
  value,
  onChange,
  name,
  onPress
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#333"
        textContentType="none"
        value={value}
        editable={false}
        style={[
          styles.textInput,
          { marginTop: marginTop, marginBottom: marginBottom }
        ]}
        onChangeText={text => onChange(name, text)}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    alignSelf: "stretch"
  },
  textInput: {
    borderColor: "#333",
    borderBottomWidth: 1
  }
});

export default PressableTextInput;
