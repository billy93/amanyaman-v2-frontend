import { useGetUsersQuery } from "./policyApiSlice"
import { NavLink } from "react-router-dom";
import Data from './list.json'
import {
  Box,
  Heading,
  Text,
  Center,
  Button,
  Stack,
  Divider,
  Image
} from '@chakra-ui/react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from '@chakra-ui/react'
import { useSelector } from "react-redux"
import {useDispatch} from 'react-redux'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { useMediaQuery } from "@chakra-ui/media-query";
import 'react-calendar/dist/Calendar.css';
import Payment from '../../../img/Payment.png'

const PolicyDetails = () => {
    const [isMobile] = useMediaQuery("(max-width: 768px)")
    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery()

    let content;
    if (isLoading) {
        content = <Center h='50vh' color='#065BAA'>
                    <Text as={'p'} size="xs">
                        Loading...
                    </Text>
                   </Center>;
    } else if (Data) {
        content = (
            <Box border={'1px'} borderColor="#ebebeb" >
            
             <Box  border={'1px'} borderColor="#ebebeb" p="12px" display="flex" justifyContent={'space-between'} alignItems="center">
                <Box as='button' isDisabled={'activeStep' === 0}  onClick={'prevStep'} display="flex"textAlign="left" >
                 {/* <ArrowBackIcon boxSize={4} size="sm" w={5} h={5} color="#065BAA"/>            */}
                    <Heading fontSize='sm' as="b" color="#065BAA" style={{fontSize:'16px'}} fontFamily="Mulish" fontWeight={'700'}>
                        Edit Traveller's Data
                    </Heading>
                </Box>    
                <Box position={'relative'} m="auto">
                    <Heading variant="primary" as="h4" size="md"style={{fontSize:'18px'}} fontSize="sm" color="#065BAA" textAlign={'center'}>Select Payment Method </Heading>
                </Box>
            </Box>
            <Box display={'flex'}>
                <Box w={{base:"100%", md:"70%", sm:"60%"}}>
                </Box>
                <Box display={'flex'} flexDirection={'column'} w={{base:"100%", md:"30%", sm:"40%"}} border={'1px solid #ebebeb'} mt="10px" mr="10px">
                <Box bg="#F0F3F8" p="10px">
                <Text as="b" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"14px"}} >
                    {'Summary'}
                </Text>
                </Box>
                <Box bg="white" p="10px">
                    <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} boxSizing='borderBox' borderBottom={'1px solid #ebebeb'} pb="10px" pt="10px"  gap="1em">
                        <Image src={Payment} alt="insurance"/>
                        <Box display={'flex'} justifyContent={'center'} flexDirection={'column'}>
                        <Text as="b" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"12px"}}>
                            {'Booking Code'}
                        </Text>
                        <Text as="b" size={'sm'} fontFamily={'Mulish'} color="#065BAA" style={{fontSize:"12px"}}>
                            {'12345677'}
                        </Text>
                    </Box>
                    </Box>
                    <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} boxSizing='borderBox' borderBottom={'1px solid #ebebeb'} pb="10px" pt="10px"  gap="1em">
                        <Image src={Payment} alt="insurance"/>
                        <Box display={'flex'} justifyContent={'center'} flexDirection={'column'}>
                        <Text as="b" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"12px"}}>
                            {'Travel Details'}
                        </Text>
                        <Box>
                        <Text as="p" size={'sm'} fontFamily={'Mulish'} color="#065BAA" style={{fontSize:"12px"}} gap="1em">
                           {'initManual.coverageType'}
                        </Text>
                        </Box>
                    </Box>
                    </Box>
                    <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} boxSizing='borderBox' borderBottom={'1px solid #ebebeb'} pb="10px" pt="10px"  gap="1em">
                        <Image src={Payment} alt="insurance"/>
                        <Box display={'flex'} justifyContent={'center'} flexDirection={'column'}>
                        <Text as="b" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"12px"}}>
                            {'Select Product'}
                        </Text>
                        <Text as="b" size={'sm'} fontFamily={'Mulish'} color="#065BAA" style={{fontSize:"12px"}}>
                            {'selectedInsurance?.titleProduct'}
                        </Text>
                    </Box>
                    </Box>
                    <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} boxSizing='borderBox' borderBottom={'1px solid #ebebeb'} pb="10px" pt="10px"  gap="1em">
                        <Image src={Payment} alt="insurance"/>
                        <Box display={'flex'} justifyContent={'center'} flexDirection={'column'}>
                        <Text as="b" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"12px"}}>
                            {'Payment Summary'}
                        </Text>
                        <Box w="100%" display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap="1em" borderBottom="1px solid #ebebeb" pb="10px" pt="5px">
                            <Text as="b" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"12px"}}>
                            {'Product Price'}
                             </Text>
                            <Text as="b" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"12px"}}>
                            {'selectedInsurance?.cost'}
                             </Text>
                        </Box>
                        <Box w="100%" display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap="1em" borderBottom="1px solid #ebebeb" pb="10px" pt="5px">
                            <Text as="b" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"12px"}}>
                            {'Quantity'}
                             </Text>
                            <Text as="b" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"12px"}}>
                                        { 'x'}{'listTravellers?.listTravellers?.length'}
                             </Text>
                        </Box>
                        <Box w="100%" display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap="1em" borderBottom="1px solid #ebebeb" pb="10px" pt="5px">
                            <Text as="b" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"12px"}}>
                            {'Total Payment'}
                             </Text>
                            <Text as="b" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"12px"}}>
                                        { 'Rp' }{'2.345.555'}
                             </Text>
                        </Box>
                    </Box>
                    </Box>
                </Box>
                </Box>
            </Box>
        </Box>
        )
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    }

    return content
}
export default PolicyDetails