import React from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Clipboard
} from "react-native";
import PageActionBar from "../../action-bars/PageActionBar";
import OutlineButton from "../../buttons/OutlineButton";
import { strings } from "../../../constants";
import Snackbar from "react-native-snackbar";
import { getPageContentWidthPercentage } from "../../../utils/dimensUtils";

const announcementIcon = require("../../../images/announcement.png");

const Invite = React.memo(({ navigation }) => {
  const invitationCode = navigation.getParam("invitationCode");

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCopyCode = () => {
    Clipboard.setString(invitationCode);
    showSnackbar();
  };

  const showSnackbar = () => {
    Snackbar.show({
      title: "Code copied!",
      duration: Snackbar.LENGTH_SHORT
    });
  };

  return (
    <View style={styles.container}>
      <PageActionBar
        hasParent={true}
        title="Refer a friend"
        onBackPress={handleBackPress}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        <View style={styles.contentContainer}>
          <Image style={styles.pageImage} source={announcementIcon} />
          <Text style={styles.pageTitle}>Tell a friend about us!</Text>
          <Text style={styles.pageMessage}>{strings.INVITE_MESSAGE}</Text>
          <Text style={styles.invitationCode}>{invitationCode}</Text>
          <OutlineButton
            title="Copy code!"
            onPress={handleCopyCode}
            width={250}
          />
        </View>
      </ScrollView>
    </View>
  );
});

Invite.navigationOptions = ({ navigation }) => ({
  header: null
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  scrollViewContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    flex: 1
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: getPageContentWidthPercentage()
  },
  pageImage: {
    width: 100,
    height: 100
  },
  pageTitle: {
    fontSize: 20,
    marginBottom: 24,
    marginTop: 24
  },
  pageMessage: {
    fontFamily: "roboto_light",
    fontSize: 16
  },
  invitationCode: {
    fontWeight: "bold",
    fontSize: 20,
    paddingTop: 16,
    paddingBottom: 24
  }
});

export default Invite;
