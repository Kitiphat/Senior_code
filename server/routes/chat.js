const express = require("express");
const { storeChatroomData, storeContent, chatHistory, deleteChatHistory, lastQuestion, checkChatroomId } = require("../controller/chat");
const router = express.Router();
const { auth } = require("../middleware/auth");

//storeChatroomData
//EndPoint http://localhost:3001/api/storechatdata
//Method POST
router.post("/storechatdata" ,auth , storeChatroomData,storeContent );

//chatHistory
//EndPoint http://localhost:3001/api/chathistory/:id
//Method GET
router.get("/chathistory/:id", auth, chatHistory);

//deleteChatHistory
//EndPoint http://localhost:3001/api/deletehistory/:id
//Method POST
router.post("/deletehistory", auth, deleteChatHistory);

//lastQuestion
//EndPoint http://localhost:3001/api/lastquestion/:id
//Method GET
router.get("/lastquestion/:id", auth, lastQuestion);

//lastQuestion
//EndPoint http://localhost:3001/api/lastquestion/:id
//Method GET
router.get("/checkuuid/:id", auth, checkChatroomId);

module.exports = router;