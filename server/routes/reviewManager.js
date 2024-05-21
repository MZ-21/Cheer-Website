const express = require('express');
const router = express.Router();
const Review = require('../models/review'); // Adjust the path as needed
const User = require('../models/user'); // Adjust the path as needed

// Get all reviews
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Post a new review
router.post('/submitReview', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a review (admin only)
router.delete('/:id', async (req, res) => {
    try {
      
        const users = await User.find({ userType: 'Admin' });
        if (!users){
            return res.status(401).json({ data: '', message: "Unknown users" });
        }
    
        else{
            await Review.findByIdAndDelete(req.params.id);
            res.status(200).send('Review deleted');
        }
    }
        catch (error) {
        res.status(500).send(error.message);
        }
    });
    

module.exports = router;
