const express = require("express");
const { signUp, signIn } = require("../controller/auth");
const router = express.Router();


//signUp
//EndPoint http://localhost:3001/api/signup
//Method POST
router.post("/signup" , signUp );

//signIn
//EndPoint http://localhost:3001/api/signin
//Method POST
router.post("/signin" , signIn);


module.exports = router;

