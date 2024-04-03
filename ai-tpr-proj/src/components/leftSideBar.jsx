import React from 'react';
import { VStack, Box, Text,Flex } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const LeftSideBar = () => {
  return (
    <Flex direction="column" h='100%' width="100%" mr="2"  align="center" justify="center">
      <VStack flex="1">
        <Box mt='4'>
          <Text fontSize="18" color="white" margin="auto" as="b">
            List chat history
          </Text>
        </Box>
        <Box mt='auto'mb ='5'as="button" bg="#545454" color="white" w="230px" h="40px" fontSize="16" borderRadius="20" align="center" justify="center" >
          Create new chat <AddIcon boxSize={'15px'} ml='10' alignItems='center'/>
        </Box>
      </VStack>
    </Flex>
  );
};

export default LeftSideBar;
