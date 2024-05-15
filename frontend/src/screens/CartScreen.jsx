import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Card,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { addToCart } from "../slices/cartSlice";
import Message from "../components/Message";

export default function CartScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = function (product, qty) {
    dispatch(addToCart({ ...product, qty }));
  };
  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: "20px" }}>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            購物車是空的 <Link to="/">回首頁</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={3}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>{item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button type="button" variant="light">
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup>
            <ListGroup.Item variant="flush">
              <h2>
                總共 ({cartItems.reduce((acc, item) => acc + item.qty, 0)}
                )件商品
              </h2>
              NT
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
              >
                確認結帳
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}
