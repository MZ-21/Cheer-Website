const express = require('express');
const router = express.Router();
const { User } = require('../models/user'); // Adjust the import path as needed
const Hours = require('../models/hours'); // Adjust the import path as needed

// Helper function to calculate total pay
function calculateTotalPay(hoursWorked) {
    const hourlyRate = 15; // Example hourly rate ($15 per hour), adjust as necessary
    return hoursWorked * hourlyRate;
}

// Endpoint to get a list of staff members and their total hours worked and total pay
router.get("/staffList", async (req, res) => {
    try {
        console.log("Fetching staff members...");
        const staffMembers = await User.find({ userType: 'Staff' }).lean();

        if (staffMembers.length === 0) {
            console.log("No staff members found");
            return res.status(404).json({ message: "No staff members found" });
        }

        console.log(`Found ${staffMembers.length} staff members. Processing details...`);
        const staffDetails = await Promise.all(staffMembers.map(async (staff) => {
            console.log(`Fetching hours for ${staff.username}...`);
            const hoursRecords = await Hours.find({ username: staff.username }).lean();

            // Calculate total hours worked
            const totalHoursWorked = hoursRecords.reduce((total, record) => {
                const hours = (new Date(record.clockOut).getTime() - new Date(record.clockIn).getTime()) / (1000 * 60 * 60); // Convert milliseconds to hours
                return total + hours;
            }, 0);

            console.log(`Total hours for ${staff.username}: ${totalHoursWorked}`);
            return {
                name: staff.username,
                email: staff.email,
                totalHoursWorked: totalHoursWorked.toFixed(2),
                totalPay: calculateTotalPay(totalHoursWorked).toFixed(2),
            };
        }));

        console.log("Sending response with staff details...");
        res.status(200).json({ staff: staffDetails, message: "Staff members found with hours and pay" });
    } catch (error) {
        console.error('Error fetching staff list:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Export the router to be used in other parts of the app
module.exports = router;
