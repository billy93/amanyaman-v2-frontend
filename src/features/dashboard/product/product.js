import React, { useState } from 'react'
import { useSelector,useDispatch} from 'react-redux'
import {selectManualInput,selectedTravelInsurance,setSelectTravelInsurancePlan,selectTravelInsurance,setFormStateCoverageType,setFormStateTravellerType,setFormStateTotalPass,setFormStateDestinationCountry,setFormStateStartDate} from '../quota-search/quotaSearchSlice'
import { Stack,Text,Image,Flex,InputRightElement,InputGroup,Heading,Input,Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator, Box,Button, FormControl,FormLabel, ButtonGroup} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import { SlCalender } from 'react-icons/sl'
import Hospital from '../../../img/images/Hospital.png'
import Medicine from '../../../img/images/Medicine.png'
import TravelCaover from '../../../img/images/Plane.png'
import Plan from '../../../img/images/Plane.png'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { MdLogin, MdFilterList, MdWarning } from 'react-icons/md'

const Form2 = ({label,hasCompletedAllSteps,activeStep,reset,prevStep,nextStep,isLastStep}) => {
    const initState = useSelector(selectTravelInsurance)
    const selectedInsurance = useSelector(selectedTravelInsurance)
    const dispatch = useDispatch()
    const selectProduct = (data) => {
       dispatch(setSelectTravelInsurancePlan({
            travelInsurancePlan:{...data}
        }))
    }
    const SelectInsurancePlan = (e) => {
        console.log('d', e)
        // console.log('d', i)
        dispatch(setSelectTravelInsurancePlan({
            // travelInsurancePlan:data
        }))
    }
    return (
        <Box mt="5em">
             <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} m="1.5em">
                <Heading as={'h6'} size={'sm'}>products</Heading>
                <Stack direction='row' spacing={4} m={'2.5'}>
                    <Button leftIcon={<MdLogin />} colorScheme='#231F20' variant='outline' size={'sm'} color="#231F20">
                        Download
                    </Button>
                    <Button leftIcon={<MdLogin />} colorScheme='#231F20' variant='outline' size={'sm'} color="#231F20">
                        Compare
                    </Button>
                    <Button leftIcon={<MdFilterList />} colorScheme='#231F20' variant='outline' size={'sm'} color="#231F20">
                        Apply Filter
                    </Button>
                </Stack>
            </Box>
            <Box w={{ base: "100%" }} bg="white" p={'20px'} borderRadius={'5px'} textAlign={'left'} border="2px #ebebeb">
                {
                    initState?.map((products, i) => {
                        return (
                        <Box mb="1em" key={i} onClick={() => selectProduct(products)} as="div" cursor={'pointer'} _hover={{
                    border: "2px solid #0358a8",
                    transition:".5s "
                }} boxShadow={'0px 0px 5px 5px rgba(153, 180, 206, 0.2)'} p="20px" border={products.id === selectedInsurance?.id ? '2px solid #065BAA' : ''}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Heading as="h4" size="md" style={{fontSize:"18px"}}>
                        {products.product}
                    </Heading>
                    <Heading variant="primary" as="h4" size="md" style={{fontSize:"18px"}}>
                        {products.cost}
                    </Heading>
                </Box>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Box display="flex" justifyContent={'center'}>
                        <Image src={Hospital} alt="hospital" />
                        <Box>
                         <Text as="b" fontSize={'sm'} style={{fontSize:"12px"}} fontFamily={'Mulish'}>
                            {products.cover?.personalAccidentCover?.title}
                         </Text>
                         <Text as="p" fontSize={'sm'} style={{fontSize:"12px"}} fontFamily={'Mulish'}>
                           {products.cover?.personalAccidentCover?.desc}
                         </Text>
                        </Box>
                    </Box>
                    <Box display="flex" justifyContent={'center'}>
                        <Image src={Medicine} alt="hospital" />
                        <Box>
                         <Text as="b" fontSize={'sm'} style={{fontSize:"12px"}} fontFamily={'Mulish'}>
                           {products.cover?.medicalCover?.title}
                         </Text>
                         <Text as="p" fontSize={'sm'} style={{fontSize:"12px"}} fontFamily={'Mulish'}>
                           {products.cover?.medicalCover?.desc}
                         </Text>
                        </Box>
                    </Box>
                    <Box display="flex" justifyContent={'center'}>
                        <Image src={TravelCaover} alt="hospital" />
                        <Box>
                         <Text as="b" fontSize={'sm'} style={{fontSize:"12px"}} fontFamily={'Mulish'}>
                            {products.cover?.travellerCover?.title}
                         </Text>
                         <Text as="p" fontSize={'sm'} style={{fontSize:"12px"}} fontFamily={'Mulish'}>
                           {products.cover?.travellerCover?.desc}
                         </Text>
                        </Box>
                    </Box>
                </Box>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mt="1em">
                    <Heading as="h4" size="md" style={{fontSize:"14px"}} fontFamily={'Mulish'}>
                        With Additional benefits and Assistance Cover.
                    </Heading>
                    <ButtonGroup gap="5px">
                        <Button variant="base">
                            View Benefits
                        </Button>
                        <Button variant="base">
                            Download PDF
                        </Button>
                    </ButtonGroup>
                </Box>
                </Box>
                    )
                    })
                }
            </Box>
        </Box>
    )
}
export default Form2