import React, { useState } from 'react'
import { useSelector,useDispatch} from 'react-redux'
import {selectPaymentMethod,setPaymentMethod,FillTravellersData,setTravellersData,selectManualInput,selectedTravelInsurance,setSelectTravelInsurancePlan,selectTravelInsurance,setFormStateCoverageType,setFormStateTravellerType,setFormStateTotalPass,setFormStateDestinationCountry,setFormStateStartDate} from '../quotaSearchSlice'
import {
RadioGroup,
Radio,
Textarea,
Stack,
Select,
Modal,
ModalOverlay,
ModalContent,
ModalHeader,
ModalFooter,
ModalBody,
ModalCloseButton,
Center,
Accordion,
AccordionItem,
AccordionButton,
AccordionPanel,
AccordionIcon,Text,Image,Flex,IconButton,
InputRightElement,InputGroup,Heading,Input,
Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator, 
useDisclosure,
Box,Button, FormControl,FormLabel, ButtonGroup} from '@chakra-ui/react'
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import { SlCalender } from 'react-icons/sl'
import Hospital from '../../../../img/images/Hospital.png'
import Medicine from '../../../../img/images/Medicine.png'
import TravelCaover from '../../../../img/images/Plane.png'
import Files from '../../../../img/images/Files.png'
import Plan from '../../../../img/images/Plane.png'
import Pasport from '../../../../img/images/Passport.png'
import Umbrella from '../../../../img/Umbrella.png'
import Payment from '../../../../img/Payment.png'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { MdCreate } from 'react-icons/md'
import ModalForm from './modal'

const Form3 = ({label,hasCompletedAllSteps,activeStep,reset,prevStep,nextStep,isLastStep}) => {
    const initState = useSelector(selectTravelInsurance)
    const paymentMethod = useSelector(selectPaymentMethod)
    const initManual = useSelector(selectManualInput)
    const selectedInsurance = useSelector(selectedTravelInsurance)
    const listTravellers = useSelector(FillTravellersData)
    const [travellerName, setTravellerName] = React.useState("")
    const [open, setOpen] = React.useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const dispatch = useDispatch()
    const [type,setType] = useState("Adult")
    const [typeStatus,setTypeStatus] = useState("Mr")
    const [select,setSelect] = useState("new")
    const [isActiveSelectCountry, setActiveSelectCountry] = useState(false);
    const [isActiveSelectStatus, setActiveSelectStatus] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isActiveNew, setIsActiveNew] = useState(false);
    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName] = useState('')
    const [email,setEmail] = useState('')
    const [phoneNumber,setPhoneNumber] = useState('')
    const [placeOfBirth,setPlaceOfBirth] = useState('')
    const [dateOfBirth,setDateOfBirth] = useState(null)
    const [address, setAddress] = useState('')
    const [pasportNumber, setPasportNumber] = useState('')
    const [searchTraveller, setSearchTraveller] = useState('')
    const [dateBirth, setDateBirth] = useState('')
    
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
    const handleUserChange = (e) => {
        
    }
    const setPhoneNumbers = (e) => {
        setPhoneNumber(e.target.value)
    }
    const setAddresss = (e) => {
        setAddress(e.target.value)
    }
    const setEmailAddress = (e) => {
        setEmail(e.target.value)
    }
    const setSearchTravellers = (e) => {
        setSearchTraveller(e.target.value)
    }
    const handleEditTravellersData = (e) =>{
    e.preventDefault();
    const data = {
        step: 1,
        
        }
    // dispatch((data))
    }
    const addTravellers = (e) => {
        setOpen(!open)
    }

    const setFirstNames = (e) => {
        setFirstName(e.target.value)
    }
    const setLastNames = (e) => {
        setLastName(e.target.value)
    }
    const setPasportNumbers = (e) => {
        setPasportNumber(e.target.value)
    }
    const handleSelectType = (e) => {
    const text = e.target.value
    setType(text)
        
    if (text !== "") {
      setActiveSelectCountry(true)
    } else {
      setActiveSelectCountry(false)
    }
    }
    const handleSelectTypeStatus = (e) => {
    const text = e.target.value
    setTypeStatus(text)
        
    if (text !== "") {
      setActiveSelectStatus(true)
    } else {
      setActiveSelectStatus(false)
    }
    }
    const onSelect = (selected) => {
    setSelect(selected)
    }
    const setPlaceOfBirths = (e) => {
    setPlaceOfBirth(e.target.value)
    }
    const selectDate = (date) => {
        setDateOfBirth(date)
        if (date !==null) {
            setIsActive(true)
        } else {
            setIsActive(false)
        }
    }
    const selectDateNew = (date) => {
        setDateBirth(date)
        if (date !==null) {
            setIsActiveNew(true)
        } else {
            setIsActiveNew(false)
        }
    }
    function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  const formatter = new Intl.DateTimeFormat('en-us', {month: 'long'});

  return formatter.format(date);
  }

  const formatInputValue = () => {
    if (!dateOfBirth) return '';
    return `${dateOfBirth?.day} ${getMonthName(dateOfBirth?.month)} ${dateOfBirth?.year}`;
  };
  const formatInputValues = () => {
    if (!dateBirth) return '';
    return `${dateBirth?.day} ${getMonthName(dateBirth?.month)} ${dateBirth?.year}`;
  };
    const renderCustomInput = ({ ref }) => (
    <>
    <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'}>
      <InputGroup id="float-labelss">
        <Input readOnly ref={ref} placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={dateOfBirth ? `${dateOfBirth?.day} ${getMonthName(dateOfBirth?.month)} ${dateOfBirth?.year}` : ''} h="48px" />
        <InputRightElement children={<SlCalender color='green.500' />} />
         <FormLabel fontSize="12" pt="1.5" className={ isActive || dateOfBirth ? "Actives" : ""} fontFamily={'Mulish'}>Date Of Birth</FormLabel>
      </InputGroup>
         {/* It is important that the Label comes after the Control due to css selectors */}
    </FormControl>
    </>
  )
    const renderCustomInputs = ({ ref }) => (
    <>
    <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'}>
      <InputGroup id="float-labelss_new">
        <Input readOnly ref={ref} placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={dateBirth ? `${dateBirth?.day} ${getMonthName(dateBirth?.month)} ${dateBirth?.year}` : ''} h="48px" />
        <InputRightElement children={<SlCalender color='green.500' />} />
         <FormLabel fontSize="12" pt="1.5" className={ isActiveNew || dateBirth ? "Actives" : ""} fontFamily={'Mulish'}>Date Of Birth</FormLabel>
      </InputGroup>
         {/* It is important that the Label comes after the Control due to css selectors */}
    </FormControl>
    </>
    )
    const [tabIndex, setTabIndex] = useState(0)
    console.log('tab', tabIndex)
    return (
        <Box border={'1px'} borderColor="#ebebeb" >
            
             <Box  border={'1px'} borderColor="#ebebeb" p="12px" display="flex" justifyContent={'space-between'} alignItems="center">
                <Box as='button' isDisabled={activeStep === 0}  onClick={prevStep} display="flex"textAlign="left" >
                 <ArrowBackIcon boxSize={4} size="sm" w={5} h={5} color="#065BAA"/>           
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
                    <Tabs position="relative" isFitted variant="unstyled" mt="1em" onChange={(index) => setTabIndex(index)} index={tabIndex}>
                    <TabList  mb='1em'>
                        <Tab fontFamily={'Mulish'} style={{fontSize:"14px"}} fontWeight={'900'}>Credit Card</Tab>
                        <Tab fontFamily={'Mulish'} style={{fontSize:"14px"}} fontWeight={'900'}>Bank Transfer</Tab>
                        <Tab fontFamily={'Mulish'} style={{fontSize:"14px"}} fontWeight={'900'}>Credit</Tab>
                        <Tab fontFamily={'Mulish'} style={{fontSize:"14px"}} fontWeight={'900'}>Deposit Top Up</Tab>
                    </TabList>
                    <TabIndicator
                    mt="-1.5px"
                    height="2px"
                    bg="blue.500"
                    borderRadius="1px"
                    />
                    <TabPanels>
                        <TabPanel>
                        <Center display={'flex'} justifyContent={'center'} alignItems={'center'} h={{base:"auto", md:"400px"}}>
                            <Text as="b"size={'sm'} fontFamily={'Mulish'} style={{fontSize:"14px"}} textAlign={'center'} fontWeight={'900'}>
                            You will be redirected to our payment page to continue the payment. Click the continue button to proceed.
                        </Text>
                        </Center>
                        </TabPanel>
                        <TabPanel>
                        <Center display={'flex'} justifyContent={'center'} alignItems={'center'} h={{base:"auto", md:"400px"}}>
                            <Text as="b"size={'sm'} fontFamily={'Mulish'} style={{fontSize:"14px"}} textAlign={'center'} fontWeight={'900'}>
                            You will be redirected to our payment page to continue the payment. Click the continue button to proceed.
                        </Text>
                        </Center>
                        </TabPanel>
                        <TabPanel>
                       <Center display={'flex'} justifyContent={'center'} alignItems={'center'} h={{base:"auto", md:"400px"}}>
                            <Text as="b"size={'sm'} fontFamily={'Mulish'} style={{fontSize:"14px"}} textAlign={'center'} fontWeight={'900'}>
                            You will be redirected to our payment page to continue the payment. Click the continue button to proceed.
                        </Text>
                        </Center>
                        </TabPanel>
                        <TabPanel>
                       <Center display={'flex'} justifyContent={'center'} alignItems={'center'} h={{base:"auto", md:"400px"}}>
                            <Text as="b"size={'sm'} fontFamily={'Mulish'} style={{fontSize:"14px"}} textAlign={'center'}fontWeight={'900'}>
                            You will be redirected to our payment page to continue the payment. Click the continue button to proceed.
                        </Text>
                        </Center>
                        </TabPanel>
                    </TabPanels>
                    </Tabs>
                </Box>
                <Box display={'flex'} flexDirection={'column'} w={{base:"100%", md:"30%", sm:"40%"}} border={'1px solid #ebebeb'} mt="10px" mr="10px">
                <Box bg="#F0F3F8" p="10px">
                <Text as="b" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"14px"}} >
                    {'Summary'}
                </Text>
                </Box>
                <Box bg="white" p="10px">
                    <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} boxSizing='borderBox' borderBottom={'1px solid #ebebeb'} pb="10px" pt="10px"  gap="1em">
                        <Image src={Files} alt="insurance"/>
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
                        <Image src={Plan} alt="insurance"/>
                        <Box display={'flex'} justifyContent={'center'} flexDirection={'column'}>
                        <Text as="b" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"12px"}}>
                            {'Travel Details'}
                        </Text>
                        <Box>
                        <Text as="p" size={'sm'} fontFamily={'Mulish'} color="#065BAA" style={{fontSize:"12px"}} gap="1em">
                           {initManual.coverageType}
                        </Text>
                        </Box>
                        <Box display={'flex'} gap="2px" flexWrap={'nowrap'}>
                            {
                                        initManual.destinationCountry?.map((country, i) => {
                                            return (
                                                <Text key={i} as="p" size={'sm'} fontFamily={'Mulish'} color="#065BAA" style={{fontSize:"12px"}}>
                                                {country.label}
                                                </Text>
                                            )
                               })
                            }
                        
                        </Box>
                    </Box>
                    </Box>
                    <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} boxSizing='borderBox' borderBottom={'1px solid #ebebeb'} pb="10px" pt="10px"  gap="1em">
                        <Image src={Umbrella} alt="insurance"/>
                        <Box display={'flex'} justifyContent={'center'} flexDirection={'column'}>
                        <Text as="b" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"12px"}}>
                            {'Select Product'}
                        </Text>
                        <Text as="b" size={'sm'} fontFamily={'Mulish'} color="#065BAA" style={{fontSize:"12px"}}>
                            {selectedInsurance?.titleProduct}
                        </Text>
                    </Box>
                    </Box>
                    <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} boxSizing='borderBox' borderBottom={'1px solid #ebebeb'} pb="10px" pt="10px">
                        <Image src={Pasport} alt="insurance"/>
                        <Accordion allowMultiple>
                            <AccordionItem border={'none'}>
                                <h2>
                                <Box as="div">
                                    <AccordionButton border={'none'} style={{border:"none"}}>
                                    <Box as="span" flex='1' textAlign='left'>
                                        <Text as="b" fontSize={'sm'} fontFamily={'Mulish'}  style={{fontSize:"12px"}}>
                                        {'List Of Travellers'}
                                        </Text>
                                    </Box>
                                      <AccordionIcon />
                                </AccordionButton>
                                </Box>
                                </h2>
                                <Box>     
                                <AccordionPanel pb={4}>
                                    
                                       {/* <Box> */}
                                        {
                                         listTravellers?.listTravellers.map((list,i) =>{
                                             return (
                                                <Box display={'flex'} key={i} gap="2px">         
                                                <Text as="p" size="sm" fontFamily={'Mulish'}  style={{fontSize:"12px"}}>
                                                    {`Adult${i+1} -  `}
                                                </Text>
                                                <Text as="p" size="sm" fontFamily={'Mulish'}  style={{fontSize:"12px"}}>
                                                    {list.fullName}
                                                </Text>
                                                </Box>
                                             )
                                         })                
                                        }
                                       {/* </Box>  */}
                                    
                                </AccordionPanel>
                                </Box>
                            </AccordionItem>
                            </Accordion>
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
                            {selectedInsurance?.cost}
                             </Text>
                        </Box>
                        <Box w="100%" display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap="1em" borderBottom="1px solid #ebebeb" pb="10px" pt="5px">
                            <Text as="b" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"12px"}}>
                            {'Quantity'}
                             </Text>
                            <Text as="b" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"12px"}}>
                                        { 'x'}{listTravellers?.listTravellers?.length}
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
            {hasCompletedAllSteps !==undefined && (
                        <Box>
                        <Heading fontSize="xl" textAlign={"center"}>
                            Woohoo! All steps completed! 🎉
                        </Heading>
                        </Box>
                    )}
                    <Flex width="100%" justify="space-between" gap={6} mt="2em" mb="2em">
                        {hasCompletedAllSteps !==undefined ? (
                        <Button size="sm" onClick={reset}>
                            Reset
                        </Button>
                        ) : (
                        <>
                            <Box w={'100%'} display={'flex'} justifyContent={'space-between'} alignItems={'center'} p="1em">
                                <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
                                    <Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>   
                                    Select Method :
                                </Text>
                                <Text as="b" fontFamily={'Mulish'} pl="5px">
                                     {tabIndex === 0 ? 'Credit Card' : tabIndex ===1 ? 'Bank Transfer' : tabIndex ===2 ? 'Credit' : 'Deposit Top Up'}
                                </Text>
                                </Box>
                            <ButtonGroup>
                                <Button size="sm" onClick={nextStep} w={{base:"100%", md:"270px"}} h="48px">
                                {isLastStep ? "Finish" : "CONTINUE PAYMENT"}
                                    </Button>
                             </ButtonGroup>
                            </Box>
                           
                        </>
                )}
                </Flex>
        </Box>
    )
}
export default Form3