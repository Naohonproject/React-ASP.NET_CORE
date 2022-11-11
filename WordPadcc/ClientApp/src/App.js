import ModalContextProvider from "./contexts/ModalContext";
import "./App.css";
import Header from "./components/Header";
import Main from "./components/Main";
import CustomModal from "./components/Modals/Modal";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useContext, memo } from "react";
import { customAlphabet } from "nanoid";
import axios from "axios";

import { ModalContext } from "./contexts/ModalContext";
import { INIT } from "./reducers/constant";

const nanoid = customAlphabet("1234567890abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useContext(ModalContext);

  useEffect(() => {
    // For the first time user travel to web , then they just type the Origin(ex: https://localhost:5001), meats window.location.pathName =="/"
    if (location.pathname === "/") {
      const id = nanoid();
      navigate(`/${id}`);
      dispatch({ type: INIT, payload: { Id: id, Url: id } });
    }
    // for the time when user take the Url with Origin + pathname(ex: https://localhost:5001/jsdfdmnsklfm)
    else {
      axios
        .get(`/api${location.pathname}`)
        .then((res) => {
          if (res.data.content) {
            const { id, password, content, url } = res.data;
            dispatch({
              type: INIT,
              payload: { Id: id, Password: password, Content: content, Url: url },
            });
          } else {
            const path = location.pathname.removeCharAt(1);
            dispatch({ type: INIT, payload: { Id: path, Url: path } });
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <div className="App">
      <Header />
      <CustomModal name="url" heading="Change Url" />
      <CustomModal name="password" heading="Set Password" />
      <CustomModal name="share" heading="Share" />
      <Main />
    </div>
  );
}

export default memo(App);
