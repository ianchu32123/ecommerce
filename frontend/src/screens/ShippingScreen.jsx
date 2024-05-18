import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import { saveShippingAddress } from "../slices/cartSlice";

export default function ShippingScreen() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setaddress] = useState(shippingAddress?.address || "");
  const [city, setcity] = useState(shippingAddress?.city || "");
  const [postalCode, setpostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setcountry] = useState(shippingAddress?.country || "");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = function (e) {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };

  return (
    <FormContainer>
      <h1>運送方式</h1>
      <Form onSubmit={submitHandler} className="my-2">
        <Form.Group controlId="address">
          <Form.Label>地址</Form.Label>
          <Form.Control
            type="text"
            placeholder="輸入地址"
            value={address}
            onChange={(e) => setaddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city" my-2>
          <Form.Label>城市</Form.Label>
          <Form.Control
            type="text"
            placeholder="輸入城市"
            value={city}
            onChange={(e) => setcity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode" className="my-2">
          <Form.Label>郵遞區號</Form.Label>
          <Form.Control
            type="text"
            placeholder="輸入郵遞區號"
            value={postalCode}
            onChange={(e) => setpostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="country" my-2>
          <Form.Label>國家</Form.Label>
          <Form.Control
            type="text"
            placeholder="輸入國家"
            value={country}
            onChange={(e) => setcountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="my-2">
          下一步
        </Button>
      </Form>
    </FormContainer>
  );
}
