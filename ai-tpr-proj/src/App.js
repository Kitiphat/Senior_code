import { ChakraProvider,VStack,Button,Box ,Container,Flex,CSSReset,GridItem,Grid,Text,extendTheme} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import Navbar from './components/navBar';
import LeftSideBar from './components/leftSideBar';
import ChatMain from './components/chatBody';
import RightSideBar from './components/rightSideBar';

const theme = extendTheme({
  fonts: {
    body: 'Arial , sans-serif',
    heading: 'Arial , sans-serif',
  },
});


function App() {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Flex direction="column" height="100vh" bgColor="#F7F7F8">
        <Navbar />
        <Flex flex="1">
          <Box width="100%" mx="2" my="2" align="center" justify="center">
            <Grid templateColumns="13% 62% 25%" h="100%" w="100%">
              <GridItem colSpan={1} borderLeftRadius="20" bgColor="#999999" mr="2">

                <LeftSideBar />

              </GridItem>
              
              <GridItem colSpan={1} bgColor="#F7F7F8">

              <ChatMain />

              </GridItem>
              <GridItem colSpan={1} borderRightRadius="20" bgColor="#999999" ml="2">
                <RightSideBar />
              </GridItem>
            </Grid>
          </Box>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
