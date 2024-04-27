import React, { useState } from 'react';
import {
  Box,
  Button,
  ChakraProvider,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const path = process.env.REACT_APP_BASE_API_URL;
  const [error, setError] = useState(null);

const rounter = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.username === "" || formData.password === "") {
      setError("Username or Password cannot be empty");  
      return toast.error("Username or Password cannot be empty");
      
    }else{
        setError(null);
    }
    try {
      
      const response = await axios.post(`${path}/api/signin`, formData);
      if(response.status === 200) {
        toast.success("Login Successful");
    } 
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.payload.user.username));

      rounter('/');
    } catch (error) {
       if(error.response.data.error === 'User does not exist' || error.response.data.error === 'Invalid credentials') {
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
        bg="blue.100"
      >
        <Box p="8" bg="white" rounded="lg" boxShadow="lg">
          <VStack spacing="4">
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </FormControl>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Log In
            </Button>
            {/* {error && <Box color="red.500">{error}</Box>} */}
          </VStack>
        </Box>
      </Box>
      <ToastContainer position="top-center" />
    </ChakraProvider>
  );
};

export default LoginPage;
