const mongoose = require('mongoose');
const fs = require('fs');
const router = require("express").Router();
const multer = require('multer');
require("../models/nlmodel");
const Newsletter = mongoose.model("Newsletters");

// Define the storage location and filenames for our PDF files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    makeDirectory();
    cb(null, './newsletters')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  }
})

const upload = multer({ storage: storage });

// Helper function to create the directory if it doesn't exist
function makeDirectory() {
  const dir = './newsletters';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Upload a newsletter PDF
router.post("/uploadNewsletter", upload.single("file"), async (req, res) => {
  try {
    const title = req.body.title; 
    const fileName = req.file.filename; // The stored filename
    const newNewsletter = await new Newsletter({
      title: title,
      pdf: fileName,
      uploadDate: new Date(),
    }).save();
    res.json({ status: "Newsletter successfully uploaded", details: newNewsletter });
    console.log("Newsletter successfully uploaded");
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error " + error });
  }
});

router.post("/deleteNewsletter", async (req, res) => {
  try {
    const { id } = req.body; 
    const deletedNewsletter = await Newsletter.findByIdAndDelete(id);
    if (deletedNewsletter) {
      res.json({ status: "Successfully deleted", details: deletedNewsletter });
    } else {
      res.status(404).json({ message: "Newsletter not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error " + error });
  }
});

router.get("/latestNewsletter", async (req, res) => {
  try {
    const latestNewsletter = await Newsletter.findOne({}).sort({ uploadDate: -1 });
    if (latestNewsletter) {
      res.json(latestNewsletter);
    } else {
      res.status(404).json({ message: "No newsletters found" });
      console.log("No newsletters found");
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error " + error });
  }
});


module.exports = router;
