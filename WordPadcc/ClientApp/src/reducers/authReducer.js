import {
  AUTH_LOADING_SUCCESS,
  AUTH_CHECK,
  RESOLVE_PASSWORD,
  INIT,
  RESET_PASSWORD,
} from "./constant";

export default (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case INIT:
      return { ...state, ...payload };
    case AUTH_CHECK:
      return { ...state, isSetPassword: true };
    case RESET_PASSWORD:
      return { ...state, isSetPassword: false };
    case AUTH_LOADING_SUCCESS:
      return { ...state, isAuthenticated: false, isSetPassword: true };
    case RESOLVE_PASSWORD:
      return { ...state, isAuthenticated: true };
    default:
      return state;
  }
};
