import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../slices/userApiSlice";

export default function ProductEditScreen() {
  const { id: userId } = useParams();

  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [isadmin, setisadmin] = useState(false);

  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  useEffect(
    function () {
      if (user) {
        setname(user.name);
        setemail(user.email);
        setisadmin(user.isadmin);
      }
    },
    [user]
  );

  const submitHandler = async function (e) {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isadmin });
      toast.success("使用者更新成功");
      refetch();
      navigate("/admin/userlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light mt-3">
        回到管理產品
      </Link>
      <FormContainer>
        <h1>編輯使用者</h1>
        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>使用者名稱</Form.Label>
              <Form.Control
                type="text"
                placeholder="輸入名稱"
                value={name}
                onChange={(e) => {
                  setname(e.target.value);
                }}
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

            <Form.Group controlId="isAdmin" className="my-2">
              <Form.Check
                type="checkbox"
                label="isAdmin"
                checked={isadmin}
                onChange={(e) => setisadmin(e.target.value)}
              ></Form.Check>
            </Form.Group>

            <Button type="submit" variant="primary" className="my-2">
              更新
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
}
