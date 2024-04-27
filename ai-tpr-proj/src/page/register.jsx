import React, { useState } from 'react';
import { FormControl, FormLabel, Input, Stack, Button, Radio, RadioGroup, Heading } from "@chakra-ui/react";
import axios from 'axios';


const Register = () => {
  const path = process.env.REACT_APP_BASE_API_URL;
  const [error, setError] = useState(null); // Error state to display error message [if any
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
    console.log(formData);
    try {
      console.log('API path:', path)
      const response = await axios.post(`${path}/api/signup`, formData);
      console.log(response.data);
      // Redirect or perform actions upon successful registration
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4} maxW="400px" m="auto">
        <Heading as="h2" size="lg" textAlign="center">Sign Up</Heading>
        <FormControl id="fname">
          <FormLabel>First Name</FormLabel>
          <Input type="text" name="fname" value={formData.fname} onChange={handleChange} />
        </FormControl>
        <FormControl id="lname">
          <FormLabel>Last Name</FormLabel>
          <Input type="text" name="lname" value={formData.lname} onChange={handleChange} />
        </FormControl>
        <FormControl id="tel_no">
          <FormLabel>Phone Number</FormLabel>
          <Input type="tel" name="tel_no" value={formData.tel_no} onChange={handleChange} />
        </FormControl>
        <FormControl id="email">
          <FormLabel>Email Address</FormLabel>
          <Input type="email" name="email" value={formData.email} onChange={handleChange} />
        </FormControl>
        <FormControl id="dob">
          <FormLabel>Date of Birth</FormLabel>
          <Input type="date" name="dob" value={formData.dob} onChange={handleChange} />
        </FormControl>
        <FormControl id="address">
          <FormLabel>Address</FormLabel>
          <Input type="text" name="address" value={formData.address} onChange={handleChange} />
        </FormControl>
        <FormControl id="username">
          <FormLabel>Username</FormLabel>
          <Input type="text" name="username" value={formData.username} onChange={handleChange} />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" value={formData.password} onChange={handleChange} />
        </FormControl>
        <FormControl id="gender">
          <FormLabel>Gender</FormLabel>
          <RadioGroup value={formData.gender} name="gender" onChange={handleChangeGender}>
            <Stack direction="row">
              <Radio value="1">Male</Radio>
              <Radio value="2">Female</Radio>
              <Radio value="3">Other</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        <Button type="submit" colorScheme="blue">Sign Up</Button>
      </Stack>
    </form>
  );
};

export default Register;
