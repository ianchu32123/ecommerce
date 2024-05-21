import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetOrderDetailsQuery } from "../slices/orderApiSlice";

export default function OrderScreen() {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger" />
  ) : (
    <>
      <h1>訂單 {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>運送資訊</h2>
              <p>
                <strong>訂購人名字:</strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email:</strong>
                {order.user.email}
              </p>
              <p>
                <strong>地址:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">已在{order.deliveredAt}送達</Message>
              ) : (
                <Message variant="danger">未送達</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>
                <strong>支付方式:</strong>
                {order.paymentMethod}
              </h2>
              {order.isPaid ? (
                <Message variant="success">已付款於{order.paidAt}</Message>
              ) : (
                <Message variant="danger">未付款</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>訂單內容</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x NT{item.price} = {item.qty * item.price}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>訂單總結</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>商品價格</Col>
                  <Col>NT{order.itemsPrice}</Col>
                </Row>

                <Row>
                  <Col>運費</Col>
                  <Col>NT{order.shippingPrice}</Col>
                </Row>

                <Row>
                  <Col>稅費</Col>
                  <Col>NT{order.taxPrice}</Col>
                </Row>

                <Row>
                  <Col>總額</Col>
                  <Col>NT{order.totalPrice}</Col>
                </Row>
                {/* pay order placeorder */}
                {/*Mark as delivered placeholder*/}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}
