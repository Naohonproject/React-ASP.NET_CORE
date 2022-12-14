import React from "react";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HubConnectionBuilder } from "@microsoft/signalr";

import "./style.css";
import { ModalContext } from "../../../contexts/ModalContext";
import { UPDATE_CONTENT } from "../../../reducers/constant";

const Main = () => {
  // navigate hook
  const navigate = useNavigate();
  const {
    content: { Content, IsModified, Url },
    content,
    dispatch,
  } = useContext(ModalContext);

  // local states
  const [value, setValue] = useState(Content);
  const [connection, setConnection] = useState(null);

  // component's side effects

  // init connection when Main is mounted into DOM
  useEffect(() => {
    // config the builder and then build a instance of connect
    const connect = new HubConnectionBuilder()
      .withUrl("/socket/notes/update")
      .withAutomaticReconnect()
      .build();
    // set connect to connection state
    setConnection(connect);
  }, []);

  // listen socket event
  // side effect when connection state is changed,start the Socket client and start listening the event
  // list the socket event then dispatch the change to Content in Modal context, then update the local states
  useEffect(() => {
    if (connection) {
      connection.start().then(() => {
        connection.on("update-node-content", (message, url) => {
          if (url === window.location.pathname.removeCharAt(1)) {
            dispatch({
              type: UPDATE_CONTENT,
              payload: {
                Content: message,
              },
            });
          }
        });
      });
    }
  }, [connection]);

  useEffect(() => {
    setValue(Content);
  }, [Content]);

  // value change
  // useEffect callback is called => clean up function call with value of previous state =>statements inside useEffect is called
  useEffect(() => {
    // statements will run after component render and dependency change
    // if text area empty in the first time mounted, decide post or
    const timeoutId = setTimeout(() => {
      // just create a new post request if Content is empty and Id is not empty and except
      if (Content == "") {
        // when app init , just create a post to server when user type something on textarea,and after Id and Url created, isModified is flag to check whether this Id was exist in db or not, initial value in context store is false, after put content to server, server change it to true after the first time
        if (Url != "") {
          if (!IsModified) {
            axios
              .post(`/api/notes`, { ...content, Content: value })
              .then((res) => {
                dispatch({ type: UPDATE_CONTENT, payload: { Content: res.data.content } });
              })
              .catch((err) => {});
          } else {
            // this else will run when use delete all text in existed note,then  Content == "" , Id!="", but ismModified == true , because after the first time , server change content of note or change url, server change state of isModified from false to true then we dispatch that data to store already
            axios
              .patch(`/api/notes/${Url}/update-content`, { ...content, Content: value })
              .then((res) => {
                if (res.data.message === "not authenticate") {
                  navigate(`${window.location.pathname}/login`);
                } else if (res.data.status !== false) {
                  sendMessage(res.data.content);
                  dispatch({
                    type: UPDATE_CONTENT,
                    payload: { /* Content: res.data.content, */ IsModified: res.data.isModified },
                  });
                }
              })
              .catch((err) => {});
          }
        } else {
          // this is for when user travel to web site with their own path, mean not only https://localhost:5001/ but also ex: https://localhost:5001/13235
          // first : try to get this url(12235) in db to get note, if server response not found this note in db, the app will not do nothing, this time Id and Url still empty, because App component did not re-render, so that logic not run into above case( id!= "") therefore run into this else statement.Then check when value(state of textarea) change, we send a post to server to create a note with Url and Id equal to user's pathName,if  our post with the same key with some note in db, just navigate app to root origin to create a new path
          if (value !== "") {
            const path = window.location.pathname.removeCharAt(1);
            axios
              .post(`/api/notes`, { ...content, Content: value, Id: path, Url: path })
              .then((res) => {
                if (res.data.message === "data exist in db") {
                  return navigate("/");
                }
                dispatch({
                  type: UPDATE_CONTENT,
                  payload: { Content: res.data.content, Id: path, Url: path },
                });
              })
              .catch((err) => {});
          }
        }
      } else {
        // this case when Content exist data, just put that data to change exist note's content in db
        axios
          .patch(`/api/notes/${Url}/update-content`, { ...content, Content: value })
          .then((res) => {
            if (res.data.message === "not authenticate") {
              navigate(`${window.location.pathname}/login`);
            } else if (res.data.status !== false) {
              sendMessage(res.data.content, window.location.pathname.removeCharAt(1));
              dispatch({
                type: UPDATE_CONTENT,
                payload: { /* Content: res.data.content,  */ IsModified: res.data.isModified },
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }, 600);
    // clean up function of previous state run, means timeOutId is the previous timeoutId.I use this tips to prevent sending too much request to server every time when user change text area, this clean up function will run with value of timeoutId of previous state,just after we stop typing for 600ms , the value of text area will be sent in our request
    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleOnChange = (event) => {
    setValue(event.target.value);
  };

  const sendMessage = async (message, url) => {
    if (connection) {
      connection.send("SendMessage", message, url);
    }
  };

  return (
    <div className="body-container">
      <div className="document-container">
        <textarea onChange={handleOnChange} value={value} className="input-control"></textarea>
      </div>
    </div>
  );
};

export default Main;
