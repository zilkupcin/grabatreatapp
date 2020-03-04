import { errorMessages, dialogActions } from "../constants";

export const checkInputSignIn = (username, password) => {
  if (username.length === 0) {
    return {
      title: "Error",
      message: errorMessages.ERROR_USERNAME_BLANK,
      positiveAction: {
        title: "Ok",
        actionType: dialogActions.DIALOG_ACTION_DO_NOTHING
      }
    };
  } else if (password.length === 0) {
    return {
      title: "Error",
      message: errorMessages.ERROR_PASSWORD_BLANK,
      positiveAction: {
        title: "Ok",
        actionType: dialogActions.DIALOG_ACTION_DO_NOTHING
      }
    };
  }
};

export const checkInputRegistration = (
  username,
  password,
  repeatPassword,
  gdprRequired,
  consentGiven,
  tosAccepted
) => {
  if (username.length < 6) {
    return {
      title: "Error",
      message: errorMessages.ERROR_USERNAME_SHORT,
      positiveAction: {
        title: "Ok",
        actionType: dialogActions.DIALOG_ACTION_DO_NOTHING
      }
    };
  } else if (gdprRequired && !consentGiven && username.includes("@")) {
    return {
      title: "Error",
      message: errorMessages.ERROR_EMAIL_GDPR,
      positiveAction: {
        title: "Ok",
        actionType: dialogActions.DIALOG_ACTION_DO_NOTHING
      }
    };
  } else if (username.includes(" ")) {
    return {
      title: "Error",
      message: errorMessages.ERROR_USERNAME_SPACES,
      positiveAction: {
        title: "Ok",
        actionType: dialogActions.DIALOG_ACTION_DO_NOTHING
      }
    };
  } else if (
    ((gdprRequired && consentGiven) || !gdprRequired) &&
    !username.includes("@")
  ) {
    return {
      title: "Error",
      message: errorMessages.ERROR_WRONG_EMAIL_FORMAT,
      positiveAction: {
        title: "Ok",
        actionType: dialogActions.DIALOG_ACTION_DO_NOTHING
      }
    };
  } else if (password.length < 6) {
    return {
      title: "Error",
      message: errorMessages.ERROR_PASSWORD_SHORT,
      positiveAction: {
        title: "Ok",
        actionType: dialogActions.DIALOG_ACTION_DO_NOTHING
      }
    };
  } else if (password.includes(" ")) {
    return {
      title: "Error",
      message: errorMessages.ERROR_PASSWORD_SPACES,
      positiveAction: {
        title: "Ok",
        actionType: dialogActions.DIALOG_ACTION_DO_NOTHING
      }
    };
  } else if (password !== repeatPassword) {
    return {
      title: "Error",
      message: errorMessages.ERROR_PASSWORD_MISMATCH,
      positiveAction: {
        title: "Ok",
        actionType: dialogActions.DIALOG_ACTION_DO_NOTHING
      }
    };
  } else if (!tosAccepted) {
    return {
      title: "Error",
      message: errorMessages.ERROR_TOS_NOT_ACCEPTED,
      positiveAction: {
        title: "Ok",
        actionType: dialogActions.DIALOG_ACTION_DO_NOTHING
      }
    };
  }
};

export const checkInputCompleteProfile = (
  emailAddress,
  password,
  repeatPassword
) => {
  if (!emailAddress.includes("@") || emailAddress.includes(" ")) {
    return {
      title: "Error",
      message: errorMessages.ERROR_WRONG_EMAIL_FORMAT,
      positiveAction: {
        title: "Ok",
        actionType: dialogActions.DIALOG_ACTION_DO_NOTHING
      }
    };
  } else if (emailAddress === "") {
    return {
      title: "Error",
      message: errorMessages.ERROR_EMAIL_BLANK,
      positiveAction: {
        title: "Ok",
        actionType: dialogActions.DIALOG_ACTION_DO_NOTHING
      }
    };
  } else if (password.length < 6) {
    return {
      title: "Error",
      message: errorMessages.ERROR_PASSWORD_SHORT,
      positiveAction: {
        title: "Ok",
        actionType: dialogActions.DIALOG_ACTION_DO_NOTHING
      }
    };
  } else if (password.includes(" ")) {
    return {
      title: "Error",
      message: errorMessages.ERROR_PASSWORD_SPACES,
      positiveAction: {
        title: "Ok",
        actionType: dialogActions.DIALOG_ACTION_DO_NOTHING
      }
    };
  } else if (password !== repeatPassword) {
    return {
      title: "Error",
      message: errorMessages.ERROR_PASSWORD_MISMATCH,
      positiveAction: {
        title: "Ok",
        actionType: dialogActions.DIALOG_ACTION_DO_NOTHING
      }
    };
  }
};

export const checkInputInvite = (invCode, userInvCode) => {
  if (invCode === "") {
    return "Invitation code cannot be blank";
  } else if (invCode === userInvCode) {
    return "You cannot enter your own invitation code";
  }
};

export const checkInputSupport = (name, email, date) => {
  if (name.length === 0) {
    return "Please enter your name";
  } else if (email.length === 0) {
    return "Please enter your email address";
  } else if (!email.includes("@")) {
    return "Please enter a valid email address";
  } else if (date.length === 0) {
    return "Please select a completion date";
  }
};

export const checkInputGrab = shippingInfo => {
  const {
    firstName,
    lastName,
    country,
    addressOne,
    city,
    state,
    zip
  } = shippingInfo;

  if (firstName === "") {
    return "Please enter your first name";
  } else if (firstName.includes("@")) {
    return "Your name should not be an email address";
  } else if (lastName === "") {
    return "Please enter your last name";
  } else if (country === "") {
    return "Please select your country";
  } else if (addressOne === "") {
    return "Please enter your address";
  } else if (city === "") {
    return "Please select your city";
  } else if (state === "") {
    return "Please select your state";
  } else if (zip === "") {
    return "Please enter your zip code";
  }
};

export const checkInputResetPassword = email => {
  if (email === "") {
    return "Please enter your email address";
  } else if (!email.includes("@")) {
    return "Incorrect email address format";
  }
};
