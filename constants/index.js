import { SHOPIFY_ENDPOINT, GEOLOCATION_ENDPOINT } from "react-native-dotenv";

export const dialogActions = {
  DIALOG_ACTION_DO_NOTHING: 0,
  DIALOG_ACTION_EXIT: 1,
  DIALOG_ACTION_GO_BACK: 2,
  DIALOG_ACTION_LINK_TO_STORE: 3,
  DIALOG_ACTION_ACCEPT_THEOREM_NOTICE: 4,
  DIALOG_ACTION_ACCEPT_POLLFISH_NOTICE: 5,
  DIALOG_ACTION_OFFER_WARNING: 6,
  DIALOG_ACTION_COMPLETE_ORDER: 7,
  DIALOG_ACTION_PASSWORD_RESET_SUCCESS: 8,
  DIALOG_ACTION_COMPLETE_PROFILE: 9,
  DIALOG_GRAB_SIZING_PROMPT_ACCEPTED: 10,
  DIALOG_GRAB_SIZING_PROMPT_DECLINED: 11,
  DIALOG_GRAB_SHIPPING_DELAY_PROMPTED: 12
};

export const dialogTypes = {
  GRAB_TYPE_NOT_SELECTED: 0,
  GRAB_NOT_ENOUGH_POINTS: 1,
  GRAB_PROFILE_INCOMPLETE: 2,
  GRAB_CHECK_SIZING: 3,
  GRAB_SHIPPING_DELAY: 4
};

export const features = {
  FEATURE_RATE_US: "FEATURE_RATE_US",
  FEATURE_INVITE: "FEATURE_INVITE",
  FEATURE_TUTORIAL: "FEATURE_TUTORIAL"
};

export const errorMessages = {
  ERROR_USERNAME_BLANK: "Username cannot be blank",
  ERROR_USERNAME_SPACES: "Username must not contain any spaces",
  ERROR_PASSWORD_BLANK: "Password cannot be blank",
  ERROR_PASSWORD_SPACES: "Password must not contain any spaces",
  ERROR_EMAIL_BLANK: "Email cannot be blank",
  ERROR_EMAIL_SPACES: "Email must not contain any spaces",
  ERROR_USERNAME_SHORT: "Username must be at least 6 characters long",
  ERROR_PASSWORD_SHORT: "Password must be at least 6 characters long",
  ERROR_PASSWORD_MISMATCH: "Entered passwords do not match",
  ERROR_WRONG_EMAIL_FORMAT: "Please enter a valid email address",
  ERROR_EMAIL_GDPR: "Your username shouldn't be an email address",
  ERROR_TOS_NOT_ACCEPTED:
    "You must agree with the Terms of Service and our Privacy Policy to use the app.",
  ERROR_REFRESH_WAIT: "You can only refresh once in every 10 seconds.",
  ERROR_FAVORITES_EMPTY: "You haven't added any favorites yet!",
  ERROR_NO_OFFERS:
    "Unfortunately, there is nothing available in this category right now",
  ERROR_SUPPORT_CONTACTED:
    "You've already submitted a support ticket for this task",
  ERROR_SUPPORT_NOT_AVAILABLE_YET:
    "You can submit a support ticket 24 hours after you've completed the task",
  ERROR_RESET_INVALID_EMAIL:
    "No user found with this email address. Could you have registered with a different email address?"
};

export const apiEndpoints = {
  SHOPIFY: SHOPIFY_ENDPOINT,
  IPGEOLOCATION: GEOLOCATION_ENDPOINT
};

export const offerTypes = {
  OFFER: "OFFER",
  OFFER_CPI: "OFFER_CPI",
  OFFER_SURVEY: "OFFER_SURVEY",
  OFFER_QUIZ: "OFFER_QUIZ",
  OFFER_OFFERWALL: "OFFER_OFFERWALL",
  OFFER_INVALID: "OFFER_INVALID",
  OFFER_VIDEO: "OFFER_VIDEO",
  OFFER_COMPLETED: "OFFER_COMPLETED",
  OFFER_TASK: "OFFER_TASK",
  OFFER_SUPPORT: "OFFER_SUPPORT"
};

export const extraOfferTabs = {
  QUIZES: {
    title: "Quizzes",
    type: offerTypes.OFFER_QUIZ
  }
};

export const actionIcons = {
  ICON_FAVORITE: "ICON_FAVORITE",
  ICON_REFRESH: "ICON_REFRESH"
};

export const strings = {
  SUPPORT_PAGE_HEADER:
    "Depending on the type of task, if you don't receive your points for over 24 hours, you may be able to submit a support ticket for the advertising network to review your task completion.\n\nIf the offer you've completed qualifies, you will see it in this list after 24 hours have passed since you've started completing the offer.\n\nPlease only submit tickets for offers you've actually completed because you might be asked for proof of completion - such as a screenshot of the completion page.",
  SUPPORT_DIALOG_MESSAGE:
    "Please enter your name, email address and the date when you completed the task so we can forward them to the network that provides the offer (AdscendMedia).",
  SUPPORT_SUCCESS: "Thank you, AdscendMedia will be in touch with you.",
  NOTICE_THEOREM:
    "TheoremReach may ask you a few questions just to set up your survey profile, after that you will have access to all the amazing surveys!\n\nIf nothing happens after this dialog, please try tapping on the task again",
  NOTICE_POLLFISH:
    "Pollfish may ask you a few questions just to set up your survey profile, after that you will have access to all the amazing surveys!\n\nIf nothing happens after this dialog, please try tapping on the task again",
  NOTICE_OFFER:
    "If by any chance an offer takes you to a different offer before or after it's completion - don't try to complete it as this means that the advertiser's offer link is broken and it won't award you any points!\n\nPlease make sure you only complete the offer you originally chose to complete.",
  ENTER_CODE_REWARD_MESSAGE:
    "Enter someone's invitation code and get 20 points!",
  INVITE_MESSAGE:
    "Refer a friend and whenever they earn points, get 10% of what they earn added to your account!",
  ORDER_ARRIVAL_NOTICE:
    "Orders usually arrive within 35 - 60 days after your order has been confirmed.",
  ORDER_NO_TREATS: "You haven't ordered any treats yet!",
  SUPPORT_PAGE_DESCRIPTION:
    "Just email us and we'll reply to you within 48 hours.\n\nEmail us at:",
  PROFILE_INCOMPLETE_MESSAGE:
    "It looks like you haven't set an email address and password yet. We ask you to do this so you don't lose access to your account. You'll also get 20 points!",
  GRAB_SHIPPING_DELAY:
    "We're experiencing major delays with our freebie suppliers. This means the item may arrive in up to 65 - 90 Days instead of normal 35 - 60 Days delivery time frame. We're not sure how long the delays may last, but it could last until the end of February.\n\n Sorry for any inconvenience"
};
