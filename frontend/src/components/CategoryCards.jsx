import React from "react";
import { Card, Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "PS5系列",
    image: "/images/playstation.jpg",
    link: "/search/play",
  },
  {
    name: "手機",
    image: "/images/phone.jpg",
    link: "/search/phone",
  },
  {
    name: "滑鼠",
    image: "/images/mouse.jpg",
    link: "/search/mouse",
  },
];

export default function CategoryCards() {
  return (
    <Row className="mb-4">
      {categories.map((category) => (
        <Col key={category.name} sm={12} md={4}>
          <Card className="mb-3">
            <Card.Img variant="top" src={category.image} />
            <Card.Body>
              <Card.Title>我們的{category.name}</Card.Title>
              <Link to={category.link}>
                <Button variant="primary">瀏覽</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
