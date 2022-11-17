import { useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { AiFillLock } from "react-icons/ai";

import "./style.css";
import { ModalContext } from "../../../contexts/ModalContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { RESET_PASSWORD } from "../../../reducers/constant";
import axios from "axios";

const Index = () => {
  const {
    setModalShow,
    content: { Url },
    dispatch,
  } = useContext(ModalContext);

  const { authDispatch } = useContext(AuthContext);
  const handleOnClick = (e) => {
    e.preventDefault();
    setModalShow(e.target.id);
  };

  const handleOnRemovePassword = async () => {
    const response = await axios.put(`/api/notes/${Url}/reset-password`);
    if (response.message === "not found") {
      dispatch({ type: RESET_PASSWORD });
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
