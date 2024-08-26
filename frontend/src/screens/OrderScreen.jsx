import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useGetOrderDetailsQuery,
  useGetPayPalClientIdQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from "../slices/orderApiSlice";

export default function OrderScreen() {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (paypal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            clientId: paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch]);

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order.totalPrice.toString(),
          },
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        const res = await payOrder({ orderId, details }).unwrap();
        refetch();
        toast.success("付款成功");
      } catch (err) {
        toast.error(err.message || "發生錯誤");
      }
    });
  };

  const onError = (err) => {
    toast.error(err.message || "PayPal Checkout error");
  };

  const onApproveTest = async () => {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    toast.success("付款成功");
  };

  const deliverOrderHandler = async function () {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success(`訂單已送達`);
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

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
                <strong>運送地址:</strong>
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
              <h2>支付方式</h2>
              <p>
                <strong>方式:</strong> {order.paymentMethod}
              </p>
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
              </ListGroup.Item>

              {!order.isPaid && (
                <>
                  <hr />
                  <ListGroup.Item>
                    {loadingPay && <Loader />}
                    {isPending ? (
                      <Loader />
                    ) : (
                      <div>
                        <Button
                          onClick={onApproveTest}
                          style={{ marginBottom: "10px" }}
                        >
                          支付測試
                        </Button>
                        <div>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </div>
                      </div>
                    )}
                  </ListGroup.Item>
                </>
              )}
              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverOrderHandler}
                    >
                      標示為已送達
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}
