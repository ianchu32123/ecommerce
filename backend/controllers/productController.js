import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

//@desc 抓全部產品
//@route GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 4;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
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

//@desc 創建回應
//@route post /api/products/:id/review
//@access Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("已經評論過拉");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: "評論新增成功" });
  } else {
    res.status(404);
    throw new Error("找不到該產品");
  }
});

//@desc 抓最高評分的產品
//@route GET /api/products/top
//@access Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.status(200).json(products);
});

export {
  getProducts,
  getProductsById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};
