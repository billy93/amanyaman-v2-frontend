import { Link } from "react-router-dom";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Heading,
  Text,
  Center,
  Button,
  Stack,
  Image
} from '@chakra-ui/react'
import { useSelector } from "react-redux"
import EmergencyIco from '../../../../img/stopwatch.png'
import SecurityIco from '../../../../img/security.png'

const ClaimMenu = () => {
   
    return (
        <Box pl="4" pr="4" mt="5em">
            <Box m={'2.5'} display={'flex'} justifyContent={'space-between'} alignItems={'center'} mt="5">
               <Heading as={'h6'} size={'sm'}>Create Claim</Heading>  
            </Box>
            <Center m="3" display={'flex'} flexDirection={'column'}>
                <Heading mb="15px" fontSize={'md'} color="#231F20" fontFamily={'Mulish'} style={{fontSize:'24px'}}>
                    Let's get started!
                </Heading>
                <Text mb="2" as="p" color={'#4e4e4e'} fontFamily={'Mulish'} style={{fontSize:'18px'}}>What do you need ?</Text>
            </Center>
            <Center p="2" m="2" display={'flex'} justifyContent={'center'}>
                <Link to="/claim/emergency">
                <Box bg="#ebebeb" w="346px" h="225px" m="2" display={'flex'} flexDirection={'column'} justifyContent="center" alignItems={'center'}>
                        <Image src={EmergencyIco} alt="Emegency insurance" width="60px" mb={'20px'}/>
                        <Text as="b" style={{fontSize:"14px"}} fontFamily="Mulish" color="#065BAA">I need to make an emergency claim</Text>
                        <Text m={'2'} pt="2" as="p" style={{fontSize:"14px"}} fontFamily="Mulish" color="#231F20" textAlign={'center'}>Call AZP to fast track your claim, strictly for
                        emergencies.</Text>
                </Box>
                </Link>
                <Link to="/claim/create/non/step1">
               <Box bg="#ebebeb" w="346px" h="225px" m="2" display={'flex'} flexDirection={'column'} justifyContent="center" alignItems={'center'}>
                    <Image src={SecurityIco} alt="Emegency insurance" width="60px" mb={'20px'}/>
                    <Text as="b" style={{fontSize:"14px"}} fontFamily="Mulish" color="#065BAA">I need to make a non emergency claim</Text>
                    <Text m={'2'} pt="2" as="p" style={{fontSize:"14px"}} fontFamily="Mulish" color="#231F20" textAlign={'center'}>Fill in all of the steps to file your claim and keep
					track of it.</Text>
               </Box>
                </Link>
               
            </Center>
        </Box>
    )
}
export default ClaimMenu