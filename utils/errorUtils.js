import { dialogActions } from "../constants";

export const parseError = error => {
  return {
    title: "Error!",
    message: error.message,
    positiveAction: {
      title: "Ok",
      actionType: dialogActions.DIALOG_ACTION_DO_NOTHING
    }
  };
};
