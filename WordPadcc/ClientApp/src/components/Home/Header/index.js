import { useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { AiFillLock } from "react-icons/ai";

import "./style.css";
import { ModalContext } from "../../../contexts/ModalContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { AUTH_LOADING, AUTH_LOADING_SUCCESS, AUTH_LOADING_FAIL } from "../../../reducers/constant";
const Index = () => {
  const { setModalShow } = useContext(ModalContext);
  const handleOnClick = (e) => {
    e.preventDefault();
    setModalShow(e.target.id);
  };

  const {
    auth: { isAuthenticated },
  } = useContext(AuthContext);

  return (
    <Container fluid>
      <div className="main-link d-flex flex-row justify-content-center align-items-center">
        {isAuthenticated === false ? (
          <a className="px-2 text-center">
            <AiFillLock />
          </a>
        ) : (
          ""
        )}
        <a href="Something">{window.location.href}</a>
      </div>
      <Row className="bg-gray">
        <Col className="option text-center">
          <a id="url" onClick={handleOnClick} href="">
            Change Url
          </a>
          <span style={{ color: "#bebebe" }} className="p-2">
            |
          </span>
          <a onClick={handleOnClick} id="password" href="">
            SetPassword
          </a>
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
