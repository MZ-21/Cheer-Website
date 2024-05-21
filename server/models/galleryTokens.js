// Require mongoose
const mongoose = require('mongoose');

// Define token schema
const tokenGSchema = new mongoose.Schema({
accessToken: {
    type: String,
    required: true 
},
refreshToken: {
    type: String,
    required: true 
},
accessTokenExpiresAt: {
    type: Date,
    required: true
},
createdAt:{
    type: Date, 
    default: Date.now()
}
});

// Create token model
const TokenG = mongoose.model('TokenPhotos', tokenGSchema);

// Export the model
module.exports = TokenG;
