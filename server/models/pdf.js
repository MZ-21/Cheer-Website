const mongoose = require('mongoose');
const { collection } = require('./token');


const PdfDetailsSchema= new mongoose.Schema({
    pdf:String,
    title:String

},{collection:"PdfDetails"})

const PdfDetails = mongoose.model("PdfDetails",PdfDetailsSchema );


