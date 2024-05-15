import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGetProductsDetailsQuery } from "../slices/productApiSlice";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { addToCart } from "../slices/cartSlice";

import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function ProductScreen() {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const {
    data: Products,
    isLoading,
    error,
  } = useGetProductsDetailsQuery(productId);

  const addToCartHandler = function () {
    dispatch(addToCart({ ...Products, qty }));
    navigate("/cart");
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );
  }

  if (!Products) {
    return <Message variant="danger">Product not found</Message>;
  }

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        回到首頁
      </Link>

      <Row>
        <Col md={5}>
          <Image src={Products.image} alt={Products.name} fluid />
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{Products.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={Products.rating}
                text={`${Products.numReviews} reviews`}
              />
            </ListGroup.Item>
            <ListGroup.Item>價格: {Products.price}</ListGroup.Item>
            <ListGroup.Item>產品描述: {Products.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>價格:</Col>
                  <Col>
                    <strong>{Products.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>狀態:</Col>
                  <Col>
                    <strong>
                      {Products.countInStock > 0 ? "有庫存" : "無庫存"}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              {Products.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[...Array(Products.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  className="btn-block"
                  type="button"
                  disabled={Products.countInStock === 0}
                  onClick={addToCartHandler}
                >
                  加入購物車
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}
