import { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { Navigate, useParams } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";
import { ModalContext } from "../../contexts/ModalContext";

const Auth = () => {
  const params = useParams();
  const {
    auth: { isAuthenticated, isSetPassword },
    resolvePassword,
  } = useContext(AuthContext);

  const [password, setPassword] = useState("");

  const handleOnChange = (e) => {
    setPassword(e.target.value);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const url = window.location.pathname.split("/")[1];
    const res = await resolvePassword(url, password);
  };

  return isAuthenticated || (isAuthenticated === null && !isSetPassword) ? (
    <Navigate to={`/${params.id}`} />
  ) : (
    <Container>
      <Form onSubmit={handleOnSubmit} className=" text-start">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="mt-2">Password required to edit this document</Form.Label>
          <Form.Control
            onChange={handleOnChange}
            value={password}
            type="password"
            placeholder="Your Password"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default Auth;
