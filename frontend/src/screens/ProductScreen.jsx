import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import Rating from "../components/Rating";
import axios from "axios";

export default function ProductScreen() {
  const [Products, setProducts] = useState([]);

  const { id: productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${productId}`);
      setProducts(data);
    };
    fetchProduct();
  }, [productId]);
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
            <ListGroup.Item>價格:{Products.price}</ListGroup.Item>
            <ListGroup.Item>產品描述:{Products.description}</ListGroup.Item>
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

              <ListGroup.Item>
                <Button
                  className="btn-block"
                  type="button"
                  disabled={Products.countInStock === 0}
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
