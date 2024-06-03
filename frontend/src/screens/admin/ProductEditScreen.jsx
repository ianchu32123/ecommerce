import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useGetProductsDetailsQuery,
  useUploadProductImageMutation,
} from "../../slices/productApiSlice";

export default function ProductEditScreen() {
  const { id: productId } = useParams();

  const [name, setname] = useState("");
  const [price, setprice] = useState(0);
  const [image, setimage] = useState("");
  const [brand, setbrand] = useState("");
  const [category, setcategory] = useState("");
  const [countInStock, setcountInStock] = useState(0);
  const [description, setdescription] = useState("");

  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductsDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  useEffect(
    function () {
      if (product) {
        setname(product.name);
        setprice(product.price);
        setimage(product.image);
        setbrand(product.brand);
        setcategory(product.category);
        setcountInStock(product.countInStock);
        setdescription(product.description);
      }
    },
    [product]
  );

  const submitHandler = async function (e) {
    e.preventDefault();
    const updatedProduct = {
      productId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    };

    const result = await updateProduct(updatedProduct);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("產品更新成功");
      navigate("/admin/productlist");
    }
  };

  const uploadFileHandler = async function (e) {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setimage(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light mt-3">
        回到管理產品
      </Link>
      <FormContainer>
        <h1>編輯產品</h1>
        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>產品名稱</Form.Label>
              <Form.Control
                type="text"
                placeholder="輸入名稱"
                value={name}
                onChange={(e) => {
                  setname(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image" className="my-2">
              <Form.Label>產品圖片</Form.Label>
              <Form.Control
                type="text"
                placeholder="輸入圖片URL"
                value={image}
                onChange={(e) => setimage(e.target.value)}
              ></Form.Control>
              <Form.Control
                type="file"
                label="選擇檔案"
                onChange={uploadFileHandler}
              ></Form.Control>
            </Form.Group>
            {loadingUpload && <Loader />}

            <Form.Group controlId="price" className="my-2">
              <Form.Label>產品價格</Form.Label>
              <Form.Control
                type="number"
                placeholder="輸入價格"
                value={price}
                onChange={(e) => {
                  setprice(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="brand" className="my-2">
              <Form.Label>品牌名稱</Form.Label>
              <Form.Control
                type="text"
                placeholder="輸入品牌"
                value={brand}
                onChange={(e) => {
                  setbrand(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock" className="my-2">
              <Form.Label>庫存數</Form.Label>
              <Form.Control
                type="number"
                placeholder="輸入庫存"
                value={countInStock}
                onChange={(e) => {
                  setcountInStock(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category" className="my-2">
              <Form.Label>分類</Form.Label>
              <Form.Control
                type="text"
                placeholder="輸入分類"
                value={category}
                onChange={(e) => {
                  setcategory(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="my-2">
              <Form.Label>產品描述</Form.Label>
              <Form.Control
                type="text"
                placeholder="輸入產品描述"
                value={description}
                onChange={(e) => {
                  setdescription(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="my-2">
              更新
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
}
