import React from "react";
import {
  Modal,
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";
import ImageZoom from "react-native-image-pan-zoom";

const backIcon = require("../../images/arrow_back_white.png");

const ImageZoomDialog = ({ onBackPress, imageSrc }) => {
  return (
    <Modal
      animationType="fade"
      visible={true}
      transparent={false}
      backgroundColor="transparent"
    >
      <View style={styles.container}>
        <View style={styles.navContainer}>
          <TouchableOpacity onPress={onBackPress}>
            <Image source={backIcon} style={styles.backIcon} />
          </TouchableOpacity>
        </View>
        <ImageZoom
          cropWidth={Dimensions.get("window").width}
          cropHeight={Dimensions.get("window").height}
          imageWidth={200}
          imageHeight={200}
          maxScale={2}
          style={styles.imageZoom}
        >
          <Image
            style={{ width: 200, height: 200 }}
            source={{ uri: imageSrc }}
          />
        </ImageZoom>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,1)",
    position: "relative"
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    padding: 12
  },
  imageZoom: {
    flex: 1
  },
  backIcon: {
    width: 25,
    height: 25
  }
});

export default ImageZoomDialog;
