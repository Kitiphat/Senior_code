const express = require("express");
const router = express.Router();
const { listUser } = require("../controller/user");
const { auth } = require("../middleware/auth");

//listUser
//EndPoint http://localhost:3001/api/users
//Method GET
router.get("/users" ,auth ,listUser );

module.exports = router;