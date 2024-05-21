require("../models/pdf");
const router = require("express").Router();
const express = require('express');
const mongoose = require("mongoose")
require("../models/pdf");
const PdfDetails = mongoose.model("PdfDetails")


// app.use("/files", express.static("files"))
//defining the location of where our pdf files will be stored

// admin accessing documents from clients
router.get("/getPdfs", async (req, res) => {
	try {
	
        PdfDetails.find({}).then(data=>{
            res.json({status:  "ok", data:data})
        });
  

	
	
		
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error "+error});
	}
});



module.exports = router;