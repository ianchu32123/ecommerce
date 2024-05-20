import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";

//@desc 建立新訂單
//@route POST /api/orders
//@access Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createOrder = await order.save();

    res.status(201).json(createOrder);
  }
});

//@desc 登入後的使用者訂單
//@route GET /api/orders/mine
//@access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

//@desc  根據ID查看訂單
//@route GET /api/orders/:id
//@access Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

//@desc 更新訂單 未支付 => 支付
//@route GET /api/orders/:id/pay
//@access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  res.send("update Order To Paid");
});

//@desc 更新訂單 => 運送中
//@route GET /api/orders/:id/deliver
//@access Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  res.send("update Order To Delivered");
});

//@desc 抓全部訂單
//@route GET /api/orders
//@access Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  res.send("get all orders");
});

export {
  addOrderItems,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderToDelivered,
  updateOrderToPaid,
};
