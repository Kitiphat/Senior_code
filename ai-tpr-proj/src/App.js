import React, { useState } from 'react';
import { ChakraProvider, Box, Flex, CSSReset, GridItem, Grid, extendTheme, Button } from '@chakra-ui/react';
import Navbar from './components/navBar';
import LeftSideBar from './components/leftSideBar';
import ChatMain from './components/chatBody';
import RightSideBar from './components/rightSideBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const theme = extendTheme({
  fonts: {
    body: 'Arial, sans-serif',
    heading: 'Arial, sans-serif',
  },
});

function App() {
  const [chatrooms, setChatrooms] = useState([]);
  const [activeChatroom, setActiveChatroom] = useState(null);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const handleCreateChatroom = (newChatroom) => {
    setChatrooms([...chatrooms, newChatroom]);
    setActiveChatroom(newChatroom);
  };

  const handleSelectChatroom = (chatroom) => {
    setActiveChatroom(chatroom);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Flex direction="column" height="100vh" bgColor="#F7F7F8">
        <Navbar />
        <Flex flex="1">
          <Box width="100%" mx="1" my="1" align="center" justify="center">
            <Grid templateColumns={isRightSidebarOpen ? "13% auto 25%" : "13% auto 0%"} h="100%" w="100%">
              <GridItem colSpan={1} borderLeftRadius="20" bgColor="#999999" mr="1">
                <LeftSideBar onCreateChatroom={handleCreateChatroom} onSelectChatroom={handleSelectChatroom} />
              </GridItem>
              <GridItem colSpan={1} bgColor="#F7F7F8" position="relative">
              
                <ChatMain activeChatroom={activeChatroom} /> 
                <Button
                  position="absolute"
                  bgColor="transparent"
                  _hover={{bgColor: "transparent"}}
                  right={isRightSidebarOpen ? "0" : "0"}
                  top="25px"
                  transform="translateY(-50%)"
                  onClick={toggleRightSidebar}
                  zIndex="1"
                >
                  {isRightSidebarOpen ? <ChevronRightIcon color="white" boxSize="30px" _hover={{transform: "scale(1.75)"}}/> :<ChevronLeftIcon color="white" boxSize="30px" _hover={{transform: "scale(1.75)"}}/>}
                </Button>
              </GridItem>
              <GridItem colSpan={isRightSidebarOpen ? 1 : 0} borderRightRadius="20" bgColor="#999999" ml="1">
                <RightSideBar isOpen={isRightSidebarOpen} />
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
