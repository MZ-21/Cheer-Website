const mongoose = require("mongoose")


const TokenGoogle = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
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

const GoogleTokenModel = mongoose.model("googleaccesstoken", TokenGoogle);
module.exports= { GoogleTokenModel };