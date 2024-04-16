import React, { useState } from 'react';
import { Flex, VStack, Box, Text, IconButton, Container } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import './ScrollBar.css';

const LeftSideBar = () => {
  const [chatrooms, setChatrooms] = useState([]);

  const handleCreateChatroom = () => {
    const newChatroom = { name: `Chatroom ${chatrooms.length + 1}` };
    setChatrooms([newChatroom, ...chatrooms]); // Adding the new chatroom at the end of the array
  };
  
  const handleDeleteChatroom = (index) => {
    const updatedChatrooms = [...chatrooms];
    updatedChatrooms.splice(index, 1);
    setChatrooms(updatedChatrooms);
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
            <Flex key={index} mt="25" bgColor="#999999" w="100%" h="40px" borderRadius="10px" align="center" justify="space-between" _hover={{ bgColor: 'gray' }}>
              <Text fontSize="16" color="white" margin="auto" pl="4">
                {chatroom.name}
              </Text>
              <Box _hover={{ bgColor: 'transparent' }}>
                <IconButton icon={<DeleteIcon />} variant="ghost" colorScheme="red" onClick={() => handleDeleteChatroom(index)} />
              </Box>
            </Flex>
          ))}
        </VStack>
        <Box maxW='80%' mt='auto' mb='5' as="button" bg="#545454" color="white" w="230px" h="40px" fontSize="16" borderRadius="20" align="center" justify="center" onClick={handleCreateChatroom}>
          Create new chat <AddIcon boxSize={'15px'} ml='10' alignItems='center'/>
        </Box>
      </VStack>
    </Flex>
  );
};

export default LeftSideBar;
