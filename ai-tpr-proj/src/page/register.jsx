import React, { useState } from 'react';
import { FormControl, FormLabel, Input, Stack, Button, Radio, RadioGroup, Heading, Image, Box, Link, Flex } from "@chakra-ui/react";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const BASE_URL = process.env.REACT_APP_BASE_API_URL;
  const rounter = useNavigate();
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    tel_no: '',
    email: '',
    dob: '',
    address: '',
    username: '',
    password: '',
    gender: '' // Default value
  });

  const handleChange = (e) => {
    if (!e || !e.target) return; // Check if event or event target is undefined
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleChangeGender = (value) => {
    setFormData({
      ...formData,
      gender: value
    });
  };
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('API path:', BASE_URL)
      console.log('-3-3-3-3-3-')
      const response = await axios.post(`${BASE_URL}api/signup`, formData);
      if (response.status === 200) {
        rounter('/signin');
        toast.success('Registered Successfully! Please login to continue');
        
      }
      // Redirect or perform actions upon successful registration
    } catch (error) {
      console.error('Error:', error);
      if(error.response.request.status === 500 ){
        toast.error("Please fill all the fields correctly");
      }
    }
  };

  return (
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
          alignItems="center"
          maxW="1000px"
          maxH="650px"
          w="100%"
          h="100%"
          borderRadius="20px"
        >
          <Box flex="1.25" p="5" bg="#2093DD" display="flex" alignItems="center" justifyContent="center" h="100%" borderRadius="20px 0 0 20px">
            <form onSubmit={handleSubmit}>
              <Stack spacing={2} maxW="350px" m="auto">
                <Heading as="h2" size="lg" textAlign="center" mb="15px">Create an account</Heading>
                <Stack spacing={3} direction="row">
                  <FormControl id="fname">
                    <FormLabel mb="0" fontSize="16px">First Name</FormLabel>
                    <Input type="text" name="fname" value={formData.fname} onChange={handleChange} color="black" bg="white" size="sm" fontSize="16px" placeholder="First Name"/>
                  </FormControl>
                  <FormControl id="lname">
                    <FormLabel mb="0" fontSize="16px">Last Name</FormLabel>
                    <Input type="text" name="lname" value={formData.lname} onChange={handleChange} color="black" bg="white" size="sm" fontSize="16px" placeholder="Last Name"/>
                  </FormControl>
                </Stack>
                <Stack spacing={3} direction="row">
                  <FormControl id="dob">
                    <FormLabel mb="0" fontSize="16px">Date of Birth</FormLabel>
                    <Input type="date" name="dob" value={formData.dob} onChange={handleChange} color="black" bg="white" size="sm" fontSize="16px"/>
                  </FormControl>
                  <FormControl id="tel_no">
                    <FormLabel mb="0" fontSize="16px">Phone Number</FormLabel>
                    <Input type="tel" name="tel_no" value={formData.tel_no} onChange={handleChange} color="black" bg="white" size="sm" fontSize="16px" placeholder="Phone Number"/>
                  </FormControl>
                </Stack>
                <FormControl id="gender">
                  <FormLabel mb="0" fontSize="16px">Gender</FormLabel>
                    <RadioGroup value={formData.gender} name="gender" onChange={handleChangeGender}>
                      <Stack direction="row" color="black" bg="white" p="7px 7px 7px 15px" borderRadius="2px">
                        <Radio value="1" colorScheme="red" size="sm">Male</Radio>
                        <Radio value="2" colorScheme="red" size="sm">Female</Radio>
                        <Radio value="3" colorScheme="red" size="sm">Other</Radio>
                      </Stack>
                    </RadioGroup>
                </FormControl>
                <FormControl id="address">
                    <FormLabel mb="0" fontSize="16px">Address</FormLabel>
                    <Input type="text" name="address" value={formData.address} onChange={handleChange} color="black" bg="white" size="sm" fontSize="16px" placeholder="Enter address"/>
                </FormControl>
                <FormControl id="email">
                  <FormLabel mb="0" fontSize="16px">Email Address</FormLabel>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} color="black" bg="white" size="sm" fontSize="16px" placeholder="Enter email"/>
                </FormControl>
                <Stack spacing={3} direction="row">
                  <FormControl id="username">
                    <FormLabel mb="0" fontSize="16px">Username</FormLabel>
                    <Input type="text" name="username" value={formData.username} onChange={handleChange} color="black" bg="white" size="sm" fontSize="16px" placeholder="Enter username"/>
                  </FormControl>
                  <FormControl id="password">
                    <FormLabel mb="0" fontSize="16px">Password</FormLabel>
                    <Input type="password" name="password" value={formData.password} onChange={handleChange} color="black" bg="white" size="sm" fontSize="16px" placeholder="Enter password"/>
                  </FormControl>
                </Stack>
                <Button type="submit" colorScheme="green" mt="10px">Sign Up</Button>
                <Stack spacing={3} direction="row" alignItems="center" justifyContent="center" h="30px" mt="-10px">
                  <Box fontSize="16px">Have an account,</Box>
                  <Link href="/signin">
                    <Button h="30px" p="0" ml="-10px" fontSize="16px" variant="unstyled" color= "#FF1111" _focus={{ outline: 'none' }} _hover={{ textDecoration: "underline" }}>
                      Log in
                    </Button>
                  </Link>
                </Stack>
              </Stack>
            </form>
          </Box>
          <Box flex="1" display="flex" justifyContent="center" alignItems='center'  h='100%'>
              <Image src="/img/MyWander.png" alt="Logo" boxSize="450px" alignItems={'center'}/>
          </Box>
        </Flex>
        <ToastContainer position="top-center" />
      </Box>
    
  );
};

export default Register;
