import {
  AUTH_LOADING_SUCCESS,
  AUTH_CHECK,
  RESOLVE_PASSWORD_SUCCESS,
  RESOLVE_PASSWORD_FAIL,
  INIT,
  RESET_PASSWORD,
  TYPING_PASSWORD,
} from "./constant";

export default (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case INIT:
      return { ...state, ...payload };
    case AUTH_CHECK:
      return { ...state, isSetPassword: true };
    case RESET_PASSWORD:
      console.log("RESET-PASSWORD");
      return { ...state, isSetPassword: false };
    case AUTH_LOADING_SUCCESS:
      return { ...state, isAuthenticated: false, isSetPassword: true };
    case RESOLVE_PASSWORD_FAIL:
      return { ...state, ...payload };
    case TYPING_PASSWORD:
      return { ...state, errorMessage: "" };
    case RESOLVE_PASSWORD_SUCCESS:
      return { ...state, isAuthenticated: true };
    default:
      return state;
  }
};
