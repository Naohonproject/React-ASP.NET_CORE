import { UPDATE_FAIL, CHANGE_SUCCESS, IS_LOADING, RESET } from "./constant";

export default (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case IS_LOADING:
      return { ...state, isLoading: true };
    case CHANGE_SUCCESS:
      return { ...state, isLoading: false, errorMessage: "" };
    case UPDATE_FAIL:
      return { ...state, isLoading: false, ...payload };
    case RESET:
      return { ...state, isLoading: false, errorMessage: "" };
    default:
      return state;
  }
};
