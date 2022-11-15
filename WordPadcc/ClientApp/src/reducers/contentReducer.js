import { INIT, CHANGE_URL, UPDATE_CONTENT, SET_PASSWORD, RESET_PASSWORD } from "./constant";

export default (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case INIT:
      return { ...state, ...payload };
    case CHANGE_URL:
      return { ...state, ...payload };
    case UPDATE_CONTENT:
      return { ...state, ...payload };
    case SET_PASSWORD:
      return { ...state, ...payload };
    case RESET_PASSWORD:
      return { ...state, Password: "" };
    default:
      return state;
  }
};
