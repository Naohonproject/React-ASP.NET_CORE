import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import { TfiSave } from "react-icons/tfi";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";
import { HubConnectionBuilder } from "@microsoft/signalr";

import { ModalContext } from "../../../contexts/ModalContext";
import { AuthContext } from "../../../contexts/AuthContext";
import {
  CHANGE_URL,
  CHANGE_SUCCESS,
  UPDATE_FAIL,
  IS_LOADING,
  RESET,
  AUTH_LOADING_SUCCESS,
} from "../../../reducers/constant";
import "./Modal.css";

String.prototype.removeCharAt = function (i) {
  var tmp = this.split("");
  tmp.splice(i - 1, 1);
  return tmp.join("");
};

let count = 0;

export default function CustomModal({ heading, name }) {
  //
  // contexts, global states
  const {
    modalShow,
    setModalShow,
    dispatch,
    content,
    message: { errorMessage, isLoading },
    dispatchMessage,
  } = useContext(ModalContext);
  const { setPassword, authDispatch } = useContext(AuthContext);

  // local states
  const [path, setPath] = useState(window.location.pathname.removeCharAt(1));
  const [password, setLocalPassword] = useState("");
  const [isVisitable, setIsVisitable] = useState(false);
  const [connection, setConnection] = useState(null);

  // side effects
  useEffect(() => {
    setPath(window.location.pathname.removeCharAt(1));
  }, [window.location.pathname]);

  // init connection when Modal is mounted into DOM
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
  useEffect(() => {
    if (connection) {
      connection.start().then(() => {
        connection.on("password-setting", (message) => {
          count = count + 1;
          if (!window.location.pathname.includes("login")) {
            if (count >= 3) {
              authDispatch({ type: AUTH_LOADING_SUCCESS });
              navigate(window.location.pathname + "/login");
            }
          }
        });
      });
    }
  }, [connection]);

  const notifyPasswordSetting = useCallback(() => {
    if (connection) {
      connection.send("SendToOthers", "set-password");
    }
  }, [connection]);

  // navigate hook
  const navigate = useNavigate();

  const handleClose = () => {
    setModalShow(null);
    dispatchMessage({ type: RESET });
    if (name === "url") {
      setPath(window.location.pathname.removeCharAt(1));
    } else if (name === "password") {
      setLocalPassword("");
    }
  };

  const handleOnUrlChange = (e) => {
    setPath(e.target.value);
    dispatchMessage({ type: CHANGE_SUCCESS });
  };

  const handleOnPasswordChange = (e) => {
    setLocalPassword(e.target.value);
    dispatchMessage({ type: CHANGE_SUCCESS });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (name === "url") {
      try {
        dispatchMessage({ type: IS_LOADING });
        let id;
        if (content.Url === "") {
          id = window.location.pathname.removeCharAt(1);
        } else {
          id = content.Id;
        }

        const response = await axios.patch(
          `/api/notes/${window.location.pathname.removeCharAt(1)}/update-url`,
          {
            ...content,
            Url: path,
            Id: id,
          }
        );

        // when some client set password for this notes but other client want to change url, then they must login first
        if (response.data.message === "not authenticate") {
          navigate(`${window.location.pathname}/login`);
        } else if (response.data.status) {
          dispatch({
            type: CHANGE_URL,
            payload: { Url: response.data.url, Id: response.data.id },
          });
          dispatchMessage({ type: CHANGE_SUCCESS });
          navigate("/" + response.data.url);
          setModalShow(null);
        } else {
          setTimeout(() => {
            dispatchMessage({
              type: UPDATE_FAIL,
              payload: { errorMessage: response.data.errorMessage },
            });
          }, 1000);
        }
      } catch (error) {}
    } else {
      const isSuccess = await setPassword(content.Url, password);
      if (isSuccess) {
        notifyPasswordSetting();
        setModalShow(null);
      }
    }
  };

  return (
    <>
      <Modal show={modalShow === name} onHide={handleClose}>
        <Form onSubmit={handleOnSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{heading}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {name === "url" ? (
              <a className="mb-3" style={{ display: "block" }}>
                {window.location.origin + path}
              </a>
            ) : (
              ""
            )}
            {name === "url" ? (
              <Form.Group className="mb-3">
                <Form.Control
                  value={path}
                  onChange={handleOnUrlChange}
                  type="text"
                  placeholder="Url"
                />
                {errorMessage !== "" ? (
                  <p style={{ color: "red", fontSize: "16px", marginTop: "6px" }}>{errorMessage}</p>
                ) : (
                  ""
                )}
              </Form.Group>
            ) : (
              ""
            )}
            {name === "password" ? (
              <Form.Group className="mb-3">
                <InputGroup className="d-flex align-items-center">
                  <Form.Control
                    autoComplete="new-password"
                    onChange={handleOnPasswordChange}
                    value={password}
                    type={isVisitable ? "text" : "password"}
                    placeholder="Password"
                  />
                  <div
                    onClick={() => setIsVisitable((prev) => !prev)}
                    className="d-flex hv-pointer align-items-center justify-content-center mr-2"
                  >
                    {isVisitable ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </div>
                </InputGroup>
                {errorMessage !== "" ? (
                  <p style={{ color: "red", fontSize: "16px", marginTop: "6px" }}>{errorMessage}</p>
                ) : (
                  ""
                )}
              </Form.Group>
            ) : (
              ""
            )}

            {name === "share" ? (
              <Form.Group className="mb-3">
                <Form.Control
                  readOnly
                  value={window.location.origin + "/" + "share" + window.location.pathname}
                  type="text"
                  placeholder="share"
                />
              </Form.Group>
            ) : (
              ""
            )}
          </Modal.Body>
          <Modal.Footer>
            {isLoading && <TfiSave style={{ marginRight: "auto" }} />}
            <Button
              className={isLoading ? "disable" : ""}
              variant="secondary"
              onClick={handleClose}
            >
              Close
            </Button>
            {name !== "share" ? (
              <Button className={isLoading ? "disable" : ""} type="submit" variant="primary">
                Save Changes
              </Button>
            ) : (
              ""
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
