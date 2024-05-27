import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

//@desc 抓全部產品
//@route GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

//@desc 抓單一產品
//@route GET /api/products/:id
//@access Public
const getProductsById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

//@desc 建立新產品
//@route Post /api/products
//@access Private/admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/image/sample.jpg",
    brand: "Sample brand",
    category: "sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  const createProduct = await product.save();
  res.status(201).json(createProduct);
});

//@desc 更新產品
//@route PUT /api/products/:id
//@access Private/admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updateProduct = await product.save();

    res.json(updateProduct);
  } else {
    res.status(404);
    throw new Error("找不到該產品");
  }
});

//@desc 刪除產品
//@route delete /api/products/:id
//@access Private/admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({
      _id: product._id,
    });
    res.status(200).json({ message: "Product delete" });
  } else {
    res.status(404);
    throw new Error("找不到該產品");
  }
});

export {
  getProducts,
  getProductsById,
  createProduct,
  updateProduct,
  deleteProduct,
};
