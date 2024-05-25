import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_API_URL;

export const storeContent = async (chatData) => {
  const token = localStorage.getItem('token');

  try {
    console.log("storeContent", chatData);
    const response = await axios.post(
      `${BASE_URL}/api/storechatdata`,
      chatData,
      {
        headers: {
          "Content-Type": "application/json",
          "authtoken": token
        },
      }
    );
    console.log("log from line 18 chatContent.js", response.data);
    return response.data;
  } catch (error) {
    console.log("Error sending data!", error);
    return { error: error.response.data || "Error storing data!" };
  }
};
