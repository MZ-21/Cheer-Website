require("../models/pdf");
const router = require("express").Router();
const mongoose = require("mongoose")
require("../models/adminUploadPDF");
const PdfForms= mongoose.model("PdfAdmin")



// for clients to get the forms they need from admin

router.get("/getForms", async (req, res) => {
	try {
        console.log("here in get forms")
        PdfForms.find({}).then(data=>{

            res.json({status:  "ok", data:data})
        });
		
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error "+error});
	}
});


module.exports = router;