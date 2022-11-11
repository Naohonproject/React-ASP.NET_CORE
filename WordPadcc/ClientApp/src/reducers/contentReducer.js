import { INIT, CHANGE_URL } from "./constant";

export default (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case INIT:
      return { ...state, ...payload };
    case CHANGE_URL:
      return { ...state, ...payload };
    default:
      break;
  }
};
