import React, { useState, useEffect } from 'react';
import './Review.css';

const Review = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 1,
    review: '',
  });

  const getSavedReviews = () => {
    const savedReviews = localStorage.getItem('reviews');
    return savedReviews ? JSON.parse(savedReviews) : [];
  };

  const [reviews, setReviews] = useState(getSavedReviews());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      name: formData.name,
      rating: parseInt(formData.rating),
      review: formData.review,
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);

    localStorage.setItem('reviews', JSON.stringify(updatedReviews));

    setFormData({ name: '', email: '', rating: 1, review: '' });
  };

  return (
    <div className="review-page">
      <div className="review-banner">
        <div className="review-banner-overlay">
          <h1>Đánh giá sản phẩm</h1>
          <p>Chia sẻ cảm nhận của bạn về sản phẩm của chúng tôi!</p>
        </div>
      </div>

      {/* Chia sẻ ý kiến và Đánh giá */}
      <section className="review-content">
        <div className="review-form">
          <h2>Chia sẻ ý kiến của bạn</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Họ và tên</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="rating">Đánh giá (1-5)</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="1"
                max="5"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="review">Nhận xét</label>
              <textarea
                id="review"
                name="review"
                value={formData.review}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">Gửi đánh giá</button>
          </form>
        </div>

        <div className="reviews">
          <h2>Đánh giá khách hàng</h2>
          <div className="reviews-list">
            {reviews.map((review, index) => (
              <div key={index} className="review-item">
                <h3>{review.name}</h3>
                <div className="rating">
                  {'⭐'.repeat(review.rating)}
                </div>
                <p>{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Review;
