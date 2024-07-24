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
import { Row, Col, Card } from "react-bootstrap";

const COLORS = [
  "#0088FE", // Blue
  "#00C49F", // Green
  "#FFBB28", // Yellow
  "#FF8042", // Orange
  "#8A2BE2", // BlueViolet
  "#FF69B4", // HotPink
  "#BA55D3", // MediumOrchid
  "#CD5C5C", // IndianRed
];

const ReportScreen = () => {
  const dispatch = useDispatch();
  const { dailySales, categorySales, loading, error } = useSelector(
    (state) => state.report
  );

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
  );
};

export default ReportScreen;
