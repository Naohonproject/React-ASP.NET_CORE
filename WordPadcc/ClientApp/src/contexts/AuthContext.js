import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

import authReducer from "../reducers/authReducer";
import {
  AUTH_LOADING,
  AUTH_LOADING_SUCCESS,
  AUTH_LOADING_FAIL,
  RESOLVE_PASSWORD,
} from "../reducers/constant";
import { ModalContext } from "../contexts/ModalContext";

export const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const navigate = useNavigate();
  const [auth, authDispatch] = useReducer(authReducer, {
    isLoading: false,
    isAuthenticated: null,
    isSetPassword: false,
    errorMessage: "",
  });

  const {
    content: { Url },
  } = useContext(ModalContext);

  // useEffect(() => {
  //   if (auth.isAuthenticated) {
  //     navigate(`/${Url}`);
  //   }
  // }, [auth.isAuthenticated]);

  const setPassword = async (id, password) => {
    try {
      authDispatch({ type: AUTH_LOADING });
      const res = await axios.put(`/api/password/${id}`, { UserPassword: password });
      authDispatch({ type: AUTH_LOADING_SUCCESS });
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
    } catch (error) {}
  };

  const authContextData = { auth, setPassword, authDispatch, resolvePassword };
  return <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
