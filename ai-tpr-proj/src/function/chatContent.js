import axios from "axios";

export const storeContent = async (chatData) => {
  const token = localStorage.getItem('token');
  
  try {
    console.log("storeContent", chatData);
    const response = await axios.post(
      "http://localhost:3001/api/storechatdata",
      chatData,
      {
        headers: {
          "Content-Type": "application/json",
          "authtoken": token // Include the token in the request headers
        },
      }
    );  // send data to server
    console.log("log from line 18 chatContent.js",response.data); // Log response data
    return response.data;
  } catch (error) {
    console.log("Error sending data!", error);
    return { error: error.response.data || "Error storing data!" };
  }
};

