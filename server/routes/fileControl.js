const fs = require('fs');
const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const multer  = require('multer')
require("../models/pdf");
const PdfDetails = mongoose.model("PdfDetails")


//client uploading files

//defining the location of where our pdf files will be stored
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      makeDirectory();
      cb(null, './files')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()
      cb(null,uniqueSuffix+file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })


function makeDirectory(){
  const createDirIfNotExists = dir =>
      !fs.existsSync(dir) ? fs.mkdirSync(dir) : undefined;
    
      createDirIfNotExists('files'); 
}
router.post("/upload", upload.single("file"), async (req, res) => {
	try {
       
        const title = req.body.title;
       
        const fileName = req.file.filename;
      
        const file = await new  PdfDetails({title: title, pdf:fileName}).save()
 
        res.json({status: "ok"});
  
    
	
	
		
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error "+error});
	}
});


module.exports = router;