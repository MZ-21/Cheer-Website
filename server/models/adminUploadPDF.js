const mongoose = require('mongoose');
const { collection } = require('./token');


const PdfFormsSchema= new mongoose.Schema({
    pdf:String,
    title:String

},{collection:"PdfForms"})

const PdfForms = mongoose.model("PdfAdmin",PdfFormsSchema);