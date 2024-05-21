const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

//login route

router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user){
			return res.status(401).json({ message: "Invalid Email or Password" });
		}

		
		//if the user has been verified by the admin, compare the passwords
		if(user.verified){
		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		
		if (!validPassword){
			return res.status(401).json({ message: "Invalid Email or Password" });
		}
		else{
		const token = user.generateAuthToken();
		res.status(200).json({ data: token, message: "logged in successfully" });
		}
	}
	else{
		return res.status(401).json({ message: "Invalid Email or Password" });
	}
	
		
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
});

// used to get userType
router.get("/login", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.query.email });
		if (!user){
			return res.status(401).json({ data: '', message: "Unknown user" });
		}

		else{
		res.status(200).json({ data: user.userType, username: user.username, message: "user found" });
		}
		
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
});

const validate = (data) => {

	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;