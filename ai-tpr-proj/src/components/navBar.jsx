// Navbar.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Spacer,
  Link,
  Image,
  Text,
} from "@chakra-ui/react";
import { SettingsIcon } from '@chakra-ui/icons'
import { useNavigate} from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  useEffect(() => { 
    const checkUsername = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setUser(user);
      } else {
        setUser("");
      }
    }
    checkUsername();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('chatrooms');
    setUser(""); // Update the user state to reflect logout
    navigate("/"); // Navigate to the login page after logout
    window.location.reload();
  };
  

  return (
    <Box bg="#0066CC" w="100%" h="110px" display="flex" p={4} margin="auto">
      <Flex align="center">
        <Image src="/img/TPRICOn4333.png" alt="Logo" boxSize="110px" />
      </Flex>
      <Spacer />
      <Flex align="center" justify="center">
        <Spacer />
        
          <Flex gap={2} align="center" justify="center" color="white" mr={4}>
          <Link  href="#" >
            <Image
              src="/img/usericon.jpg"
              alt="User Logo"
              boxSize="40px"
              borderRadius="50%"
              mr={2}
            />
            </Link>
            <Box>{user ? (<p> {user} </p>):(<Link color='white' href={"/signin"}> Login </Link>)}</Box>
            <Box>{user ? (<Link _hover={{ textDecoration: "none" }} onClick={handleLogout}> Logout </Link>):(<>   </>)}</Box>
          </Flex>
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
