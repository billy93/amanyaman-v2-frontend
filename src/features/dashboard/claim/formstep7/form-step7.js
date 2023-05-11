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
import {selectClaimType, setFormState,selectCurrentStep,setFormStateLocation,selectedTimeLocation,setFinancialDetails,financial,listDoc,setuploadDoc } from '../createClaimSlice'
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
const StepForm7 = () => {
  const dispatch = useDispatch()
  const locationData = useSelector(selectedTimeLocation)
  const selected = useSelector(selectClaimType)
  const docsList = useSelector(listDoc)
  const financialD = useSelector(financial)
  const selectedTraveller = useSelector(selectCurrentTraveller)
  const current = useSelector(selectCurrentStep)
  const [isActive, setActive] = useState(false);
  const [isActiveNumber, setActiveNumber] = useState(false);
  const [isActiveSelect, setActiveSelect] = useState(false);
  const [selectBank, setSelectBank] = useState('BNI');


  const handleBankNumber = (e) => {
    const text = e.target.value
    // setDescLoc(text)
    const data = {
        step: current,
        financial: {
          bankName:financialD.bankName,
          bankNumber:text,
          holder:financialD.holder
        }
        }
        dispatch(setFinancialDetails(data))
    if (text !== "") {
      setActiveNumber(true)
    } else {
      setActiveNumber(false)
    }
  }
  const handleHolder = (e) => {
    const text = e.target.value
    // setDescLoc(text)
    const data = {
        step: current,
        financial: {
          bankName:financialD.bankName,
          bankNumber:financialD.bankNumber,
          holder:text
        }
        }
        dispatch(setFinancialDetails(data))
    if (text !== "") {
      setActive(true)
    } else {
      setActive(false)
    }
  }

  const handleSelectBankAccount = (e) => {
    const text = e.target.value
    // setSelecteCountry(text)
    console.log('text', text)
    const data = {
        step: current,
        financial: {
          bankName:text,
          bankNumber:financialD.bankNumber,
          holder:financialD.holder
        }
        }
        dispatch(setFinancialDetails(data))
    if (text !== "") {
      setActiveSelect(true)
    } else {
      setActiveSelect(false)
    }
  }
  
  const handleBackStep = (e) => {
    e.preventDefault()
    const data = {
        step: current-1,
        document: [...docsList]
        }
     dispatch(setuploadDoc(data))
  }
    const handleNext = (e) => {
      e.preventDefault()
      const data = {
        step: current + 1,
        financial: {
          bankName:financialD.bankName,
          bankNumber:financialD.bankNumber,
          holder:financialD.holder
        }
        }
        dispatch(setFinancialDetails(data))
    }
  
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
          <Heading as="h4" style={{fontSize:'18px'}} fontSize="sm" color="#065BAA" textAlign={'center'}>Financial Details </Heading>
        </Box>
      </Box>
      <Box border="1px" borderColor={'#ebebeb'} borderTop={'none'}>
        <Box>
            <Box display={'flex'} justifyContent="center" flexDirection={'column'} alignItems="flex-start" m="1em">
            <Text as="b" fontSize="sm" color="#231F20"  fontFamily={'Mulish'} style={{fontSize:'18px'}}>Provide Banking Account</Text>
            <Text as="p" fontSize="sm" color="#231F20"  mt="2" mb="25px" fontFamily={'Mulish'} style={{ fontSize: '14px' }} pb="5px">Any funds payable as part of your claim will be paid into your bank account. Please provide details below.
             </Text>
          </Box>
          <Box width={{base:"100%",md:"465px"}} m="1em"> 
                <FormControl variant="floating" defaultValue={financialD?.bankName} isRequired fontFamily={'Mulish'} mt="14px" id="float-label"> 
                    <Box className='floating-form'>
                      <Box className='floating-label'>
                        <Select className="floating-select" placeholder='' h="48px" onChange={handleSelectBankAccount}>  
                          <option value=""></option>
                          <option value="BNI">BANK NASIONAL INDONESIA (BNI)</option>
                          <option value="BCA">BANK CENTAL ASIA (BCA)</option>
                          <option value="PERMATA">PERMATA</option>
                        </Select>
                        <span className="highlight"></span>
                        <FormLabel fontSize="12" pt="1.5" style={{ transform: isActiveSelect || financialD?.bankName !=="" ? "translate(0, -19px) scale(0.75)": "",color: isActiveSelect || financialD?.bankName !=="" ?"#065baa" :"", fontSize:"14px" }} fontFamily={'Mulish'}>Select Bank</FormLabel>
                       </Box>
                    </Box>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
                <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'} mt="14px"> 
                    <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={financialD?.bankNumber} onChange={handleBankNumber} h="48px" />
                    <FormLabel fontSize="12" pt="1.5" className={ isActiveNumber ? "Active" : ""}  fontFamily={'Mulish'} style={{fontSize:'14px'}}>Acount Number</FormLabel>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
                <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'} mt="14px"> 
                    <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={financialD?.holder} onChange={handleHolder} h="48px" />
                    <FormLabel fontSize="12" pt="1.5" className={ isActive ? "Active" : ""}  fontFamily={'Mulish'} style={{fontSize:'14px'}}>Acount Holder</FormLabel>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
       </Box>
       <Box bg="white" pt="1px" pb="60px" pl="6px">
          <Box bg="white" m={2} w={{base:"100%", md:"375px"}} borderTopRightRadius={'5px'} borderTopLeftRadius={'5px'} border="1px solid" borderColor={'#ebebeb'}>
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
      <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} p="9px" borderRadius={'5px'} border="1px" borderColor={'#ebebeb'}>
        <Button isDisabled={financialD?.bankName ==="" || financialD?.bankNumber ==="" || financialD?.holder ==="" ? true : false} variant={'ClaimBtn'} style={{textTransform:'uppercase',fontSize:'14px'}} fontFamily="arial" fontWeight={'700'} onClick={handleNext}>Review & Finalize</Button>
      </Box>
      </Box>
    </Stack>
  )
 }
export default StepForm7