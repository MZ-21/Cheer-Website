import React, { useState } from 'react';
import axios from 'axios';
import './reviewForm.css';
const routerPath = `/api`;
const domainName = window.location.origin.split(':')[1].slice(2);
const backendUrl = `http://${domainName}:8080`; //using cors to connect the backend to the front end

const ReviewForm = ({ fetchReviews }) => {
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${backendUrl}${routerPath}/submitReview`, { reviewText });
      setReviewText('');
      if (fetchReviews) fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div className="review-form">
      <form onSubmit={handleSubmit}>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Leave a review..."
          required
        />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewForm;