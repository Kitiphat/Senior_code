import React, { useEffect, useState } from 'react';
import { Box, Container, Text, Divider, VStack, Image } from '@chakra-ui/react';
import { showMostPlaceCounts } from '../function/chatHistory';
import "./ScrollBar.css";

const RightSideBar = ({ isOpen }) => {
  const [mostPlaceNames, setMostPlaceNames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await showMostPlaceCounts();
      setMostPlaceNames(res);
    };
    fetchData();
  }, []);

  return (
    <Box height="calc(100vh - 130px)" ml="2" id="scrollbar" style={{ display: isOpen ? 'block' : 'none' }}>
      <Container mt="5">
        <Text fontSize="xl" fontWeight="bold" color="white" mb="4">
          Recommendations
        </Text>
        <Divider borderColor="white" mb="4" />
        <Box maxHeight="calc(100vh - 230px)" overflowY="auto" id='scrollbar'>
          <VStack spacing="4" p="4" borderRadius="md">
            {mostPlaceNames.length === 0 ? (
              <Text fontSize="md" color="white" >
                ยังไม่มีข้อมูล
              </Text>
            ) : (
              mostPlaceNames.slice(0, 3).map((place, index) => (
                <VStack key={index} align="flex-start" flex="1">
                  <Text fontSize="xl" color="white" mb="2" fontWeight='bold' textAlign={"left"} noOfLines={[1, 2, 3]}>
                    {index + 1}.{place.place_name}
                  </Text>
                  <Image
                    src={place.img}
                    alt={place.place_name}
                    
                    
                  />
                  
                  <Text fontSize="sm" color="white" mb="2" textAlign={"left"} noOfLines={[1, 2, 3]}>
                    {place.address ? place.address : "ที่อยู่ : ไม่มีข้อมูล"}
                  </Text>
                  <Text fontSize="sm" color="white" mb="2" textAlign={"left"} noOfLines={[1, 2, 3]}>
                    {place.facility ? place.facility : "สิ่งอำนวยความสะดวก : ไม่มีข้อมูล"}
                  </Text>
                  <Text fontSize="sm" color="white" mb="2" textAlign={"left"} noOfLines={[1, 2, 3,4,5]}>
                    {place.all_day_time ? place.all_day_time : "วันเวลาทำการ : ไม่มีข้อมูล"}
                  </Text>
                </VStack>
              ))
            )}
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default RightSideBar;
