import React, { useState } from "react";
import {
  Box,
  Button,
  ChakraProvider,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Image,
  Flex,
  InputGroup,
  InputLeftElement,
  Link
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { EmailIcon, LockIcon } from "@chakra-ui/icons";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const path = process.env.REACT_APP_BASE_API_URL;
  const [error, setError] = useState(null);

  const rounter = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.username === "" || formData.password === "") {
      setError("Username or Password cannot be empty");
      return toast.error("Username or Password cannot be empty");
    } else {
      setError(null);
    }
    try {
      const response = await axios.post(`${path}/api/signin`, formData);
      if (response.status === 200) {
        toast.success("Login Successful");
      }
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.payload.user.username)
      );
      localStorage.setItem(
        "name",
        JSON.stringify(response.data.payload.user.name)
      );
      rounter("/");
    } catch (error) {
      if (
        error.response.data.error === "User does not exist" ||
        error.response.data.error === "Invalid credentials"
      ) {
        setError("Username or password is incorrect. Please try again.");
        toast.error("Username or password is incorrect. Please try again.");
      }
    }
  };

  return (
    <ChakraProvider>
      <Box
        w="100vw"
        h="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgGradient={[
          "linear(to-tr, #0476D0, #71A0F7)",
          "linear(to-t, #0476D0, #71A0F7)",
        ]}
      >
        <Flex
          color="white"
          bg="white"
          borderRadius="20px"
          boxShadow="lg"
          alignItems="center"
          maxW="800px"
          maxH="650px"
          w="100%"
          h="100%"
        >
          <Box
            flex="1"
            p="8"
            borderLeftRadius="20px"
            bg="#2093DD"
            display="flex"
            alignItems="center"
            justifyContent="center"
            h="100%"
          >
            <VStack spacing="4">
            <Box fontSize="32px" mb="2" fontWeight={"bold"}>Login
            
            </Box>
              <FormControl id="username">
                <FormLabel>Username</FormLabel>

                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<EmailIcon />}
                  />
                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    _placeholder={{ color: "white" }}
                  />
                </InputGroup>
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    _placeholder={{ color: "white" }}
                  />
                  <InputLeftElement>
                    <LockIcon />
                  </InputLeftElement>
                </InputGroup>
              </FormControl>
              <Button mt='5' bgGradient="linear(to-bl, #011f4b, #03396c, #005b96)" color='white'  width='250px' onClick={handleSubmit} _hover={{bg:'#011f4b'}}>
                Log In
              </Button>
              <Flex spacing={3} direction="row" alignItems="center" justifyContent="center" h="30px" >
                  <Box fontSize="16px">Don't have an account?</Box>
                  <Link href="/signup">
                <Button ml="1" variant={'unstyled'} textDecoration={"underline"} >Register Here</Button>
                 </Link>
                </Flex>
              
            </VStack>
          </Box>
          <Box
            flex="1"
            display="flex"
            justifyContent="center"
            alignItems="center"
            h="100%"
          >
            <Image
              src="/img/MyWander.png"
              alt="Logo"
              boxSize="350px"
              alignItems={"center"}
            />
          </Box>
        </Flex>
      </Box>
      <ToastContainer position="top-center" />
    </ChakraProvider>
  );
};

export default LoginPage;
