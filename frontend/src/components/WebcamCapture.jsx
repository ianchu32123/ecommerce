import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";

const WebcamCapture = ({ show, handleClose, onAgeVerified }) => {
  const webcamRef = useRef(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then((res) => res.blob());
    const formData = new FormData();
    formData.append("image", blob, "capture.jpg");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/face/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data);
      setIsLoading(false);
      onAgeVerified(response.data[0].age > 18);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setIsLoading(false);
    }
  }, [webcamRef, onAgeVerified]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>年齡驗證</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
        />
        <Button onClick={capture} disabled={isLoading}>
          {isLoading ? "驗證中..." : "拍照並驗證"}
        </Button>
        {result && (
          <div>
            <h2>結果</h2>
            <p>年齡: {result[0].age}</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          關閉
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WebcamCapture;
