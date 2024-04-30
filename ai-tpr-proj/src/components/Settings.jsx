import React, { useState }  from 'react';
import { Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Divider, Select } from '@chakra-ui/react';

const Settings = ({ isOpen, onClose, onChangeTheme }) => {
  const [themeColor, setThemeColor] = useState("");
  
  const handleThemeChange = (color) => {
    setThemeColor(color);
    onChangeTheme(color); // Run onChangeTheme to pass theme color values ​​to each component
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent style={{ position: "relative"}}>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Box>
              <Box fontWeight="bold">General</Box>
              <Box>
                {/* General settings content */}
                <Box py={2}>Display name: <input type="text" /></Box>
                <Box py={2}>Theme
                  <Select value={themeColor} onChange={(e) => handleThemeChange(e.target.value)}>
                    <option value="">Light</option>
                    <option value="Dark">Dark</option>
                  </Select>
                </Box>
              </Box>
            </Box>
            <Divider my={4} />
            <Box>
              <Box fontWeight="bold">Data Control</Box>
              <Box>
                {/* Data control settings content */}
                <Box py={2}>Clear chat history: <Button colorScheme="red">Clear</Button></Box>
                <Box py={2}>Export chat data: <Button colorScheme="teal">Export</Button></Box>
              </Box>
            </Box>
          </Box>
        </ModalBody>
        <ModalFooter>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Settings;