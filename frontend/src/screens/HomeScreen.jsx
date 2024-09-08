import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../slices/productApiSlice";
import CategoryCards from "../components/CategoryCards";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";

export const HomeScreen = () => {
  const { pageNumber, keyword, category } = useParams(); // 取得category參數
  const { data, isLoading, isError, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    category, // 将 category 传递给查询
  });

  return (
    <>
      {!keyword && !category ? ( // 如果沒有keyword和category參數，顯示Carousel和CategoryCards
        <>
          <ProductCarousel />
          <CategoryCards />
        </>
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          回首頁
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1>{category ? `${category} 產品` : "最新產品"}</h1>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
