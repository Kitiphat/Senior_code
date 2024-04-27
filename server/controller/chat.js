const pool = require("../config/db");

exports.storeChatroomData = async (req, res, next) => {
  try {
    const { chatroomId, id } = req.body;
    const user_id = req.user.userId;

    // Get the current local time in UTC format
    const currentTime = new Date();

    // Adjust the time to GMT+7 (Indochina Time)
    currentTime.setHours(currentTime.getHours() + 7);

    // Format the adjusted time to match PostgreSQL's timestamp format
    const formattedTime = currentTime
      .toISOString()
      .replace("T", " ")
      .slice(0, -5);
    const selected_chatroom = await pool.query(
      "SELECT * FROM chatroom_data WHERE chatroom_path_id = $1",
      [chatroomId]
    );
    if (selected_chatroom?.rows[0]?.chatroom_path_id !== chatroomId) {
      
      // Use the formatted time to set create_at and update_at timestamps
      const result = await pool.query(
        "INSERT INTO chatroom_data (chatroom_path_id, user_id, update_at, is_enable, create_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [chatroomId, user_id, formattedTime, 0, formattedTime] // Provide values for placeholders in the query
      );
    }else{
      const result = await pool.query(
        "UPDATE chatroom_data SET update_at = $1 WHERE chatroom_path_id = $2",
        [formattedTime, chatroomId] // Provide values for placeholders in the query
      );
    }

    next();
  } catch (error) {
    // Handle errors appropriately
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while storing chatroom data" });
  }
};

exports.storeContent = async (req, res) => {
  try {
    const { chatroomId, answer, question } = req.body;
    const user_id = req.user.userId;

    // Get the current local time in UTC format
    const currentTime = new Date();

    // Adjust the time to GMT+7 (Indochina Time)
    currentTime.setHours(currentTime.getHours() + 7);

    // Format the adjusted time to match PostgreSQL's timestamp format
    const formattedTime = currentTime
      .toISOString()
      .replace("T", " ")
      .slice(0, -5);

    // Insert into user_questions and get the inserted row
    const selected_question = await pool.query(
      "INSERT INTO user_questions (chatroom_path_id, user_id, user_question_content, create_at, update_at, is_enable) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [chatroomId, user_id, question, formattedTime, formattedTime, 0]
    );
    const question_id = selected_question.rows[0].question_id;

    //Insert into chat_answer
    const result = await pool.query(
      "INSERT INTO chat_answer (chatroom_path_id, user_id, content_messages, create_at, update_at, is_enable, question_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        chatroomId,
        user_id,
        answer,
        formattedTime,
        formattedTime,
        0,
        question_id,
      ]
    );
  } catch (error) {
    // Handle errors appropriately
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while storing chat content" });
  }
};

exports.chatHistory = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const chatroomId = req.params.id;
    const result = await pool.query(
      "SELECT a.user_id, a.chatroom_path_id, a.user_question_content, b.content_messages FROM public.user_questions a JOIN chat_answer b ON a.question_id = b.question_id WHERE a.is_enable = 0 AND b.is_enable = 0 AND a.user_id = $1 AND a.chatroom_path_id = $2 ORDER BY COALESCE(b.update_at, b.create_at) ",
      [user_id, chatroomId]
    );
    if(result.rows.length === 0){
      return res.status(404).json({ error: "No chat history found" });
    }
    res.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while fetching chat history" });
  }
}

exports.deleteChatHistory = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { chatroomId } = req.body;

    const updateUserQuestions = await pool.query(
      "UPDATE public.user_questions SET is_enable = 1 WHERE user_id = $1 AND chatroom_path_id = $2",
      [user_id, chatroomId]
    );
    if(updateUserQuestions.rowCount === 0){
      return res.status(404).json({ error: "No chat history 1 found" });
    }
   
    
    const updateChatAnswer = await pool.query(
      "UPDATE chat_answer SET is_enable = 1 WHERE user_id = $1 AND chatroom_path_id = $2",
      [user_id, chatroomId]
    );
    if(updateChatAnswer.rowCount === 0){
      return res.status(404).json({ error: "No chat history 2 found" });
    }
    const updateChatroomData = await pool.query(
      "UPDATE chatroom_data SET is_enable = 1 WHERE user_id = $1 AND chatroom_path_id = $2",
      [user_id, chatroomId]
    );
    if(updateChatroomData.rowCount === 0){
      return res.status(404).json({ error: "No chat history 3 found" });
    }
    res.json({ message: "Chat history deleted successfully" });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while deleting chat history" });
  }
}

exports.lastQuestion = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const chatroomId = req.params.id;
    const result = await pool.query(
      "SELECT a.user_id, a.chatroom_path_id, a.user_question_content FROM public.user_questions a WHERE a.user_id = $1 AND a.chatroom_path_id = $2 ORDER BY COALESCE(a.update_at, a.create_at) DESC LIMIT 1",
      [user_id, chatroomId]
    );
    if(result.rows.length === 0){
      return res.status(404).json({ error: "No chat history found" });
    }
    res.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while fetching chat history" });
  }
}

exports.checkChatroomId = async (req, res, next) => {
  try {
    const chatroomId = req.params.id;
    const selected_chatroom = await pool.query(
      "SELECT * FROM chatroom_data WHERE chatroom_path_id = $1",
      [chatroomId]
    );
    if (selected_chatroom?.rows[0]?.chatroom_path_id !== chatroomId) {
      return res.status(404).json({ error: "Chatroom not found" });
    }
    res.json(selected_chatroom.rows[0]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while checking chatroom" });
  }
}