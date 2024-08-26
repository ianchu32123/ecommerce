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

  // 今日訂單數量
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 設置時間為當天的開始
  const todayOrders = orders.filter((order) => order.paidAt >= today);
  const todayOrderCount = todayOrders.length;

  // 今日熱銷產品
  const productSales = {};
  todayOrders.forEach((order) => {
    order.orderItems.forEach((item) => {
      if (!productSales[item.product]) {
        productSales[item.product] = {
          qty: 0,
          name: item.name,
          price: item.price,
        };
      }
      productSales[item.product].qty += item.qty;
    });
  });

  const bestSellingProducts = Object.values(productSales)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  res.json({ dailySales, categorySales, todayOrderCount, bestSellingProducts });
});

export { getSalesReport };
