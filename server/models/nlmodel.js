const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  title: String,
  pdf: String,
  uploadDate: Date,
});

module.exports = mongoose.model('Newsletters', newsletterSchema);
