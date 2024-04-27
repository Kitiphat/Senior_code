import React, { useState,useEffect } from 'react';
import { Flex, VStack, Box, Text, IconButton, Container,Link} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import './ScrollBar.css';
import { useNavigate,useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { checkChatroomId, deleteHistory } from '../function/chatHistory';


const breakpoints = {
  base: '0px',
  sm: '320px',
  md: '768px',
  lg: '960px',
  xl: '1200px',
  '2xl': '1536px',
  
}



const LeftSideBar = ({ onCreateChatroom, onSelectChatroom }) => {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const [isLogin, setIsLogin] = useState(token ? true : false);
  const [checkUuidData, setCheckUuidData] = useState(null);
  const [chatrooms, setChatrooms] = useState(() => {
    // Initialize chatrooms state with value from local storage, if available
    const savedChatrooms = localStorage.getItem('chatrooms');
    return savedChatrooms ? JSON.parse(savedChatrooms) : [];
  });
  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Save chatrooms to local storage whenever it changes
    if(token) {
    localStorage.setItem('chatrooms', JSON.stringify(chatrooms));
    }
  }, [chatrooms]);

  useEffect(() => {
    if (!token) {
      setChatrooms([]);    
    }
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await checkChatroomId(id);
      if (res.length > 0 && res) {
        setCheckUuidData(res[0]);
      } else {
        setCheckUuidData(null);
      }
    };
    fetchData();
  },[token]);

  const handleCreateChatroom = () => {
    const newChatroomName = `Chatroom ${chatrooms.length + 1}`;
    const newUUID = uuidv4();
    if(token){
    const newChatroom = { id: newUUID, name: newChatroomName };
    setChatrooms([newChatroom, ...chatrooms]);
    setSelectedChatroom(newChatroom);
    onCreateChatroom(newChatroom);

    // Navigate to the newly created chatroom
    navigate(`/chats/${newUUID}`);
  }
  };
  
  const handleDeleteChatroom = async (index) => {
    const chatroomId = chatrooms[index].id; // Get the UUID of the chatroom to delete
    const uuidInDB = await checkChatroomId(chatroomId);
    if(uuidInDB.error){
      console.log("Error:",uuidInDB.error);
      const updatedChatrooms = [...chatrooms];
      updatedChatrooms.splice(index, 1);
      setChatrooms(updatedChatrooms);
      
      // Determine the next chat room to navigate to
      let nextChatroomIndex;
      if (index === 0 && updatedChatrooms.length > 0) {
        nextChatroomIndex = 0; // If deleting the first chat room, navigate to the new first chat room
      } else if (index === updatedChatrooms.length) {
        nextChatroomIndex = updatedChatrooms.length - 1; // If deleting the last chat room, navigate to the new last chat room
      } else {
        nextChatroomIndex = index; // Navigate to the chat room that shifted up to the deleted chat room's position
      }
    
      if (updatedChatrooms.length > 0) {
        // Navigate to the next chat room
        navigate(`/chats/${updatedChatrooms[nextChatroomIndex].id}`);
      } else {
        // If no more chat rooms, navigate to a default route or home page
        navigate('/');
      }
    } else{
      console.log("Delete");
      const res = await deleteHistory(chatroomId); // Pass the chatroom ID to deleteHistory function
      
    if (res === 200) {
      const updatedChatrooms = [...chatrooms];
      updatedChatrooms.splice(index, 1);
      setChatrooms(updatedChatrooms);
      
      // Determine the next chat room to navigate to
      let nextChatroomIndex;
      if (index === 0 && updatedChatrooms.length > 0) {
        nextChatroomIndex = 0; // If deleting the first chat room, navigate to the new first chat room
      } else if (index === updatedChatrooms.length) {
        nextChatroomIndex = updatedChatrooms.length - 1; // If deleting the last chat room, navigate to the new last chat room
      } else {
        nextChatroomIndex = index; // Navigate to the chat room that shifted up to the deleted chat room's position
      }
    
      if (updatedChatrooms.length > 0) {
        // Navigate to the next chat room
        navigate(`/chats/${updatedChatrooms[nextChatroomIndex].id}`);
      } else {
        // If no more chat rooms, navigate to a default route or home page
        navigate('/');
      }
    } 
    }
    
  };
  

    
  

  const handleSelectChatroom = (chatroom) => {
    setSelectedChatroom(chatroom);
    onSelectChatroom(chatroom);
  };

  return (
    <Flex direction="column" h='100%' width="100%" mr="2" align="center" justify="center">
      <VStack flex="1" overflowY="auto" maxHeight="calc(100vh - 130px)" height='full' align="center" justify="center" width='100%'>
        <Box mt='4'>
          <Text fontSize="18" color="white" margin="auto" as="b">
            List chat history
          </Text>
        </Box>
        <VStack height='85%' overflowY={'auto'} width='80%' className="left-sidebar">
          {chatrooms.map((chatroom, index) => (
            <Flex key={index} mt="25" bgColor={selectedChatroom === chatroom ? "#BBBBBB" : "#999999"} w="100%" h="40px" borderRadius="10px" align="center" justify="space-between" _hover={{ bgColor: 'gray' }} onClick={() => handleSelectChatroom(chatroom)}>
              <Link href={`/chats/${chatroom.id}`} > 
                <Text fontSize="16" color="white" margin="auto" align = 'center' justify = 'center' pl="4">
                  {chatroom.name}
                </Text>
              </Link>
              <Box _hover={{ bgColor: 'transparent' }}>
                <IconButton icon={<DeleteIcon />} variant="ghost" colorScheme="red" onClick={() => handleDeleteChatroom(index)} />
              </Box>
            </Flex>
          ))}
        </VStack>
        <Flex  maxW='80%' mt='auto' mb='5' as="button" bg="#545454" color="white" w="230px" h="40px" fontSize="16" borderRadius="20" align="center" justify="center" onClick={handleCreateChatroom} disabled={!isLogin} >
          
          <Text fontSize={['4px', '6px', '8px', '12px', '12px','15px']} display={{ base: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'block' }} >Create new chat</Text>
          <AddIcon boxSize={['12px', '12px', '12px', '12px', '12px','15px']} ml={['0', '0', '0', '0', '2','5']} alignItems='center' justify='center' />
          
        </Flex>
      </VStack>
    </Flex>
  );
};

export default LeftSideBar;

