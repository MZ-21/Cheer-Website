const mongoose = require("mongoose")
const Schema = mongoose.Schema

const gcTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    token:{
        type: String,
        required: true 
    },
    createdAt:{
        type: Date, default: Date.now(), expires: 3600
    }
});

module.exports= mongoose.model("GCToken", gcTokenSchema)