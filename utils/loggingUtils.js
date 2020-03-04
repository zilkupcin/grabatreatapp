import Parse from "parse/react-native";

export const logError = async error => {
  try {
    await Parse.Cloud.run("logError", {
      error: error
    });
  } catch (e) {}
};
