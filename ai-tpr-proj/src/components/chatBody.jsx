import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Text, Input, Button, FormControl, IconButton, ToastProvider } from '@chakra-ui/react';
import { FaPaperPlane } from "react-icons/fa";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { storeContent } from '../function/chatContent';
import './ScrollBar.css';
import './Button.css'
import { toast, ToastContainer } from 'react-toastify';
import { chatHistory, lastQuestion } from '../function/chatHistory';



const ChatMain = () => {
  const chatContainerRef = useRef(null);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const { id } = useParams();
  const [promptList, setPromptList] = useState([]);
  const [showPrompt, setShowPrompt] = useState(true);
  const examPrompt = ["ช่วยแนะนำสถานที่ท่องเที่ยวเกี่ยวกับน้ำตก", "ช่วยแนะนำสถานที่ท่องเที่ยวเกี่ยวกับน้ำตก", "ช่วยแนะนำสถานที่ท่องเที่ยวเกี่ยวกับน้ำตก", "ช่วยแนะนำสถานที่ท่องเที่ยวเกี่ยวกับวัด", "ช่วยแนะนำสถานที่ท่องเที่ยวเกี่ยวกับวัด", "ช่วยแนะนำสถานที่ท่องเที่ยวเกี่ยวกับวัด"];

  const formatAnswerFromFlask = (answer) => {
    return answer.replace(
      /https?:\/\/\S+\.(?:jpg|jpeg|png|gif)/gi,
      (match) => `<img src="${match}" alt="image" />`
    );
  };

  const handleChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleResponse = async (response, question) => {
    try {
      const formattedAnswer = formatAnswerFromFlask(response.data.answer.replace(/\n/g, '<br>'));
      setMessages([...messages, { question, answer: formattedAnswer }]);
      const chatData = {
        chatroomId: id,
        question: question,
        answer: formattedAnswer,
      };
      
      setPromptList(response?.data.prompts);
      
      const result = await storeContent(chatData);
      

      if (result?.error) {
        console.log("frontend err:",result.error);
      } else {
        console.log("Successful!");
      }
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://127.0.0.1:5000/query', { question });
    await handleResponse(response, question);
    setQuestion('');
  } catch (error) {
    console.error('Error:', error);
  }
};

const handleExamPrompt = async (text) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/query', { question: text });
    await handleResponse(response, text);
  } catch (error) {
    console.error('Error:', error);
  }
};

const handlePromptClick = async (prompt) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/query', { question: prompt });
    await handleResponse(response, prompt);
  } catch (error) {
    console.error('Error:', error);
  }
};

const formatAnswerGetFromDB = (content) => {
  // Regular expression to match <img> tags and extract the src attribute
  const imgRegex = /<img.*?src="(.*?)".*?>/g;
  // Replace all <img> tags with <img> tags containing absolute URLs
  const formattedContent = content.replace(imgRegex, (match, src) => {
    // Check if src is already an absolute URL
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return match; // Return the original <img> tag
    } else {
      // Convert relative URL to absolute URL based on your image server
      const absoluteSrc = `https://files.thailandtourismdirectory.go.th${src}`;
      // Return the <img> tag with the absolute URL
      return `<img src="${absoluteSrc}" alt="image" />`;
    }
  });
  return formattedContent;
};


useEffect(() => {
  const fetchData = async () => {
    const res = await chatHistory(id);
    if (res.length > 0 && res) {
      const formattedData = res.map((data) => {
        // Apply formattedAnswer to data.content_messages before setting it to answer
        const formattedAnswer = formatAnswerGetFromDB(data.content_messages.replace(/\n/g, '<br>'));
        return {
          question: data.user_question_content,
          answer: formattedAnswer,
        };
      });
      setMessages(formattedData);
    } else {
      // If res is empty or null, set messages to an empty array
      setMessages([]);
    }
  };
  id && fetchData();
}, [id]);

useEffect(() => {
  const fetchData = async () => {
    const res = await lastQuestion(id);
    if (res.length > 0 && res) {
     handlePromptClick(res[0].user_question_content);
    }
  };
  id && fetchData();

}, [id])


  useEffect(() => {
    // Scroll chat container to bottom when new content is added
    if (chatContainerRef.current) {
      const lastMessage = chatContainerRef.current.querySelector('.chat-message:last-child');
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [messages]);

  useEffect(() => {
    // Screen size checking function to configure state to show or hide className='chat-prompt'
    const handleResize = () => {
      if (chatContainerRef.current) {
        const chatContainerHeight = chatContainerRef.current.clientHeight;
        const chatPromptHeight = 80;
        setShowPrompt(chatContainerHeight > chatPromptHeight);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize); // Add event listener for changing screen size
    return () => {
      window.removeEventListener('resize', handleResize); // Delete the event listener when the component is unmounted.
    };
  }, [messages, promptList]);

  return (
    <Box>
      <Container bgColor="#646464" maxW="full" h="50px" alignItems="center" justifyItems="center" display="flex">
        <Text fontSize="18px" color="white" margin="auto" as='b'>
          New Chat Room
        </Text>
      </Container>
      {messages.length <= 0 && (
      <Box className="chat-container"  id="scrollbar" ref={chatContainerRef} paddingTop="30px" height="100vh" maxHeight="calc(100vh - 230px)" display="inline-flex" justifyItems="center" alignItems="center">
        <Box className="chat-button" display="grid" gridTemplateColumns="repeat(3, 1fr)" gridGap="10px">
          {examPrompt.map((text, index) => (
            <Button
            key={index} className="message-button" id="button" fontSize="12px" color="#FFFFFF" bgColor="#073558" 
            width="auto" height="50px" margin="5px" borderRadius="15px"  onClick={() => { handleExamPrompt(text) }} >
              {text}
            </Button>
          ))}
        </Box>
      </Box>
      )}
      {messages.length > 0 && (
      <Box className="chat-container" onSubmit={handleSubmit} id="scrollbar" ref={chatContainerRef} paddingTop="30px" height="100vh" maxHeight="calc(100vh - 230px)" overflowY="auto" >
        {messages.map((message, index) => (
          <Box key={index} className="chat-message" display="flex" flexDirection="column" marginBottom="3rem" fontSize="16px">
            <Box className="question" color="#FFFFFF" bgColor="#0066CC" textAlign="left" padding="10px" borderRadius="5px" marginLeft="auto" marginRight="5px" marginBottom="5px" maxW="50%">
              {message.question}
            </Box>
            <Box className="answer" color="#FFFFFF" bgColor="#373737" textAlign="left" padding="10px" borderRadius="5px" marginRight="auto" marginTop="5px" maxW="50%">
              <div dangerouslySetInnerHTML={{ __html: message.answer }}/>
            </Box>
          </Box>
        ))}
      </Box>
      )}
       <Box as="form" className="chat-form" onSubmit={handleSubmit} marginTop="20px" display="flex" alignItems="center">
        <FormControl width="100%" height="100%">
          <Input type="text" className="chat-input" value={question} onChange={handleChange} fontSize="16px" bgColor="#D9D9D9" border="1px solid #ccc" padding="10px" borderRadius="15px" placeholder="ไปเที่ยวที่ไหนดี?"/>
        </FormControl>
        <Button
          type="submit" className="chat-button" id="button" width="20px" height="30px" fontSize="8px" color="#FFFFFF" bgColor="#233C4B"
          borderRadius="5px" transition="all 450ms ease-in-out" marginLeft="-70px" zIndex="1">
          <svg className="sparkle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
          </svg>
        </Button>
      </Box>
      {showPrompt && (
        <Box className="prompt" height="80px" borderRadius="5px" marginTop="-130px" zIndex="1" display="flex" flexWrap="wrap" justifyContent="center" alignItems="flex-end">
        {promptList.slice(0, 3).map((prompt, index) => (
          <Button
            key={index} className="prompt-button" id="button" fontSize="12px" color="#FFFFFF" bgColor="#073558" borderRadius="35px"
            width="auto" height="30px" margin="5px" onClick={() => handlePromptClick(prompt)} sx={{flex: "0 0 auto"}}>
            {prompt}
          </Button>
        ))}
      </Box>
     
      )} 
    <ToastContainer position="top-center" />
    </Box> 
  
  );
 
};

export default ChatMain;