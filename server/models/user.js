const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Joi = require("joi")
require('dotenv').config()
const passwordComplexity = require("joi-password-complexity")
const {isEmail} = require('validator')


const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: [true,  "Please enter the first name"],
        lowercase: true
   
    },
    lastName:{
        type: String,
        required: [true,  "Please enter your last name"],
        lowercase: true
   
    },
    medicalCondition:{ 
        type: String
    },
    allergies:{ 
        type: String

    },
    extraInfo:{ 
        type: String

    },
    email:{
         type: String,
         required: [true, 'Please enter an email '],
         unique: [true, 'You already have an account! login!'],
         lowercase: true,
         validate: [isEmail, 'Please enter a valid email']
     },
     password:{
         type: String,
         required: [true, 'Please enter a password'],
         minLength: [8, 'Password has to be 8 characters minimum']
     },
     username:{ 
         type: String,
         required: true,
         unique: [true, 'Username is taken, try another name!']
     },
     userType:{ 
        type: String,
        required: true
    },
     verified:{
         type: Boolean,
         default: false
     } ,
     relationship:{
         type: String,
         default: "none"
     }
    
     
  })

  userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.SECRET, {
		expiresIn: "7d",
	});
	return token;
};

const User = mongoose.model("user", userSchema);
const validate = (data) => {
    if(data.userType == "Client"){

        const schema = Joi.object({
            firstName: Joi.string().required().label("First Name"),
            lastName: Joi.string().required().label("Last Name"),
            medicalCondition: Joi.string().allow("").optional().label("Medical Condition"),
            allergies: Joi.string().allow("").label("Allergies"),
            extraInfo: Joi.string().allow("").label("Extra Info"),
            relationship: Joi.string().allow("").label("Relationship"),
            email: Joi.string().email().required().label("Email"),
            userType: Joi.string().required().label("User Type"),
            password: Joi.string().allow("").label("Password"),
            username: Joi.string().label("Username"),
            hoursWorked: Joi.string().default("none").label("Hours Worked")
        });
        return schema.validate(data);
    }
    else{
       console.log("not a client")
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        medicalCondition: Joi.string().allow("").optional().label("Medical Condition"),
        allergies: Joi.string().allow("").label("Allergies"),
        extraInfo: Joi.string().allow("").label("Extra Info"),
        relationship: Joi.string().allow("").label("Relationship"),
        email: Joi.string().email().required().label("Email"),
        userType: Joi.string().required().label("User Type"),
        password: passwordComplexity().required().label("Password"),
        username: Joi.string().label("Username"),
        hoursWorked: Joi.string().default("none").label("Hours Worked")
    });
    return schema.validate(data);
}
};
module.exports = { User, validate };

  