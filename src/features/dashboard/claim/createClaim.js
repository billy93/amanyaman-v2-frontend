import { useGetUsersQuery } from "./claimApiSlice"
import { NavLink } from "react-router-dom";
import Data from './list.json'
import {
  Box,
  Heading,
  Text,
  Center,
  Button,
  Stack,
  Divider
} from '@chakra-ui/react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from '@chakra-ui/react'
import { useSelector } from "react-redux"
import {useDispatch} from 'react-redux'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Step1 from './formstep1/form-step1'
import Step2 from './formstep2/form-step2'
import Step3 from './formstep3/form-step3'
import Step4 from './formstep4/form-step4'
import Step5 from './formstep5/form-step5'
import Step6 from './formstep6/form-step6'
import Step7 from './formstep7/form-step7'
import Step8 from './formstep8/form-step8'
import {selectCurrentStep, setFormState } from './createClaimSlice'
import { useMediaQuery } from "@chakra-ui/media-query";
import 'react-calendar/dist/Calendar.css';


const CreateClaim = () => {
    const currentstep = useSelector(selectCurrentStep)
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
            <Box>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mt={{base:"4em", md:"4em"}}>
                 <Box borderBottom="1px" borderColor={'#ebebeb'} w="100%" pt="15px">  
                  <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
                    <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink as={NavLink} to='/claim/create'>
                                <Text as="b" ml="4" fontSize="sm" color="#065BAA"  _hover={{
                                    borderBottom: "#065BAA",
                                    border:"1 px solid"
                                }}>
                                    Create Claim
                                </Text>
                            </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <BreadcrumbLink as={NavLink} to='#' style={{ pointerEvents: 'none'}}>
                            <Text as={'b'} fontSize={'sm'} color="#231F20"
                           >
                              Claim
                            </Text>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    </Breadcrumb>
                 </Box>
                </Box>
                <Box p="3" display={'flex'} flexDirection={ isMobile ? 'column' : 'row'}>
                <Box w={{base:"100%", md:"360px"}} as="section" minH={'200px'} display={'flex'} justifyContent={'flex-start'} flexDirection="column" alignItems={isMobile ? 'flex-start' : 'center'}>
                    <Box w="100%" p={'10px'} mb="10px" display={'flex'} justifyContent={'center'} alignItems={'flex-start'} flexDirection={'column'} >
                        <Box m={{base:"0",md:"auto"}}>
                        <Heading pb="10px" as={'h2'} color="#065BAA" fontSize={'md'} style={{fontSize:'24px'}} fontFamily={'Mulish'} fontWeight="700">
                         Create Cleam
                        </Heading>
                        <Text pb="10px" as="p" color="#231F20" fontSize={'xs'} style={{fontSize:"14px"}} fontFamily={'Mulish'}>
                            Please complete these steps
                        </Text>
                        <Stack direction='row' w='250px' p={2}>
                            <Divider orientation="horizontal" />
                        </Stack>
                        </Box>
                    </Box>
                    <Box>
                    <Box p="5px" display={'flex'}  alignItems={'center'} pb="5">    
                        <Box width={'25px'} height={'25px'} bg={currentstep ===1 ? '#065BAA' : '#878787'}  borderRadius={'full'} display="flex" justifyContent={'center'} alignItems="center" mr={'5px'}>
                            <Text as="b" fontSize={'sm'} color="white">
                            1
                            </Text>
                        </Box>
                    <Text as="b" fontSize={'sm'} color={currentstep ===1 ? "#231F20" : "#878787"}>
                          Select Claim
                        </Text>
                    </Box>
                    <Box p="5px" display={'flex'}  alignItems={'center'} pb="5">    
                        <Box width={'25px'} height={'25px'} bg={currentstep ===2 ? '#065BAA' : '#878787'} borderRadius={'full'} display="flex" justifyContent={'center'} alignItems="center" mr={'5px'}>
                        <Text as="b" fontSize={'sm'} color="white">
                          2
                        </Text>
                    </Box>
                    <Text as="b" fontSize={'sm'} color={currentstep ===2 ? "#231F20" : "#878787"}>
                          Select Traveller
                        </Text>
                    </Box>
                    <Box p="5px" display={'flex'}  alignItems={'center'} pb="5">    
                    <Box width={'25px'} height={'25px'} bg={currentstep ===3 ? '#065BAA' : '#878787'} borderRadius={'full'} display="flex" justifyContent={'center'} alignItems="center" mr={'5px'}>
                        <Text as="b" fontSize={'sm'} color="white">
                          3
                        </Text>
                    </Box>
                    <Text as="b" fontSize={'sm'} color={currentstep ===3 ? "#231F20" : "#878787"}>
                          Time & Location
                        </Text>
                    </Box>
                    <Box p="5px" display={'flex'}  alignItems={'center'} pb="5">    
                    <Box width={'25px'} height={'25px'} bg={currentstep ===4 ? '#065BAA' : '#878787'} borderRadius={'full'} display="flex" justifyContent={'center'} alignItems="center" mr={'5px'}>
                        <Text as="b" fontSize={'sm'} color="white">
                          4
                        </Text>
                    </Box>
                    <Text as="b" fontSize={'sm'} color={currentstep ===4 ? "#231F20" : "#878787"}>
                          Describe Incident
                        </Text>
                    </Box>
                    <Box p="5px" display={'flex'}  alignItems={'center'} pb="5">    
                    <Box width={'25px'} height={'25px'} bg={currentstep ===5 ? '#065BAA' : '#878787'} borderRadius={'full'} display="flex" justifyContent={'center'} alignItems="center" mr={'5px'}>
                        <Text as="b" fontSize={'sm'} color="white">
                          5
                        </Text>
                    </Box>
                    <Text as="b" fontSize={'sm'} color={currentstep ===5 ? "#231F20" : "#878787"}>
                          Provide Expenses
                        </Text>
                    </Box>
                    <Box p="5px" display={'flex'}  alignItems={'center'} pb="5">    
                    <Box width={'25px'} height={'25px'} bg={currentstep ===6 ? '#065BAA' : '#878787'} borderRadius={'full'} display="flex" justifyContent={'center'} alignItems="center" mr={'5px'}>
                        <Text as="b" fontSize={'sm'} color="white">
                          6
                        </Text>
                    </Box>
                    <Text as="b" fontSize={'sm'} color={currentstep ===6 ? "#231F20" : "#878787"}>
                          Upload Documentation
                        </Text>
                    </Box>
                    <Box p="5px" display={'flex'}  alignItems={'center'} pb="5">    
                    <Box width={'25px'} height={'25px'} bg={currentstep ===7 ? '#065BAA' : '#878787'} borderRadius={'full'} display="flex" justifyContent={'center'} alignItems="center" mr={'5px'}>
                        <Text as="b" fontSize={'sm'} color="white">
                          7
                        </Text>
                    </Box>
                    <Text as="b" fontSize={'sm'} color={currentstep ===7 ? "#231F20" : "#878787"}>
                          Financial Details
                        </Text>
                    </Box>
                    <Box p="5px" display={'flex'}  alignItems={'center'} pb="5">    
                    <Box width={'25px'} height={'25px'} bg={currentstep ===8 ? '#065BAA' : '#878787'} borderRadius={'full'} display="flex" justifyContent={'center'} alignItems="center" mr={'5px'}>
                        <Text as="b" fontSize={'sm'} color="white">
                          8
                        </Text>
                    </Box>
                    <Text as="b" fontSize={'sm'} color={currentstep ===8 ? "#231F20" : "#878787"}>
                          Review & Finalize
                        </Text>
                    </Box>
                    </Box>
                </Box>
                <Box as="section" minH={'200px'} mr="3" w={{base:"100%", md:"982px"}}>
                        {
                            currentstep === 1 ? 
                                <Step1 /> :
                            currentstep === 2 ? 
                                <Step2 /> :
                            currentstep === 3 ? 
                                <Step3 /> :
                            currentstep === 4 ? 
                                <Step4 /> :
                            currentstep === 5 ? 
                                <Step5 /> :
                            currentstep === 6 ? 
                                <Step6 />
                                    :
                            currentstep === 7 ? 
                                <Step7 />
                                    :
                            currentstep === 8 ? 
                                <Step8 />
                                    :
                                <Center h="100%">
                                    <Text as="p" fontSize={'sm'} fontFamily="Mulish" fontWeight={'800'} style={{fontSize:"15px"}}>
                                        On Progresh ...
                                    </Text>
                                </Center>
                            
                        }
                </Box>
            </Box>
            </Box>
        )
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    }

    return content
}
export default CreateClaim