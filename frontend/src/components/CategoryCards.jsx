import React from "react";
import { Card, Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "電子產品類",
    image: "/images/PS5.jpg",
    link: "/category/Electronics",
  },
  {
    name: "玩具類",
    image: "/images/pikachu.jpg",
    link: "/category/Toys",
  },
  {
    name: "限制級",
    image: "/images/condom.jpg",
    link: "/category/Limit",
  },
];

export default function CategoryCards() {
  return (
    <Row className="mb-4">
      {categories.map((category) => (
        <Col key={category.name} sm={12} md={4}>
          <Card className="mb-3">
            <Card.Img
              variant="top"
              src={category.image}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title>{category.name}</Card.Title>
              <Link to={category.link}>
                <Button variant="primary">前往</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
