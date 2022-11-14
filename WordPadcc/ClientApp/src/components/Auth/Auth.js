import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";

const Auth = () => {
  return (
    <Container>
      <Form className=" text-start">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="mt-2">Password required to edit this document</Form.Label>
          <Form.Control type="password" placeholder="Your Password" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default Auth;
