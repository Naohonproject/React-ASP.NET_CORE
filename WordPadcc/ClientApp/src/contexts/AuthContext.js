import axios from "axios";
import { createContext, useReducer, useContext } from "react";

import authReducer from "../reducers/authReducer";
import {
  AUTH_LOADING,
  AUTH_LOADING_SUCCESS,
  AUTH_LOADING_FAIL,
  RESOLVE_PASSWORD,
  SET_PASSWORD,
} from "../reducers/constant";
import { ModalContext } from "./ModalContext";

export const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const { dispatch, content } = useContext(ModalContext);
  const [auth, authDispatch] = useReducer(authReducer, {
    isLoading: false,
    isAuthenticated: null,
    isSetPassword: false,
    errorMessage: "",
  });
  const setPassword = async (id, password) => {
    try {
      authDispatch({ type: AUTH_LOADING });
      if (id === "") {
        id = window.location.pathname.removeCharAt(1);
      }
      const res = await axios.put(`/api/password/${id}`, { UserPassword: password });
      console.log(res);
      if ((res.data.message = "not found")) {
        dispatch({ type: SET_PASSWORD, payload: { Password: password } });
        authDispatch({ type: AUTH_LOADING_SUCCESS });
      } else {
        authDispatch({ type: AUTH_LOADING_SUCCESS });
      }
      return res;
    } catch (error) {
      authDispatch({ type: AUTH_LOADING_FAIL, payload: { errorMessage: error.response } });
    }
  };

  const resolvePassword = async (id, password) => {
    try {
      const res = await axios.post(`/api/auth/${id}`, { UserPassword: password });
      if (res.data.isAuth) {
        authDispatch({ type: RESOLVE_PASSWORD });
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