import {
  AUTH_LOADING,
  AUTH_LOADING_FAIL,
  AUTH_LOADING_SUCCESS,
  AUTH_CHECK,
  RESOLVE_PASSWORD,
  INIT,
} from "./constant";

export default (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case INIT:
      return { ...state, ...payload };
    case AUTH_LOADING:
      return { ...state, isLoading: true };
    case AUTH_CHECK:
      return { ...state, isSetPassword: true };
    case AUTH_LOADING_SUCCESS:
      return { ...state, isLoading: false, isAuthenticated: false, isSetPassword: true };
    case RESOLVE_PASSWORD:
      return { ...state, isAuthenticated: true };
    case AUTH_LOADING_FAIL:
      return { ...state, ...payload };
    default:
      return state;
  }
};
