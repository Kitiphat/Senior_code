import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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
    if (formData.username === '' || formData.password === '') {
      setError('Username or Password cannot be empty');
      return toast.error('Username or Password cannot be empty');
    } else {
      setError(null);
    }
    try {
      const response = await axios.post(`${path}/api/signin`, formData);
      if (response.status === 200) {
        toast.success('Login Successful');
      }
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.payload.user.username));
      localStorage.setItem('name', JSON.stringify(response.data.payload.user.name));
      rounter('/');
    } catch (error) {
      if (
        error.response.data.error === 'User does not exist' ||
        error.response.data.error === 'Invalid credentials'
      ) {
        setError('Username or password is incorrect. Please try again.');
        toast.error('Username or password is incorrect. Please try again.');
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
        bgGradient={['linear(to-tr, #0476D0, #71A0F7)', 'linear(to-t, #0476D0, #71A0F7)']}
      >
        <Flex
        color='white'
          bg='white'
          rounded="lg"
          boxShadow="lg"
          alignItems="center"
          maxW="800px"
          maxH="650px"
          w="100%"
          h="100%"
        >
          <Box flex="1" p="8" opacity={0.75} bg='#0476D0' display="flex" alignItems="center" justifyContent="center" h="100%">
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
              <Link to="/signup">
                <Button colorScheme="green">Register</Button>
              </Link>
              {/* {error && <Box color="red.500">{error}</Box>} */}
            </VStack>
          </Box>
          <Box flex="1" display="flex" justifyContent="center" alignItems='center'  h='100%'>
            <Image  src="/img/TPR_icon.jpg" alt="Logo" boxSize="200px"  alignItems={'center'}/>
          </Box>
        </Flex>
      </Box>
      <ToastContainer position="top-center" />
    </ChakraProvider>
  );
};

export default LoginPage;
