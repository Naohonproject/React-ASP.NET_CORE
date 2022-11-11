import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";

import { ModalContext } from "../../contexts/ModalContext";
import { CHANGE_URL } from "../../reducers/constant";

String.prototype.removeCharAt = function (i) {
  var tmp = this.split("");
  tmp.splice(i - 1, 1);
  return tmp.join("");
};

export default function CustomModal({ heading, name }) {
  const { modalShow, setModalShow, dispatch, content, setErrorMessage, errorMessage } =
    useContext(ModalContext);
  const handleClose = () => {
    setModalShow(null);
    setPath(window.location.pathname);
  };

  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    setPath(window.location.pathname);
  }, [window.location.pathname]);

  const navigate = useNavigate();

  const handleOnUrlChange = (e) => {
    setPath("/" + e.target.value);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/url/${content.Id}`, {
        ...content,
        Url: path.removeCharAt(1),
      });
      if (response.data.status) {
        dispatch({
          type: CHANGE_URL,
          payload: { Url: path.removeCharAt(1), Id: response.data.id },
        });
        navigate(path);
      } else {
        setErrorMessage(response.data.errorMessage);
      }
    } catch (error) {}
    setModalShow(null);
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
              </Form.Group>
            ) : (
              ""
            )}
            {name === "password" ? (
              <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="Password" />
              </Form.Group>
            ) : (
              ""
            )}

            {name === "share" ? (
              <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="share" />
              </Form.Group>
            ) : (
              ""
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            {name !== "share" ? (
              <Button type="submit" variant="primary">
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
