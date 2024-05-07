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
  MenuDivider,
} from "@chakra-ui/react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { SettingsIcon } from '@chakra-ui/icons'
import { useNavigate} from "react-router-dom";
import Settings from "./Settings";
import { useTheme } from './ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // state to store the opening and closing state of the Settings modal
  const [username, setUsername] = useState(""); // state to store the username from the local storage
  const { themeColor, changeTheme } = useTheme();
  
  const handleThemeChange = (color) => {
    changeTheme(color); // Change theme color with function
  };

  useEffect(() => { 
    const checkUsername = () => {
      const user = JSON.parse(localStorage.getItem('name'));
      const username = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setUser(user);
        setUsername(username)
      } else {
        setUser("");
        setUsername("")
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
  
  // bgGradient="linear(to-r, #073558, #144272, #205295, #1d6ca9)"
  return (
    <Box bgGradient="linear(to-bl, #011f4b, #03396c, #005b96, #6497b1)" w="100%" h="110px" display="flex" p={4} margin="auto">
      <Flex align="center">
        <Image src="/img/MyWander.png" alt="Logo" boxSize="100px" ml='2'/>
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
                <MenuItem  >
                <Image
                    src="/img/usericon.jpg"
                    alt="User Logo"
                    boxSize="40px"
                    borderRadius="50%"
                    mr={4}
                  />
                  <Text  fontWeight="bold">
                    {username}
                  </Text>
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => setIsSettingsOpen(true)}>
                  Setting  <SettingsIcon boxSize={4} ml="3"/> 
                  <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onChangeTheme={handleThemeChange}/> {/* Send props to enable or disable Settings modal */}
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
