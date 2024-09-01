import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../slices/cartSlice";

export default function PaymentScreen() {
  const [paymentMethod, setpaymentMethod] = useState("PayPal");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const { shippingAddress } = cart;

  useEffect(
    function () {
      if (!shippingAddress) {
        navigate("/shipping");
      }
    },
    [shippingAddress, navigate]
  );

  const submitHandler = function (e) {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>支付方式</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">選擇支付方式</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="PayPal或信用卡"
              id="PayPal"
              value="PayPal"
              checked
              onChange={(e) => setpaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>
        <Button type="submit" variant="primary">
          下一步
        </Button>
      </Form>
    </FormContainer>
  );
}
