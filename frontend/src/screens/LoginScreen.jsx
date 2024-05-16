import { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";

export default function LoginScreen() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const submitHandler = function (e) {
    e.preventDefault();
    console.log("submit");
  };
  return (
    <FormContainer>
      <h1>登入</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="輸入EMAIL"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password" className="my-3">
          <Form.Label>密碼</Form.Label>
          <Form.Control
            type="password"
            placeholder="輸入密碼"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-2">
          登入
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          新顧客?<Link to="/register">註冊</Link>
        </Col>
      </Row>
    </FormContainer>
  );
}
