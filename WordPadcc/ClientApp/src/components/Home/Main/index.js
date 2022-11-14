import React from "react";
import { useContext, useState, useEffect } from "react";

import axios from "axios";

import "./style.css";
import { ModalContext } from "../../../contexts/ModalContext";
import { UPDATE_CONTENT } from "../../../reducers/constant";

const index = () => {
  const {
    content: { Content, Id, IsModified },
    content,
    dispatch,
  } = useContext(ModalContext);

  const [value, setValue] = useState(Content);

  useEffect(() => {
    setValue(Content);
  }, [Content]);

  const handleOnChange = (event) => {
    setValue(event.target.value);
  };

  // value change
  // useEffect callback is called => clean up function call with value of previous state =>statements inside useEffect is called
  useEffect(() => {
    // statements will run after component render and dependency change
    // if text area empty in the first time mounted, decide post or
    const timeoutId = setTimeout(() => {
      // just create a new post request if Content is empty and Id is not empty and except
      if (Content == "") {
        if (Id != "") {
          if (!IsModified) {
            axios
              .post(`/api`, { ...content, Content: value })
              .then((res) => {
                dispatch({ type: UPDATE_CONTENT, payload: { Content: res.data.content } });
              })
              .catch((err) => {});
          } else {
            axios
              .put(`/api/content/${Id}`, { ...content, Content: value })
              .then((res) => {
                dispatch({
                  type: UPDATE_CONTENT,
                  payload: { Content: res.data.content, IsModified: res.data.isModified },
                });
              })
              .catch((err) => {});
          }
        }
      } else {
        axios
          .put(`/api/content/${Id}`, { ...content, Content: value })
          .then((res) => {
            dispatch({
              type: UPDATE_CONTENT,
              payload: { Content: res.data.content, IsModified: res.data.isModified },
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }, 500);
    // clean up function of previous state run, means timeOutId is the previous timeoutId
    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <div className="body-container">
      <div className="document-container">
        <textarea onChange={handleOnChange} value={value} className="input-control"></textarea>
      </div>
    </div>
  );
};

export default index;
