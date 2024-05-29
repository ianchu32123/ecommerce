import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

export default function SearchBox({ className }) {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState("");

  const submitHandler = function (e) {
    e.preventDefault();
    if (keyword.trim()) {
      setKeyword("");
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };
  return (
    <Form onSubmit={submitHandler} className={`d-flex ${className}`}>
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="想找些甚麼?"
        className="search-box"
      ></Form.Control>
      <Button type="submit" variant="outline-light" className="search-button">
        搜尋
      </Button>
    </Form>
  );
}
