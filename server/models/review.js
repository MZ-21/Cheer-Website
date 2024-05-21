// Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  username: String,
  reviewText: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
