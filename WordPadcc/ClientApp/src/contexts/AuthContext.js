import axios from "axios";
import { createContext, useReducer, useContext } from "react";

import authReducer from "../reducers/authReducer";
import {
  IS_LOADING,
  AUTH_LOADING_SUCCESS,
  RESOLVE_PASSWORD_SUCCESS,
  RESOLVE_PASSWORD_FAIL,
  SET_PASSWORD,
  UPDATE_FAIL,
} from "../reducers/constant";
import { ModalContext } from "./ModalContext";

export const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const { dispatch, dispatchMessage } = useContext(ModalContext);
  const [auth, authDispatch] = useReducer(authReducer, {
    isAuthenticated: null,
    isSetPassword: false,
    errorMessage: "",
  });

  const setPassword = async (url, password) => {
    try {
      dispatchMessage({ type: IS_LOADING });

      if (url === "") {
        url = window.location.pathname.removeCharAt(1);
      }

      const res = await axios.put(`/api/notes/${url}/update-password`, { UserPassword: password });

      if (res.data.status === false) {
        if (res.data.errorMessage === "not found") {
          dispatch({ type: SET_PASSWORD, payload: { Password: password } });
          authDispatch({ type: AUTH_LOADING_SUCCESS });
          return true;
        } else {
          setTimeout(() => {
            dispatchMessage({
              type: UPDATE_FAIL,
              payload: { errorMessage: res.data.errorMessage },
            });
            return false;
          }, 1000);
        }
      } else {
        authDispatch({ type: AUTH_LOADING_SUCCESS });
        return true;
      }
    } catch (error) {}
  };

  const resolvePassword = async (url, password) => {
    try {
      const res = await axios.post(`/api/notes/${url}/auth-note`, { UserPassword: password });
      if (res.data.isAuth) {
        authDispatch({ type: RESOLVE_PASSWORD_SUCCESS });
      } else {
        authDispatch({ type: RESOLVE_PASSWORD_FAIL, payload: { errorMessage: res.data.message } });
      }
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const authContextData = { auth, setPassword, authDispatch, resolvePassword };
  return <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
