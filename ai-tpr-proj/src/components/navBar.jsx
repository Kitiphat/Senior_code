// Navbar.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Spacer,
  Link,
  Image,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { SettingsIcon } from '@chakra-ui/icons'
import { useNavigate} from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  useEffect(() => { 
    const checkUsername = () => {
      const user = JSON.parse(localStorage.getItem('name'));
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
    localStorage.removeItem('name');
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

        <Flex gap={2} align="center" justify="center" mr={4}>
          {user ? (
            <Menu>
              <MenuButton as={Link} display="flex" alignItems="center" mr={4}>
                <Flex alignItems="center">
                  <Image
                    src="/img/usericon.jpg"
                    alt="User Logo"
                    boxSize="40px"
                    borderRadius="50%"
                    mr={4}
                  />
                  <Text color="white" fontWeight="bold">
                    {user}
                  </Text>
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <Link href="#" >
                  Setting  <SettingsIcon boxSize={4} ml="3"/> 
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Text mr="4"> Logout </Text>  <RiLogoutBoxRLine />
                </MenuItem>
                
              </MenuList>
            </Menu>
          ) : (
            <Link
              color="white"
              href="/signin"
              display="flex"
              alignItems="center"
              mr={4}
            >
              <Flex alignItems="center">
                <Image
                  src="/img/usericon.jpg"
                  alt="User Logo"
                  boxSize="40px"
                  borderRadius="50%"
                  mr={4}
                />
                <Text color="white" fontWeight="bold">
                  Login
                </Text>
              </Flex>
            </Link>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
