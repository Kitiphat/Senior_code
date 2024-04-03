import React from 'react';
import { Box, Container, Text } from '@chakra-ui/react';

const ChatMain = () => {
  return (
    <Box>
      <Container
        bgColor={"#646464"}
        maxW="full"
        h="50px"
        alignItems="center"
        justifyItems="center"
        display={"flex"}
      >
        <Text fontSize={"18"} color="white" margin="auto" as='b'>
          New chat room 
        </Text>
      </Container>
    </Box>
  );
};

export default ChatMain;

