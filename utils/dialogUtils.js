import { dialogActions, dialogTypes, strings } from "../constants";

export const buildParseError = message => {
  return {
    title: "Error",
    message: message,
    positiveAction: {
      title: "Ok",
      actionType: dialogActions.DIALOG_ACTION_DO_NOTHING
    }
  };
};

export const buildAppVersionError = message => {
  return {
    title: "Error",
    message: message,
    positiveAction: {
      title: "Ok",
      actionType: dialogActions.DIALOG_ACTION_LINK_TO_STORE
    }
  };
};

export const buildGeneralError = message => {
  return {
    title: "Error",
    message: message,
    positiveAction: {
      title: "Ok",
      actionType: dialogActions.DIALOG_ACTION_DO_NOTHING
    }
  };
};

export const buildGeneralAlert = (title, message, action) => {
  return {
    title: title,
    message: message,
    positiveAction: {
      title: "Ok",
      actionType: action
    }
  };
};

export const buildDecisionAlert = (
  title,
  message,
  positiveAction,
  negativeAction
) => {
  return {
    title: title,
    message: message,
    positiveAction: {
      title: "Yes",
      actionType: positiveAction
    },
    negativeAction: {
      title: "No",
      actionType: negativeAction
    }
  };
};

export const getDialog = dialogType => {
  switch (dialogType) {
    case dialogTypes.GRAB_TYPE_NOT_SELECTED:
      return buildGeneralAlert(
        "Oops!",
        "Please select the type of the freebie",
        dialogActions.DIALOG_ACTION_DO_NOTHING
      );
    case dialogTypes.GRAB_NOT_ENOUGH_POINTS:
      return buildGeneralAlert(
        "Oops!",
        "You don't have enough points yet!",
        dialogActions.DIALOG_ACTION_DO_NOTHING
      );
    case dialogTypes.GRAB_PROFILE_INCOMPLETE:
      return buildGeneralAlert(
        "Hi!",
        strings.PROFILE_INCOMPLETE_MESSAGE,
        dialogActions.DIALOG_ACTION_COMPLETE_PROFILE
      );
    case dialogTypes.GRAB_CHECK_SIZING:
      return buildDecisionAlert(
        "One more thing...",
        "Have you checked the sizing chart and selected the correct size?",
        dialogActions.DIALOG_GRAB_SIZING_PROMPT_ACCEPTED,
        dialogActions.DIALOG_GRAB_SIZING_PROMPT_DECLINED
      );
    case dialogTypes.GRAB_SHIPPING_DELAY:
      return buildGeneralAlert(
        "Important!",
        strings.GRAB_SHIPPING_DELAY,
        dialogActions.DIALOG_GRAB_SHIPPING_DELAY_PROMPTED
      );
    default:
      break;
  }
};
