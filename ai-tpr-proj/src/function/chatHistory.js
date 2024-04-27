import axios from "axios";

export const chatHistory = async (id) => {
  const token = localStorage.getItem('token');
  
  try {
   
    const response = await axios.get(
      `http://localhost:3001/api/chathistory/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "authtoken": token // Include the token in the request headers
        },
      }
    );  // send data to server
    return response.data;
  } catch (error) {
    console.log("Error sending data!", error);
    return { error: error.response.data || "Error storing data!" };
  }
};

export const deleteHistory = async (id) => {
    const token = localStorage.getItem('token');
    
    try {
        
      const response = await axios.post(
        `http://localhost:3001/api/deletehistory`,{chatroomId: id},
        {
          headers: {
            "Content-Type": "application/json",
            "authtoken": token // Include the token in the request headers
          },
        }
      );  // send data to server
      return response.status;
    } catch (error) {
      console.log("Error sending data!", error);
      return { error: error.response.data || "Error storing data!" };
    }
  };

  export const lastQuestion = async (id) => {
    const token = localStorage.getItem('token');
    
    try {
     
      const response = await axios.get(
        `http://localhost:3001/api/lastquestion/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "authtoken": token // Include the token in the request headers
          },
        }
      );  // send data to server
      return response.data;
    } catch (error) {
      console.log("Error sending data!", error);
      return { error: error.response.data || "Error storing data!" };
    }
  };

  export const checkChatroomId = async (id) => {
    const token = localStorage.getItem('token');
    
    try {
     
      const response = await axios.get(
        `http://localhost:3001/api/checkuuid/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "authtoken": token // Include the token in the request headers
          },
        }
      );  // send data to server
      return response.data;
    } catch (error) {
      console.log("Error sending data!", error);
      return { error: error.response.data || "Error storing data!" };
    }
  }