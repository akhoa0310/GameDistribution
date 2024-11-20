import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";

const PublisherRequest = () => {
  const [show, setShow] = useState(false);
  const [reason, setReason] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setReason(""); // Clear the reason when modal is closed
    setResponseMessage("");
    setError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/request/publisher`, {
        method: "POST",
        credentials:'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMessage("Request sent successfully!");
        setError(false);
      } else {
        setResponseMessage(data.message || "Something went wrong!");
        setError(true);
      }
    } catch (err) {
      setResponseMessage("Failed to send request!");
      setError(true);
    }
  };

  return (
    <div>
      {/* Button to trigger modal */}
      <Button variant="primary" onClick={handleShow}>
        Request Publisher Access
      </Button>

      {/* Modal Form */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Request Publisher Access</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="reason">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Submit
            </Button>
          </Form>
          {responseMessage && (
            <Alert variant={error ? "danger" : "success"} className="mt-3">
              {responseMessage}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PublisherRequest;
