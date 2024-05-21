const fs = require('fs');
const router = require("express").Router();
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const multer  = require('multer')
require("../models/adminUploadPDF");
const PdfForms = mongoose.model("PdfAdmin")


//client uploading files

//defining the location of where our pdf files will be stored
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      makeDirectory();
      cb(null, './adminPdfs')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()
      cb(null,uniqueSuffix+file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })





router.post("/adminDeleteFile", async (req, res) => {
	try {

        console.log("in dlete")

        // console.log("in dlete", title)
        // const fileName = req.file.filename;
        PdfForms.findOneAndDelete({}).then(data=>{
            res.json({status:  "successfully deleted"})
        });		

	} catch (error) {
		res.status(500).json({ message: "Internal Server Error "+error});
	}
});

function makeDirectory(){
  const createDirIfNotExists = dir =>
      !fs.existsSync(dir) ? fs.mkdirSync(dir) : undefined;
    
      createDirIfNotExists('adminPdfs'); 
}

router.post("/adminupload", upload.single("file"), async (req, res) => {
	try {
        const title = req.body.title;
        const fileName = req.file.filename;
        const file = await new  PdfForms({title: title, pdf:fileName}).save()
        res.json({status: "file successfully uploaded"});

	} catch (error) {
		res.status(500).json({ message: "Internal Server Error "+error});
	}
});

module.exports = router;