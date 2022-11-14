import { Route, Routes } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useContext, memo } from "react";
import { customAlphabet } from "nanoid";
import axios from "axios";

import { ModalContext } from "./contexts/ModalContext";
import { INIT } from "./reducers/constant";
import "./App.css";
import Home from "./components/Home/Home";
import Share from "./components/Share";

const nanoid = customAlphabet("1234567890abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    dispatch,
    content: { Id, Url, Content, Password },
  } = useContext(ModalContext);

  // when App mount, useEffect will be called, 2 cases will be available:
  // * case 1 : user travel to our web with origin(ex:https://localhost:5001) => location.pathname will be equal to "/"
  //            then we create an id, change location.path by using useNavigate hook, then we dispatch the Id,Url to
  //            context store.UseEffect has it's dependency[Url,Id], because of Url,Id change;UseEffect call, this time
  //            location.pathname !=="/", logic go into else statement.This time, in else statement , go on case2
  //  * case2 : user go to our web with an Url with pathName or after creating in case 1
  //            we call api to server to try to get the database by location.pathname,
  //            if server response with data.content,we use that data then dispatch to context store
  //            if server response without data.content we just dispatch the Url and Id to context store
  //            wait for user type to textarea, this time runs into 2 case.Case 1, if Content has data(!="") means that when app
  //            mounted, axios.get() has data.content => we put new data to server,case 2 if Content has no data => means that
  //            this time user to our web, there is no data with current Url in database => Post new data
  useEffect(() => {
    // For the first time user travel to web , then they just type the Origin(ex: https://localhost:5001), meats window.location.pathName =="/"
    if (location.pathname === "/") {
      const id = nanoid();
      navigate(`/${id}`);
      dispatch({ type: INIT, payload: { Id: id, Url: id } });
    }
    // for the time when user take the Url with Origin + pathname(ex: https://localhost:5001/jsdfdmnsklfm)
    else {
      if (location.pathname.length <= 9) {
        axios
          .get(`/api${location.pathname}`)
          .then((res) => {
            if (res.data.content) {
              const { id, password, content, url } = res.data;
              dispatch({
                type: INIT,
                payload: { Id: id, Password: password, Content: content, Url: url },
              });
            }
          })
          .catch((err) => console.log(err));
      }
    }
  }, [Id, Url]);

  return (
    <div className="App">
      <Routes>
        <Route path="/share/:id" element={<Share />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default memo(App);
