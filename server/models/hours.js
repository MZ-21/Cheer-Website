const mongoose = require('mongoose');
const { User } = require('./user'); 

const hoursSchema = new mongoose.Schema({
    username: { type: String, required: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    clockIn: { type: Date },
    clockOut: { type: Date },
    hoursWorked: { type: Number, default: 0 }
}, { collection: "Hours" });

hoursSchema.pre('save', async function (next) {
    try {
        const user = await User.findOne({ username: this.username }); 
        if (!user) {
            throw new Error('User not found');
        }
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        next();
    } catch (error) {
        next(error);
    }
});

const Hours = mongoose.model('Hours', hoursSchema);
module.exports = Hours;
