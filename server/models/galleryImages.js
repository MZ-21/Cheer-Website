const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  baseUrl: { type: String, required: true },
  filename: { type: String, required: true },
  imageId: { type: String, required: true, unique: true }, // Assuming this is the unique identifier for the image
  creationTime: { type: Date },
  height: { type: Number },
  width: { type: Number },
  mimeType: { type: String },
  productUrl: { type: String },
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;