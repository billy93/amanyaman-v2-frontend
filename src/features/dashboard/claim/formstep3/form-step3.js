import React,{useState} from 'react'
import {
Box,
Stack,
Text,
Heading,
Button,
Image,
FormControl,
Input,
FormLabel,
InputGroup,
InputRightElement,
Select,
Divider,
Textarea,
Center
} from '@chakra-ui/react'
import { useSelector } from "react-redux"
import {useDispatch} from 'react-redux'
import {selectClaimType, setFormState,selectCurrentStep,setFormStateLocation,selectedTimeLocation } from '../createClaimSlice'
import { selectCurrentTraveller } from "../../../auth/authSlice"
import Umbrellaico from '../../../../img/Umbrella.png'
import Traveller from '../../../../img/traveller.png'
import { ArrowBackIcon } from '@chakra-ui/icons'
import {SlCalender} from 'react-icons/sl'
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import { differenceInCalendarDays } from 'date-fns';

const disabledDates = ["tomorrow", "in3Days", "in5Days"];
function isSameDay(a, b) {
  return differenceInCalendarDays(a, b) === 0;
}
function tileDisabled({ date, view }) {
  // Disable tiles in month view only
  if (view === 'month') {
    // Check if a date React-Calendar wants to check is on the list of disabled dates
    return disabledDates.find(dDate => isSameDay(dDate, date));
  }
}
const StepForm3 = () => {
  const dispatch = useDispatch()
  const locationData = useSelector(selectedTimeLocation)
  const selected = useSelector(selectClaimType)
  const selectedTraveller = useSelector(selectCurrentTraveller)
  const current = useSelector(selectCurrentStep)
  const [isActive, setActive] = useState(false);
  const [isActiveDescLoc, setActiveDescLoc] = useState(false);
  const [isActiveSelectCountry, setActiveSelectCountry] = useState(false);
  

  const selectDate = (date) => {
    const data = {
        step: current,
        timeLocation: {
          expirationDate:{...date},
          time:locationData?.time,
          country:locationData?.country,
          descLocation:locationData?.descLocation
        }
        }
        dispatch(setFormStateLocation(data))
        if (date !== null) {
          setActive(true)
        } else {
          setActive(false)
        }
  }
  const handleTimePicker = (e) => {
    // setTime(e.target.value)
        const data = {
        step: current,
        timeLocation: {
          expirationDate:{...locationData.expirationDate},
          time:e.target.value,
          country:locationData?.country,
          descLocation:locationData?.descLocation
        }
        }
        dispatch(setFormStateLocation(data))
  }

  const handleDescLoc = (e) => {
    const text = e.target.value
    // setDescLoc(text)
    const data = {
        step: current,
        timeLocation: {
          expirationDate:{...locationData.expirationDate},
          time:locationData?.time,
          country:locationData?.country,
          descLocation:text
        }
        }
        dispatch(setFormStateLocation(data))
    if (text !== "") {
      setActiveDescLoc(true)
    } else {
      setActiveDescLoc(false)
    }
  }

  const handleSelectCountry = (e) => {
    const text = e.target.value
    // setSelecteCountry(text)
    const data = {
        step: current,
        timeLocation: {
          expirationDate:{...locationData.expirationDate},
          time:locationData?.time,
          country:text,
          descLocation:locationData?.descLocation
        }
        }
        dispatch(setFormStateLocation(data))
    if (text !== "") {
      setActiveSelectCountry(true)
    } else {
      setActiveSelectCountry(false)
    }
  }

  function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  const formatter = new Intl.DateTimeFormat('en-us', {month: 'long'});

  return formatter.format(date);
  }

  const formatInputValue = () => {
    if (!locationData?.expirationDate) return '';
    return `${locationData?.expirationDate?.day} ${getMonthName(locationData?.expirationDate?.month)} ${locationData?.expirationDate?.year}`;
  };
  
  const handleBackStep = (e) => {
    e.preventDefault()
    const data = {
        step: current-1,
        selected
        }
     dispatch(setFormState(data))
  }
    const handleNext = (e) => {
      e.preventDefault()
      const data = {
        step: current + 1,
        timeLocation: {
          expirationDate:{...locationData?.expirationDate},
          time:locationData?.time,
          country:locationData?.country,
          descLocation:locationData?.descLocation
        }
        }
        dispatch(setFormStateLocation(data))
    }
  const renderCustomInput = ({ ref }) => (
    <>
    <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'}>
      <InputGroup id="float-label">
        <Input readOnly ref={ref} placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={locationData?.expirationDate ? `${locationData?.expirationDate?.day} ${getMonthName(locationData?.expirationDate?.month)} ${locationData?.expirationDate?.year}` : ''} h="48px" />
        <InputRightElement children={<SlCalender color='green.500' />} />
         <FormLabel fontSize="12" pt="1.5" className={ isActive || locationData?.expirationDate ? "Active" : ""} fontFamily={'Mulish'}>Expiration Date</FormLabel>
      </InputGroup>
         {/* It is important that the Label comes after the Control due to css selectors */}
    </FormControl>
    </>
  )
  return (
    <Stack>
      <Box border={'1px'} borderColor="#ebebeb" p="12px" display="flex" justifyContent={'space-between'} alignItems="center">
        <Box as='button' onClick={handleBackStep} display="flex"textAlign="left" >
          <ArrowBackIcon boxSize={4} size="sm" w={5} h={5} color="#065BAA"/>           
          <Heading fontSize='sm' as="b" color="#065BAA" style={{fontSize:'16px'}} fontFamily="Mulish" fontWeight={'700'}>
            Back
          </Heading>
        </Box>
        <Box position={'relative'} m="auto">
          <Heading as="h4" style={{fontSize:'18px'}} fontSize="sm" color="#065BAA" textAlign={'center'}>Time & Location </Heading>
        </Box>
      </Box>
      <Box border="1px" borderColor={'#ebebeb'} borderTop={'none'}>
        <Box>
          <Box width={{base:"100%",md:"350px"}} m="1em"> 
            <DatePicker
              value={locationData?.expirationDate}
              onChange={selectDate}
              inputPlaceholder="Select a date" // placeholder
              formatInputText={formatInputValue} 
              inputClassName="my-custom-input" // custom class
              renderInput={renderCustomInput} 
              shouldHighlightWeekends
              />
            <Input type="time" mt={{ base: "5px", md: "14px" }} style={{ fontSize: '14px' }} fontFamily={'Mulish'} h="48px" onChange={handleTimePicker} value={locationData.time} />
               
                <FormControl variant="floating" isRequired fontFamily={'Mulish'} mt="14px" id="float-label"> 
                    <Box className='floating-form'>
                      <Box className='floating-label'>
                        <Select className="floating-select" placeholder='' defaultValue={locationData?.country} h="48px" onChange={handleSelectCountry}>  
                          <option value=""></option>
                          <option value="Indonesia">Indonesia</option>
                          <option value="Australia">Australia</option>
                          <option value="USA">United State Us</option>
                        </Select>
                        <span className="highlight"></span>
                        <FormLabel fontSize="12" pt="1.5" style={{ transform: isActiveSelectCountry || locationData?.country !=="" ? "translate(0, -19px) scale(0.75)": "",color: isActiveSelectCountry || locationData.country !=="" ?"#065baa" :"", fontSize:"14px" }} fontFamily={'Mulish'}>Select Country</FormLabel>
                       </Box>
                    </Box>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
                <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'} mt="14px"> 
                    <Textarea placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={locationData?.descLocation} onChange={handleDescLoc} h="48px" />
                    <FormLabel fontSize="12" pt="1.5" className={ isActiveDescLoc ? "Active" : ""}  fontFamily={'Mulish'} style={{fontSize:'14px'}}>Description Location</FormLabel>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
       </Box>
       <Box bg="white" pt="1px" pb="60px" pl="6px">
          <Box bg="white" m={2} w={{base:"100%", md:"365px"}} borderTopRightRadius={'5px'} borderTopLeftRadius={'5px'} border="1px solid" borderColor={'#ebebeb'}>
            <Box bg="#F0F3F8" p="10px" borderTopRightRadius={'5px'} borderTopLeftRadius={'5px'}>
              <Heading size={'sm'} variant="custom">Summary</Heading>
            </Box>
            <Box>
              <Box display="flex" justifyContent={'flex-start'} alignItems={'center'} p={3}>
                <Image src={Umbrellaico} alt="cover insurance" />
                <Box display="flex" justifyContent={'flex-start'} flexDirection={'column'} p={1}>
                  <Heading variant="custom" size="sm" pb="5px">
                    Selected Claim
                  </Heading>
                  <Text as="p" fontSize={'sm'} style={{ fontSize: "16px" }} fontFamily="Mulish" lineHeight={'15px'}>{ selected}</Text>
                </Box>
              </Box>
              <Center>
                <Divider  width={'95%'}/>
              </Center>
              <Box display="flex" justifyContent={'flex-start'} alignItems={'center'} p={3}>
                <Image src={Traveller} alt="cover insurance" />
                <Box display="flex" justifyContent={'flex-start'} flexDirection={'column'} p={1}>
                  <Heading variant="custom" size="sm" pb="1px">
                    Selected Traveller
                  </Heading>
                    <Text as="p" fontSize={'sm'} style={{ fontSize: "16px" }} fontFamily="Mulish" lineHeight={'15px'}>{ 'Mr. '}{ selectedTraveller}</Text>
                </Box>
              </Box>
            </Box>
          </Box>
       </Box>
       </Box>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} p="9px" borderRadius={'5px'} border="1px" borderColor={'#ebebeb'}>
        <Box display={'flex'} justifyContent={'flex-start'}>
          <Text as="p" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"14px"}}>
            Date & location selected: :
          </Text>
          <Text as="b" size={'sm'}fontFamily={'Mulish'} style={{fontSize:"14px"}}>
              {locationData?.expirationDate ? `${locationData?.expirationDate?.day} ${getMonthName(locationData?.expirationDate?.month)} ${locationData?.expirationDate?.year}, in ${locationData?.country}`  : ""}
          </Text>
        </Box>
        <Button isDisabled={locationData?.expirationDate ===null || locationData?.time ==="" || locationData?.country ==="" || locationData?.descLocation === "" ? true : false} variant={'ClaimBtn'} style={{textTransform:'uppercase',fontSize:'14px'}} fontFamily="arial" fontWeight={'700'} onClick={handleNext}>Describe Incident</Button>
      </Box>
      </Box>
    </Stack>
  )
 }
export default StepForm3