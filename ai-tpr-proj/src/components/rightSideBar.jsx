import React from 'react';
import { Box, Container, Text, Divider, VStack, HStack, Badge, Flex } from '@chakra-ui/react';

const RightSideBar = () => {
  return (
    <Box overflowY="auto" height="calc(100vh - 130px)" ml="2">
      <Container mt="5">
        <Text fontSize="xl" fontWeight="bold" color="white" mb="4">
          Recommendations
        </Text>
        <Divider borderColor="white" mb="4" />
        {/* Recommendation section */}
        <VStack spacing="4">
          {/* Recommendation for questions */}
          <Box>
            <Text fontSize="lg" fontWeight="semibold" color="white" mb="2">
              Top Questions
            </Text>
            <Flex flexWrap="wrap">
              <Badge colorScheme="blue" mr="2" mb="2">Question 1</Badge>
              <Badge colorScheme="blue" mr="2" mb="2">Question 2</Badge>
              <Badge colorScheme="blue" mr="2" mb="2">Question 3</Badge>
              {/* Add more badges for additional questions */}
            </Flex>
          </Box>
          {/* Recommendation for answers */}
          <Box>
            <Text fontSize="lg" fontWeight="semibold" color="white" mb="2">
              Top Answers
            </Text>
            <Flex flexWrap="wrap">
              <Badge colorScheme="green" mr="2" mb="2">Answer 1</Badge>
              <Badge colorScheme="green" mr="2" mb="2">Answer 2</Badge>
              <Badge colorScheme="green" mr="2" mb="2">Answer 3</Badge>
              {/* Add more badges for additional answers */}
            </Flex>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default RightSideBar;
