// App.js
import React, { useState } from 'react';
import { ChakraProvider, Box, Flex, CSSReset, GridItem, Grid, extendTheme } from '@chakra-ui/react';
import Navbar from './components/navBar';
import LeftSideBar from './components/leftSideBar';
import ChatMain from './components/chatBody';
import RightSideBar from './components/rightSideBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = extendTheme({
  fonts: {
    body: 'Arial, sans-serif',
    heading: 'Arial, sans-serif',
  },
});

function App() {
  const [chatrooms, setChatrooms] = useState([]);
  const [activeChatroom, setActiveChatroom] = useState(null); // Maintain the activeChatroom state

  const handleCreateChatroom = (newChatroom) => {
    setChatrooms([...chatrooms, newChatroom]);
    setActiveChatroom(newChatroom); // Set the active chatroom when created
  };

  const handleSelectChatroom = (chatroom) => {
    setActiveChatroom(chatroom);
  };

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Flex direction="column" height="100vh" bgColor="#F7F7F8">
        <Navbar />
        <Flex flex="1">
          <Box width="100%" mx="1" my="1" align="center" justify="center">
            <Grid templateColumns="13% 62% 25%" h="100%" w="100%">
              <GridItem colSpan={1} borderLeftRadius="20" bgColor="#999999" mr="1">
                <LeftSideBar onCreateChatroom={handleCreateChatroom} onSelectChatroom={handleSelectChatroom} />
              </GridItem>
              <GridItem colSpan={1} bgColor="#F7F7F8">
                <ChatMain activeChatroom={activeChatroom} /> 
              </GridItem>
              <GridItem colSpan={1} borderRightRadius="20" bgColor="#999999" ml="1">
                <RightSideBar />
              </GridItem>
            </Grid>
          </Box>
        </Flex>
      </Flex>
      <ToastContainer />
    </ChakraProvider>
    
  );
}

export default App;
