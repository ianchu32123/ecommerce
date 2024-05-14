import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import Product from "../components/Product";

export const HomeScreen = () => {
  const [Products, setProduct] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get("/api/products");
      setProduct(data);
    };
    fetchProducts();
  }, []);
  return (
    <>
      <h1>最新產品</h1>
      <Row>
        {Products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};
