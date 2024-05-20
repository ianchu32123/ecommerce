import React from "react";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function CheckoutSteps({ step1, step2, step3, step4 }) {
  return (
    <Nav className="justify-content-center mb-4">
      <Nav.Item>
        {step1 ? (
          <LinkContainer to="/login">
            <Nav.Link>
              登入 <FontAwesomeIcon icon={faArrowRight} />
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>
            登入 <FontAwesomeIcon icon={faArrowRight} />
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <LinkContainer to="/shipping">
            <Nav.Link>
              運送 <FontAwesomeIcon icon={faArrowRight} />
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>
            運送 <FontAwesomeIcon icon={faArrowRight} />
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <LinkContainer to="/payment">
            <Nav.Link>
              支付 <FontAwesomeIcon icon={faArrowRight} />
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>
            支付 <FontAwesomeIcon icon={faArrowRight} />
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <LinkContainer to="/placeorder">
            <Nav.Link>
              送出訂單 <FontAwesomeIcon icon={faArrowRight} />
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>送出訂單</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
}
