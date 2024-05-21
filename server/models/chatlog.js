const mongoose = require('mongoose');

const chatLog = new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
});

module.exports = mongoose.model('chatlog', chatLog);
