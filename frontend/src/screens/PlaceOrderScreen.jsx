import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import Loader from "../components/Loader";
import WebcamCapture from "../components/WebcamCapture";
import { useCreateOrderMutation } from "../slices/orderApiSlice";
import { clearCartItems } from "../slices/cartSlice";

export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = cart;

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [showModal, setShowModal] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    } else if (!paymentMethod) {
      navigate("/payment");
    }
  }, [shippingAddress.address, paymentMethod, navigate]);

  const placeOrderHandler = async (age) => {
    try {
      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        age,
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err.data?.message || err.message || "An error occurred");
    }
  };

  const handleAgeVerified = (isVerified) => {
    setAgeVerified(isVerified);
    setShowModal(false);
    if (isVerified) {
      placeOrderHandler(19); // Passing age > 18 for successful verification
    } else {
      toast.error("年齡驗證失敗。您必須年滿18歲才能購買此產品。");
    }
  };

  const handlePlaceOrderClick = () => {
    const requiresAgeVerification = cartItems.some(
      (item) => item.category === "Limit"
    );
    if (requiresAgeVerification) {
      setShowModal(true);
    } else {
      placeOrderHandler();
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>運送</h2>
              <p>
                <strong>地址:</strong>
                {shippingAddress.address}, {shippingAddress.city}{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>支付方式</h2>
              <strong>方式:</strong> {paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>訂單內容</h2>
              {cartItems.length === 0 ? (
                <Message>購物車內容是空的</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} x NT{item.price} = NT
                          {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
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
                  <Col>商品金額</Col>
                  <Col>NT{itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>運費</Col>
                  <Col>NT{shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>稅費</Col>
                  <Col>NT{taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>總金額</Col>
                  <Col>NT{totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && (
                  <Message variant="danger">
                    {typeof error === "object" ? JSON.stringify(error) : error}
                  </Message>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cartItems.length === 0}
                  onClick={handlePlaceOrderClick}
                >
                  送出訂單
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <WebcamCapture
        show={showModal}
        handleClose={() => setShowModal(false)}
        onAgeVerified={handleAgeVerified}
      />
    </>
  );
}
