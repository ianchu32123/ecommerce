import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalesReport } from "../../slices/reportSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Row, Col, Card, ListGroup } from "react-bootstrap";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8A2BE2",
  "#FF69B4",
  "#BA55D3",
  "#CD5C5C",
];

const ReportScreen = () => {
  const dispatch = useDispatch();
  const {
    dailySales,
    categorySales,
    todayOrderCount,
    bestSellingProducts,
    loading,
    error,
  } = useSelector((state) => state.report);

  useEffect(() => {
    dispatch(fetchSalesReport());
  }, [dispatch]);

  const formatDailySalesData = () => {
    return Object.keys(dailySales).map((date) => ({
      date,
      totalSales: dailySales[date],
    }));
  };

  const formatCategorySalesData = () => {
    return Object.keys(categorySales).map((category, index) => ({
      name: category,
      value: categorySales[category],
      color: COLORS[index % COLORS.length],
    }));
  };

  return (
    <>
      <Row>
        <Col md={6}>
          <Card
            className="shadow-sm mb-4"
            style={{ backgroundColor: "#ffcccc" }}
          >
            <Card.Body>
              <Card.Title className="text-center" style={{ color: "#ff6666" }}>
                今日訂單數
              </Card.Title>
              <h2 className="text-center" style={{ color: "#cc0000" }}>
                {todayOrderCount}
              </h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card
            className="shadow-sm mb-4"
            style={{ backgroundColor: "#ccffcc" }}
          >
            <Card.Body>
              <Card.Title className="text-center" style={{ color: "#33cc33" }}>
                今日熱銷產品
              </Card.Title>
              <ListGroup variant="flush">
                {bestSellingProducts.map((product) => (
                  <ListGroup.Item
                    key={product._id}
                    style={{ backgroundColor: "#ccffcc", color: "#006600" }}
                  >
                    {product.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title className="text-center">每日銷售量</Card.Title>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={formatDailySalesData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalSales"
                    stroke="#FF8042"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title className="text-center">銷售產品種類</Card.Title>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={formatCategorySalesData()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label
                  >
                    {formatCategorySalesData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ReportScreen;
