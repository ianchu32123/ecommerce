import { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useProfileMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";

export default function ProfileScreen() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [comfirmpassword, setcomfirmpassword] = useState("");

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(
    function () {
      if (userInfo) {
        setname(userInfo.name);
        setemail(userInfo.email);
      }
    },
    [userInfo, userInfo.name, userInfo.email]
  );

  const submitHandler = async function (e) {
    e.preventDefault();
    if (password !== comfirmpassword) {
      toast.error("密碼不吻合");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials(res));
        toast.success("個人資料更改成功");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>個人資料</h2>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-2">
            <Form.Label>姓名</Form.Label>
            <Form.Control
              type="name"
              placeholder="輸入姓名"
              value={name}
              onChange={(e) => setname(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email" className="my-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="輸入Email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password" className="my-2">
            <Form.Label>密碼</Form.Label>
            <Form.Control
              type="password"
              placeholder="輸入密碼"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="comfirmPassword" className="my-2">
            <Form.Label>確認密碼</Form.Label>
            <Form.Control
              type="comfirmPassword"
              placeholder="確認密碼"
              value={comfirmpassword}
              onChange={(e) => setcomfirmpassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="my-2">
            更新
          </Button>
          {loadingUpdateProfile && <Loader />}
        </Form>
      </Col>
      <Col md={9}>123454</Col>
    </Row>
  );
}
