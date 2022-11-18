import { useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { AiFillLock } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./style.css";
import { ModalContext } from "../../../contexts/ModalContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { RESET_PASSWORD } from "../../../reducers/constant";

const Index = () => {
  const {
    setModalShow,
    content: { Url },
    dispatch,
  } = useContext(ModalContext);

  const { authDispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleOnClick = (e) => {
    e.preventDefault();
    // if a client want to set password , but another client set password on the note already, but this client does not know, let them login first
    if (e.target.id === "password") {
      axios.get(`/api/notes${location.pathname}`).then((res) => {
        if (res.data.message === "not authenticate") {
          navigate(location.pathname + "/" + "login");
          authDispatch({ type: AUTH_CHECK });
        } else {
          setModalShow(e.target.id);
        }
      });
    } else {
      setModalShow(e.target.id);
    }
  };

  const handleOnRemovePassword = async () => {
    const response = await axios.patch(`/api/notes/${Url}/reset-password`);
    if (response.message === "not found") {
      dispatch({ type: RESET_PASSWORD });
      authDispatch({ type: RESET_PASSWORD });
    } else {
      authDispatch({ type: RESET_PASSWORD });
    }
  };

  const {
    auth: { isSetPassword },
  } = useContext(AuthContext);

  return (
    <Container fluid>
      <div className="main-link d-flex flex-row justify-content-center align-items-center">
        {isSetPassword ? (
          <a className="px-2 pb-6px text-center">
            <AiFillLock />
          </a>
        ) : (
          ""
        )}
        <a href={window.location.href} target="_blank">
          {window.location.href}
        </a>
      </div>
      <Row className="bg-gray">
        <Col className="option text-center">
          <a id="url" onClick={handleOnClick} href="">
            Change Url
          </a>
          <span style={{ color: "#bebebe" }} className="p-2">
            |
          </span>
          {isSetPassword ? (
            <a onClick={handleOnRemovePassword} id="password" href="">
              Remove Password
            </a>
          ) : (
            <a onClick={handleOnClick} id="password" href="">
              Set Password
            </a>
          )}
          <span style={{ color: "#bebebe" }} className="p-2">
            |
          </span>
          <a onClick={handleOnClick} id="share" href="">
            Share
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export default Index;
