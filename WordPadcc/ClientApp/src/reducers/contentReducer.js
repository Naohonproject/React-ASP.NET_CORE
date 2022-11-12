import { INIT, CHANGE_URL, UPDATE_CONTENT } from "./constant";

export default (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case INIT:
      return { ...state, ...payload };
    case CHANGE_URL:
      return { ...state, ...payload };
    case UPDATE_CONTENT:
      console.log("test");
      return { ...state, ...payload };
    default:
      return state;
  }
};
