import { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { Navigate, useParams } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";
import { ModalContext } from "../../contexts/ModalContext";
import { TYPING_PASSWORD } from "../../reducers/constant";

const Auth = () => {
  const params = useParams();
  const {
    auth: { isAuthenticated, isSetPassword, errorMessage },
    resolvePassword,
    authDispatch,
  } = useContext(AuthContext);

  const {
    content: { Id },
  } = useContext(ModalContext);

  const [password, setPassword] = useState("");

  const handleOnChange = (e) => {
    setPassword(e.target.value);
    authDispatch({ type: TYPING_PASSWORD });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    let id;
    if (Id !== "") {
      id = Id;
    } else {
      id = window.location.pathname.split("/")[1];
    }

    await resolvePassword(id, password);
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
          {errorMessage !== "" ? (
            <p style={{ color: "red", fontSize: "16px", marginTop: "6px" }}>{errorMessage}</p>
          ) : (
            ""
          )}
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default Auth;
