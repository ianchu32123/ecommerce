import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  useGetProductsDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productApiSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { addToCart } from "../slices/cartSlice";
import Meta from "../components/Meta";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function ProductScreen() {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [rating, setrating] = useState(0);
  const [comment, setcomment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductsDetailsQuery(productId);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = function () {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const submitHandler = async function (e) {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("評論提交成功");
      setrating(0);
      setcomment("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );
  }

  if (!product) {
    return <Message variant="danger">找不到該產品</Message>;
  }

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        回到首頁
      </Link>
      <>
        <Meta title={product.name} />
        <Row>
          <Col md={5}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews}則評價`}
                />
              </ListGroup.Item>
              <ListGroup.Item>價格: {product.price}</ListGroup.Item>
              <ListGroup.Item>產品描述: {product.description}</ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>價格:</Col>
                    <Col>
                      <strong>{product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>狀態:</Col>
                    <Col>
                      <strong>
                        {product.countInStock > 0 ? "有庫存" : "無庫存"}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>數量</Col>
                      <Col>
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <Button
                    className="btn-block"
                    type="button"
                    disabled={product.countInStock === 0}
                    onClick={addToCartHandler}
                  >
                    加入購物車
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
        <Row className="review">
          <Col md={6}>
            <h2>評論</h2>
            {product.reviews.length === 0 && <Message>沒有評價</Message>}
            <ListGroup variant="flush">
              {product.reviews.map((review) => (
                <ListGroup.Item key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating value={review.rating} />
                  <p>
                    {review.createdAt
                      ? review.createdAt.substring(0, 10)
                      : "無日期"}
                  </p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}
              <ListGroup.Item>
                <h2>寫點評論吧</h2>
                {loadingProductReview && <Loader />}

                {userInfo ? (
                  <Form onSubmit={submitHandler}>
                    <Form.Group controlId="rating" className="my-2">
                      <Form.Label>評分</Form.Label>
                      <Form.Control
                        as="select"
                        value={rating}
                        onChange={(e) => setrating(Number(e.target.value))}
                      >
                        <option value="">選擇</option>
                        <option value="1">1-爛</option>
                        <option value="2">2-不太好</option>
                        <option value="3">3-普通</option>
                        <option value="4">4-好</option>
                        <option value="5">5-超讚</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="comment" className="my-2">
                      <Form.Label>評論</Form.Label>
                      <Form.Control
                        as="textarea"
                        row="3"
                        value={comment}
                        onChange={(e) => setcomment(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                    <Button
                      disabled={loadingProductReview}
                      type="submit"
                      variant="primary"
                    >
                      提交
                    </Button>
                  </Form>
                ) : (
                  <Message>
                    要寫些甚麼嗎，請<Link to="/login">登入</Link>{" "}
                  </Message>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </>
    </>
  );
}
