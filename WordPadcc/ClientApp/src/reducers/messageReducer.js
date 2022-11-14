import { CHANGE_URL_FAIL, CHANGE_URL_SUCCESS, IS_LOADING, RESET } from "./constant";

export default (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case IS_LOADING:
      return { ...state, isLoading: true };
    case CHANGE_URL_SUCCESS:
      return { ...state, isLoading: false, errorMessage: "" };
    case CHANGE_URL_FAIL:
      return { ...state, ...payload };
    case RESET:
      return { ...state, isLoading: false, errorMessage: "" };
    default:
      return state;
  }
};
