const express = require('express');
const path = require('path');
const router = express.Router();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Hours = require('../models/hours'); // Ensure this path matches your structure
const User = require('../models/user'); // Assuming there's a User model

const hourlyRate = 15; // Set this to your actual hourly rate

async function generatePayStubCSV(username) {
    console.log(`[generatePayStubCSV] Starting process for username: ${username}`);
    try {
        console.log(`[generatePayStubCSV] Fetching hours worked data for ${username}`);
        const user = await Hours.find({ username }).exec(); 
        if (!user) {
            console.log(`[generatePayStubCSV] User ${username} not found.`);
            return null;
        }

        const hoursWorkedData = await Hours.find({ username }).exec();
        console.log(`[generatePayStubCSV] Data fetched:`, hoursWorkedData.length, 'entries found');

        const directoryPath = path.join(__dirname, 'paystubs');
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, {recursive: true});
            console.log(`[generatePayStubCSV] Created directory: ${directoryPath}`)
        }

        if (hoursWorkedData.length === 0) {
            console.log(`[generatePayStubCSV] No hours worked data found for ${username}.`);
            return null;
        }

        console.log(`[generatePayStubCSV] Processing data for CSV...`);
        const csvData = hoursWorkedData.map(entry => {
            const hoursWorked = ((entry.clockOut - entry.clockIn) / (1000 * 60 * 60));
            const totalAmountPaid = hoursWorked * hourlyRate;
            const generatedOn = new Date().toISOString();
            return {
                Username: entry.username,
                FirstName: entry.firstName,
                LastName: entry.lastName,
                HoursWorked: hoursWorked.toFixed(4),
                TotalAmountPaid: totalAmountPaid.toFixed(2),
                GeneratedOn: generatedOn
            };
        });

        console.log(`[generatePayStubCSV] Data processed. Preparing to write CSV.`);
        const csvFilePath = path.join(directoryPath, `${username}_pay_stub.csv`);
        const csvWriter = createCsvWriter({
            path: csvFilePath,
            header: [
                { id: 'Username', title: 'Username' },
                { id: 'FirstName', title: 'First Name' },
                { id: 'LastName', title: 'Last Name' },
                { id: 'HoursWorked', title: 'Hours Worked' },
                { id: 'TotalAmountPaid', title: 'Total Amount Paid' },
                { id: 'GeneratedOn', title: 'Generated On' }
            ]
        });

        await csvWriter.writeRecords(csvData);
        console.log(`CSV file generated successfully for ${username}.`);
        return csvFilePath;

    } catch (error) {
        console.error('Error generating CSV:', error);
        throw error;
    }
}

router.post('/generate', async (req, res) => {
    const { username } = req.body;
    try {
        const csvFilePath = await generatePayStubCSV(username);
        if (csvFilePath) {
            // Generate a URL for the file
            const fileUrl = `${req.protocol}://${req.get('host')}/paystubs/${path.basename(csvFilePath)}`;
            res.status(200).json({ message: 'Pay stub CSV generated successfully.', url: fileUrl });
        } else {
            res.status(404).send(`No hours worked data found for ${username}.`);
        }
    } catch (error) {
        res.status(500).send('Error generating pay stub CSV.');
    }
});

router.get('/paystubs/:filename', (req, res) => {
    const filename = req.params.filename;
    const directoryPath = path.join(__dirname, 'paystubs');
    const filePath = path.join(directoryPath, filename);
  
    res.download(filePath, filename, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
  });
  


module.exports = router;
