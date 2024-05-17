import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";

export default function RegisterScreen() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [name, setname] = useState("");
  const [comfirmPassword, setcomfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(
    function () {
      if (userInfo) {
        navigate(redirect);
      }
    },
    [userInfo, redirect, navigate]
  );

  const submitHandler = async function (e) {
    e.preventDefault();

    if (password !== comfirmPassword) {
      toast.error("密碼不吻合");
      return;
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <FormContainer>
      <h1>註冊</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name" className="my-3">
          <Form.Label>名字</Form.Label>
          <Form.Control
            type="name"
            placeholder="輸入姓名"
            value={name}
            onChange={(e) => setname(e.target.value)}
          ></Form.Control>
        </Form.Group>

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

        <Form.Group controlId="comfirmpassword" className="my-3">
          <Form.Label>確認密碼</Form.Label>
          <Form.Control
            type="password"
            placeholder="確認密碼"
            value={comfirmPassword}
            onChange={(e) => setcomfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          className="mt-2"
          disabled={isLoading}
        >
          註冊
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          已經有帳號?
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            登入
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
}
