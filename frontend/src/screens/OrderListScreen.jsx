import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetOrdersQuery } from "../slices/orderApiSlice";

export default function OrderListScreen() {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  return (
    <>
      <h1>所有訂單</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>使用者</th>
              <th>日期</th>
              <th>訂單總額</th>
              <th>是否已支付</th>
              <th>是否已到達</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>
                  {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                </td>
                <td>NT{order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      "N/A"
                    )
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      "N/A"
                    )
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      訂單細節
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
