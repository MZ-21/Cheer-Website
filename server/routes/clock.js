const express = require('express');
const router = express.Router();
const Hours = require("../models/hours");
const { User } = require('../models/user');



router.post('/clock/update', async (req, res) => {
    try {
        const { username, clockIn, clockOut } = req.body;

        // Check if clockIn and clockOut are provided in the request body
        if (!clockIn && !clockOut) {
            return res.status(400).json({ message: 'Both clockIn and clockOut are required' });
        }

        // Ensure the user exists and fetch their firstName and lastName
        const user = await User.collection.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { firstName, lastName } = user;

        // If both clockIn and clockOut are provided
        if (clockIn && clockOut) {
            const hoursRecord = new Hours({
                username,
                firstName,
                lastName,
                clockIn: new Date(clockIn),
                clockOut: new Date(clockOut),
                hoursWorked: calculateHoursWorked(clockIn, clockOut)
            });
            await hoursRecord.save(); // Make sure to save the new record
            return res.status(200).json({ message: 'Clock-in and clock-out recorded successfully', hoursWorked: hoursRecord.hoursWorked });
        }

        if (clockIn) {
            // Handling clock-in only
            const hoursRecord = new Hours({ username, firstName, lastName, clockIn: new Date(clockIn) });
            await hoursRecord.save();
            return res.status(200).json({ message: 'Clock-in recorded successfully' });
        }

        if (clockOut) {
            const hoursRecord = await Hours.findOne({ username, clockOut: { $exists: false } }).sort({ clockIn: -1 });
            if (!hoursRecord) {
                return res.status(404).json({ message: 'Clock-in record not found for user' });
            }

            hoursRecord.clockOut = new Date(clockOut);
            hoursRecord.hoursWorked = calculateHoursWorked(hoursRecord.clockIn, clockOut);
            await hoursRecord.save();
            return res.status(200).json({ message: 'Clock-out recorded successfully, hours worked updated', hoursWorked: hoursRecord.hoursWorked });
        }

        // If the request does not meet any of the above conditions, it's an invalid request
        return res.status(400).json({ message: 'Invalid request' });
    } catch (error) {
        console.error('Error handling clock-in/out:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Helper function to calculate hours worked
function calculateHoursWorked(clockIn, clockOut) {
    return (new Date(clockOut).getTime() - new Date(clockIn).getTime()) / (1000 * 60 * 60);
}

module.exports = router;
