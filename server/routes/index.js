require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/adminPdfs', express.static('adminPdfs'));
app.use('/newsletters', express.static('newsletters'));
app.use('/files', express.static('files'));
app.use('/paystubs', express.static(path.join(__dirname, 'paystubs')));

// MongoDB connection

const uri = "mongodb+srv://elwazirisra:rxg19LP6IH8JYVTF@cluster0.o72afec.mongodb.net/?retryWrites=true&w=majority" 
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to the database"))
.catch((error) => console.error("Database connection error:", error));

// Routes
const userRoutes = require("./users");
const authRoutes = require("./auth");
const fileRoutes = require("./fileControl");
const fileAccessRoutes = require("./pdfAccess");
const formsByadminRoutes = require("./pdfsByAdmin");
const formAccessRoutes = require("./formAccess");
const googleRoutes = require("./google"); // Google route
const newsletterRoutes = require("./newsletter"); // Newsletter route
const textToSpeechRoutes = require("./text-speech"); // Text to speech route
const clockRoutes = require("./clock");

const galleryRoutes = require("./gallery"); // Gallery route
const chatRoutes = require("./chat");
const payrollRoutes = require("./payroll");
const paystubRoutes = require("./paystub");
const reviewRoutes = require("./reviewManager");

app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", fileRoutes);
app.use("/api", fileAccessRoutes);
app.use("/api", formsByadminRoutes);
app.use("/api", formAccessRoutes);
app.use("/api", googleRoutes);
app.use("/api", galleryRoutes);
app.use("/api", newsletterRoutes);
app.use("/api", textToSpeechRoutes);
app.use("/api", clockRoutes);
app.use("/api", chatRoutes);
app.use("/api", payrollRoutes);
app.use("/api", paystubRoutes);
app.use("/api", reviewRoutes);


// Starting the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
