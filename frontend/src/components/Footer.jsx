import React from "react";
import { Container, Row, Col } from "react-bootstrap";
function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <footer>
        <Container>
          <Row>
            <Col className="text-center py-3">
              <p>臉部年齡辨識@NCUMIS2024 &copy; {currentYear}</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}

export default Footer;
