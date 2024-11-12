import React, { useState, useEffect } from 'react';
import { Rating } from 'react-simple-star-rating';
import { Row, Col, Button } from 'react-bootstrap';

// Component hiển thị đánh giá trung bình
function AverageRatingDisplay({ slug }) {
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/games/${slug}/vote`);
        if (response.ok) {
          const data = await response.json();
          setAverageRating(parseFloat(data.data.averageRating) || 0);
          setTotalReviews(data.data.totalRatings || 0);
        } else {
          console.error('Failed to fetch average rating');
        }
      } catch (error) {
        console.error('Error fetching average rating:', error);
      }
    };

    fetchAverageRating();
  }, [slug]);

  return (
    <div className="average-rating-display text-center">
      <h2>{averageRating.toFixed(1)}</h2>
      <Rating readonly={true} initialValue={averageRating} size={20} />
      <p>{totalReviews} bài đánh giá</p>
    </div>
  );
}

// Component đánh giá của người dùng
function UserRating({ slug }) {
  const [userVote, setUserVote] = useState(0);
  const [disableRating, setDisableRating] = useState(false);

  useEffect(() => {
    const fetchUserVote = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/games/${slug}/user-rating`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUserVote(data.data.rating || 0);
        } else if (response.status === 401) {
          setDisableRating(true); // Disable nếu chưa đăng nhập
        }
      } catch (error) {
        console.error('Error fetching user rating:', error);
      }
    };

    fetchUserVote();
  }, [slug]);

  const handleRating = async (rate) => {
    setUserVote(rate);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/games/${slug}/vote`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: rate }),
      });

      if (!response.ok) {
        console.error('Failed to update user rating');
      }
    } catch (error) {
      console.error('Error updating user rating:', error);
    }
  };

  const handleReset = () => {
    setUserVote(0);
  };

  return (
    <div className="user-rating text-center">
      <h3>Đánh giá của bạn</h3>
      <Rating
        onClick={handleRating}
        initialValue={userVote || 0}
        readonly={disableRating || !!userVote}
      />
      {userVote ? (
        <Button variant="outline-secondary" onClick={handleReset} className="mt-2">
          Đặt lại đánh giá
        </Button>
      ) : disableRating ? (
        <p>Vui lòng đăng nhập để đánh giá</p>
      ) : (
        <p>Vui lòng chọn số sao để đánh giá</p>
      )}
    </div>
  );
}

// Component tổng hợp
export function GameRating({ slug }) {
  return (
    <div className="game-rating">
      <Row>
        <Col md={6}>
          <AverageRatingDisplay slug={slug} />
        </Col>
        <Col md={6}>
          <UserRating slug={slug} />
        </Col>
      </Row>
    </div>
  );
}
