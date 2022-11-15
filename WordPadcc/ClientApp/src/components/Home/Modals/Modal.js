import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { TfiSave } from "react-icons/tfi";

import { ModalContext } from "../../../contexts/ModalContext";
import { AuthContext } from "../../../contexts/AuthContext";
import {
  CHANGE_URL,
  CHANGE_URL_SUCCESS,
  CHANGE_URL_FAIL,
  IS_LOADING,
  RESET,
} from "../../../reducers/constant";
import "./Modal.css";

String.prototype.removeCharAt = function (i) {
  var tmp = this.split("");
  tmp.splice(i - 1, 1);
  return tmp.join("");
};

export default function CustomModal({ heading, name }) {
  const {
    modalShow,
    setModalShow,
    dispatch,
    content,
    message: { errorMessage, isLoading },
    dispatchMessage,
  } = useContext(ModalContext);

  const { setPassword } = useContext(AuthContext);

  const [path, setPath] = useState(window.location.pathname);
  const [password, setLocalPassword] = useState("");

  useEffect(() => {
    setPath(window.location.pathname);
  }, [window.location.pathname]);

  const navigate = useNavigate();

  const handleClose = () => {
    setModalShow(null);
    dispatchMessage({ type: RESET });
    setPath(window.location.pathname);
  };
  const handleOnUrlChange = (e) => {
    setPath("/" + e.target.value);
    dispatchMessage({ type: CHANGE_URL_SUCCESS });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (name === "url") {
      try {
        dispatchMessage({ type: IS_LOADING });
        const response = await axios.put(`/api/url/${content.Id}`, {
          ...content,
          Url: path.removeCharAt(1),
        });
        if (response.data.status) {
          dispatch({
            type: CHANGE_URL,
            payload: { Url: response.data.url, Id: response.data.id },
          });
          dispatchMessage({ type: CHANGE_URL_SUCCESS });
          navigate("/" + response.data.url);
          setModalShow(null);
        } else {
          setTimeout(() => {
            dispatchMessage({
              type: CHANGE_URL_FAIL,
              payload: { errorMessage: response.data.errorMessage, isLoading: false },
            });
          }, 1000);
        }
      } catch (error) {}
    } else {
      await setPassword(content.Id, password);
      setModalShow(null);
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
                  value={path.removeCharAt(1)}
                  onChange={handleOnUrlChange}
                  type="text"
                  placeholder="Url"
                />
                {errorMessage ? (
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
                <Form.Control
                  onChange={(e) => setLocalPassword(e.target.value)}
                  value={password}
                  type="text"
                  placeholder="Password"
                />
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
