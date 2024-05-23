import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_API_URL;

export const chatHistory = async (id) => {
  const token = localStorage.getItem('token');
  
  try {
   
    const response = await axios.get(
      ` ${BASE_URL}api/chathistory/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "authtoken": token // Include the token in the request headers
        },
      }
    );  // send data to server
    return response.data;
  } catch (error) {
    console.log("Error sending data! chatHistory", error);
    return { error: error.response.data || "Error storing data!" };
  }
};

export const deleteHistory = async (id) => {
    const token = localStorage.getItem('token');
    
    try {
        
      const response = await axios.post(
        `${BASE_URL}api/deletehistory`,{chatroomId: id},
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
        `${BASE_URL}api/lastquestion/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "authtoken": token // Include the token in the request headers
          },
        }
      );  // send data to server
      console.log("data from function lastQuestion",response.data);
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
        `${BASE_URL}api/checkuuid/${id}`,
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


  export const showMostPlaceCounts = async () => {
    const token = localStorage.getItem('token');
    
    try {
     
      const response = await axios.get(
        `${BASE_URL}api/showtopplace`,
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