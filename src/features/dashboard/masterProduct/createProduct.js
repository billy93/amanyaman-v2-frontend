import React, { useState } from 'react'
import { NavLink,Navigate, useNavigate } from "react-router-dom";
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
useToast,
InputGroup,
InputRightElement,
Select,
Divider,
Textarea,
Center,
Breadcrumb,
BreadcrumbItem,
BreadcrumbLink,
} from '@chakra-ui/react'
import { useSelector } from "react-redux"
import {useDispatch} from 'react-redux'
import {selectClaimType, setFormState,selectCurrentStep,setFormStateLocation,selectedTimeLocation } from '../claim/createClaimSlice'
import { selectCurrentTraveller } from "../../auth/authSlice"
import {setMasterProduct,listProduct} from './masterProductSlice'
import Umbrellaico from '../../../img/Umbrella.png'
import Traveller from '../../../img/traveller.png'
import { ArrowBackIcon } from '@chakra-ui/icons'
import {SlCalender} from 'react-icons/sl'
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import { differenceInCalendarDays } from 'date-fns';
import { ChevronRightIcon } from '@chakra-ui/icons'
import { MdAdd } from 'react-icons/md'

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
const CreateProduct = () => {
  const dispatch = useDispatch()
  const locationData = useSelector(selectedTimeLocation)
  const selected = useSelector(selectClaimType)
  const listProducts = useSelector(listProduct)
  const selectedTraveller = useSelector(selectCurrentTraveller)
  const current = useSelector(selectCurrentStep)
  const [isActive, setActive] = useState(false);
  const [isActiveDescLoc, setActiveDescLoc] = useState(false);
  const [isActiveSelectCountry, setActiveSelectCountry] = useState(false);
  const hiddenInputIdtty = React.useRef(null)
  const navigate = useNavigate()
  const [fields, setFields] = React.useState(null)
  const toast = useToast()
const handleUploadIdentity = (e) => {
      hiddenInputIdtty.current.click()
}
const handleidentityCard = (e, i) => {
    e.preventDefault()
    if (e.target.files) {
      const data = {
        step: current,
        // document: [ ...uploadDoc, {label:i,file:e.target.files[0]}]
      }
    //   dispatch(setuploadDoc(data))
    }
};
    
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
      dispatch(setMasterProduct([...listProducts, fields]))
      toast({
                  title: `Created Product Success`,
                  status:"success",
                  position: 'top-right',
                  duration:3000,
                  isClosable: true,
                  variant:"solid",
      })
      setFields(null)
      navigate('/master-data/master-products')
    }
  
  const handleData = (e) => {
    console.log('e', { [e.target.name]: e.target.value })
     let idx = listProducts?.length
    setFields({
      ...fields,
      id:idx+1,
      [e.target.name]: e.target.value 
    })
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
  console.log('fields', fields)
  return (
    <Stack mt={{base:"1em", md:"5em"}}>
      <Box p="12px" display="flex" justifyContent={'space-between'} alignItems="center">
        <Box as='button' onClick={handleBackStep} display="flex"textAlign="left" >
         <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
                    <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink as={NavLink} to='/master-data/master-products'>
                                <Text as="b" ml="4" fontSize="sm" color="#065BAA"  _hover={{
                                    borderBottom: "#065BAA",
                                    border:"1 px solid"
                                }}>
                                    Product
                                </Text>
                            </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <BreadcrumbLink as={NavLink} to='#' style={{ pointerEvents: 'none'}}>
                            <Text as={'b'} fontSize={'sm'} color="#231F20"
                           >
                              Create Product
                            </Text>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    </Breadcrumb>
        </Box>
      </Box>
      <Box border="1px" borderColor={'#ebebeb'} borderTop={'none'}>
        <Box>
          <Box width={{base:"100%",md:"540px"}} m="auto"> 
            <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'} mt="14px"> 
                    <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={fields?.productCode} name="productCode" onChange={handleData} h="48px" />
                    <FormLabel fontSize="12" pt="1.5" className={ isActive ? "Active" : ""}  fontFamily={'Mulish'} style={{fontSize:'14px'}}>Product Code</FormLabel>
                    {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
         </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto"> 
            <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'} mt="14px"> 
                    <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={fields?.productName} name="productName" onChange={handleData} h="48px" />
                    <FormLabel fontSize="12" pt="1.5" className={ isActive ? "Active" : ""}  fontFamily={'Mulish'} style={{fontSize:'14px'}}>Product Name</FormLabel>
                    {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
         </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto"> 
            <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'} mt="14px"> 
                    <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={fields?.currency} name="currency" onChange={handleData} h="48px" />
                    <FormLabel fontSize="12" pt="1.5" className={ isActive ? "Active" : ""}  fontFamily={'Mulish'} style={{fontSize:'14px'}}>Currency</FormLabel>
                    {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
         </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto"> 
            <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'} mt="14px"> 
                    <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={fields?.productDetailCode} name="productDetailCode" onChange={handleData} h="48px" />
                    <FormLabel fontSize="12" pt="1.5" className={ isActive ? "Active" : ""}  fontFamily={'Mulish'} style={{fontSize:'14px'}}>Product Detail Code</FormLabel>
                    {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
         </Box>
         <Box width={{base:"100%",md:"540px"}} m="auto">
             <FormControl variant="floating" isRequired fontFamily={'Mulish'} mt="14px" id="float-label"> 
                    <Box className='floating-form'>
                      <Box className='floating-label'>
                        <Select className="floating-select" placeholder='' value={fields?.additionalWeek} name="additionalWeek" h="48px" onChange={handleData}>  
                          <option value="">Additional Week</option>
                          <option value="1week">1 Week</option>
                          <option value="2week">2 Week</option>
                        </Select>
                        <span className="highlight"></span>
                        <FormLabel fontSize="12" pt="1.5" style={{ transform: fields?.additionalWeek ? "translate(0, -19px) scale(0.75)": "",color: fields?.additionalWeek ?"#065baa" :"", fontSize:"14px" }} fontFamily={'Mulish'}>Additional Week</FormLabel>
                       </Box>
                    </Box>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
         </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto"> 
            <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'} mt="14px"> 
                    <Textarea placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={fields?.productDescription} name="productDescription" onChange={handleData} h="48px" />
                    <FormLabel fontSize="12" pt="1.5" className={ isActiveDescLoc ? "Active" : ""}  fontFamily={'Mulish'} style={{fontSize:'14px'}}>Description</FormLabel>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
         </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto"> 
            <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'} mt="14px"> 
                    <Textarea placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="personalAccidentCover" value={fields?.personalAccidentCover} onChange={handleData} h="48px" />
                    <FormLabel fontSize="12" pt="1.5" className={ isActiveDescLoc ? "Active" : ""}  fontFamily={'Mulish'} style={{fontSize:'14px'}}>Personal Accident Cover</FormLabel>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
         </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto"> 
            <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'} mt="14px"> 
                    <Textarea placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={fields?.medicalCover} name="medicalCover" onChange={handleData} h="48px" />
                    <FormLabel fontSize="12" pt="1.5" className={ isActiveDescLoc ? "Active" : ""}  fontFamily={'Mulish'} style={{fontSize:'14px'}}>Product Medical Cover</FormLabel>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
         </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto"> 
            <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'} mt="14px"> 
                    <Textarea placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={fields?.travelCover} name="travelCover" onChange={handleData} h="48px" />
                    <FormLabel fontSize="12" pt="1.5" className={ isActiveDescLoc ? "Active" : ""}  fontFamily={'Mulish'} style={{fontSize:'14px'}}>Product Travel Cover</FormLabel>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
         </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">
            <FormControl variant="floating" fontFamily={'Mulish'} id="float-label" mt="30px"> 
                <Button bg="white" variant={'base'} w={{base:"100%", md:"363px"}} onClick={handleUploadIdentity} h="48px" border={'2px'} borderStyle={'dashed'} borderColor={'#ebebeb'}>
                  <MdAdd size={'1em'} color="#065BAA"/> Upload your file
                </Button>
                    <Input type="file" name={"identityCard"} onChange={(e) =>handleidentityCard(e,'File Identity')} style={{ display: "none" }} ref={hiddenInputIdtty}  />
                <FormLabel fontSize="14" pt="1.5" style={{ transform:  "translate(-12px, -37px) scale(0.75)",color: "#231F20" , fontSize:"20px", fontWeight:"bold" }} fontFamily={'Mulish'}>Create Product</FormLabel>
                <Text as="p" fontSize={'sm'} fontFamily={'Mulish'} style={{fontSize:'12px'}}></Text>
                {/* <Button onClick={handleUploadClick}>Upload</Button> */}
              </FormControl>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">
             <FormControl variant="floating" isRequired fontFamily={'Mulish'} mt="14px" id="float-label"> 
                    <Box className='floating-form'>
                      <Box className='floating-label'>
                        <Select className="floating-select" placeholder='' value={fields?.productType} name="productType" h="48px" onChange={handleData}>  
                          <option value="">Product Type</option>
                          <option value="product1">Product Type1</option>
                          <option value="product2">Product Type2</option>
                        </Select>
                        <span className="highlight"></span>
                        <FormLabel fontSize="12" pt="1.5" style={{ transform: fields?.productType ? "translate(0, -19px) scale(0.75)": "",color: fields?.productType ?"#065baa" :"", fontSize:"14px" }} fontFamily={'Mulish'}>Product Type</FormLabel>
                       </Box>
                    </Box>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
         </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">
             <FormControl variant="floating" isRequired fontFamily={'Mulish'} mt="14px" id="float-label"> 
                    <Box className='floating-form'>
                      <Box className='floating-label'>
                        <Select className="floating-select" placeholder='' value={fields?.groupArea} name="groupArea" h="48px" onChange={handleData}>  
                          <option value="">Area Group</option>
                          <option value="group1">Group Area1</option>
                          <option value="group2">Group Area2</option>
                        </Select>
                        <span className="highlight"></span>
                        <FormLabel fontSize="12" pt="1.5" style={{ transform: fields?.groupArea ? "translate(0, -19px) scale(0.75)": "",color: fields?.groupArea ?"#065baa" :"", fontSize:"14px" }} fontFamily={'Mulish'}>Area Group</FormLabel>
                       </Box>
                    </Box>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
         </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">
             <FormControl variant="floating" isRequired fontFamily={'Mulish'}  mt="14px" id="float-label"> 
                    <Box className='floating-form'>
                      <Box className='floating-label'>
                        <Select className="floating-select" placeholder='' name="travelDuration" value={fields?.travelDuration} h="48px" onChange={handleData}>  
                          <option value="">Travel Duration</option>
                          <option value="1-5">1-5 days</option>
                          <option value="6-8">6-8 days</option>
                          <option value="9-12">9-12 days</option>
                        </Select>
                        <span className="highlight"></span>
                        <FormLabel fontSize="12" pt="1.5" style={{ transform: fields?.travelDuration? "translate(0, -19px) scale(0.75)": "",color: fields?.travelDuration ?"#065baa" :"", fontSize:"14px" }} fontFamily={'Mulish'}>Travel Duration</FormLabel>
                       </Box>
                    </Box>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
         </Box>
       </Box>
      <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} p="9px" borderRadius={'5px'} border="1px" borderColor={'#ebebeb'}>
          <Button isDisabled={!fields?.productCode || !fields?.productName || !fields?.productDetailCode || !fields?.productDescription
          || !fields?.medicalCover || !fields?.travelCover || !fields?.productType 
            ? true : false} variant={'ClaimBtn'} style={{ textTransform: 'uppercase', fontSize: '14px' }} fontFamily="arial" fontWeight={'700'} onClick={handleNext}>Describe Incident</Button>
      </Box>
      </Box>
    </Stack>
  )
 }
export default CreateProduct