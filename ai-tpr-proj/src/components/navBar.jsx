// Navbar.js
import React from "react";
import {
  Box,
  Flex,
  Link,
  Spacer,
  Image,
} from "@chakra-ui/react";
import { SettingsIcon } from '@chakra-ui/icons'

const Navbar = () => {
  return (
    <Box bg="#0066CC" w="100%" h="110px" display="flex" p={4} margin="auto">
      <Flex align="center">
        <Image src="/img/TPRICOn4333.png" alt="Logo" boxSize="110px" />
      </Flex>
      <Spacer />
      <Flex align="center" justify="center">
        <Spacer />
        <Link href="#" color="white" mr={4}>
          <Flex gap={2} align="center" justify="center">
            <Image
              src="/img/usericon.jpg"
              alt="User Logo"
              boxSize="40px"
              borderRadius="50%"
              mr={2}
            />
            <Box>Username</Box>
          </Flex>
        </Link>
        <Link href="#" color="white" mr={4}>
          TH | EN
        </Link>
        <Link href="#" color="white" mr={4}>
          <SettingsIcon boxSize={5} />
        </Link>
      </Flex>
    </Box>
  );
};

export default Navbar;
