import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Spinner } from 'react-bootstrap';

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch danh sách requests từ API
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/request/get`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        
    });
      const result = await response.json();
      if (result.success) {
        setRequests(result.data);
      } else {
        setMessage('Failed to load requests');
      }
    } catch (error) {
      setMessage('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Gửi yêu cầu Accept hoặc Reject
  const updateRequestStatus = async (requestId, status) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/request/${status}/${requestId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (result.success) {
        setMessage(`Request ${status} successfully!`);
        fetchRequests(); // Refresh danh sách sau khi cập nhật
      } else {
        setMessage('Failed to update request');
      }
    } catch (error) {
      setMessage('Error updating request');
    }
  };

  // Xử lý khi bấm nút Accept
  const handleAccept = (requestId) => {
    updateRequestStatus(requestId, 'accept');
  };

  // Xử lý khi bấm nút Reject
  const handleReject = (requestId) => {
    updateRequestStatus(requestId, 'reject');
  };

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <h3>Pending Requests</h3>
      {message && <Alert variant="info">{message}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : requests.length === 0 ? (
        <p>No pending requests found.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Người dùng</th>
              <th>Lý do</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => (
              <tr key={req.id}>
                <td>{index + 1}</td>
                <td>{req.user.user_name}</td>
                <td>{req.reason}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleAccept(req.id)}
                  >
                    Đồng ý
                  </Button>{' '}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleReject(req.id)}
                  >
                    Từ chối
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default RequestList;
