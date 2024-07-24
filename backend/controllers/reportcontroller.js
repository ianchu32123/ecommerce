import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// @desc    獲取銷售報表數據
// @route   GET /api/reports/sales
// @access  Private/Admin
const getSalesReport = asyncHandler(async (req, res) => {
  // 獲取已支付的訂單
  const orders = await Order.find({ isPaid: true });

  // 銷售金額按天統計
  const dailySales = orders.reduce((acc, order) => {
    const date = order.paidAt.toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + order.totalPrice;
    return acc;
  }, {});

  // 各類別銷售數量統計
  const categorySales = {};
  for (const order of orders) {
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        const category = product.category;
        categorySales[category] = (categorySales[category] || 0) + item.qty;
      }
    }
  }

  res.json({ dailySales, categorySales });
});

export { getSalesReport };
