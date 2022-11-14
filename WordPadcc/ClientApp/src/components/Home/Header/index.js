import { useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./style.css";
import { ModalContext } from "../../../contexts/ModalContext";

const Index = () => {
  const { setModalShow } = useContext(ModalContext);
  const handleOnClick = (e) => {
    e.preventDefault();
    setModalShow(e.target.id);
  };
  return (
    <Container fluid>
      <Row className="main-link">
        <Col>
          <a href="Something">{window.location.href}</a>
        </Col>
      </Row>
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
