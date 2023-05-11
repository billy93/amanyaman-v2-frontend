import React,{useState} from 'react'
import {
Box,
Stack,
Text,
Heading,
Button,
Image,
FormControl,
FormLabel,
Divider,
Textarea,
Center
} from '@chakra-ui/react'
import { useSelector } from "react-redux"
import {useDispatch} from 'react-redux'
import {selectCurrentStep,setFormStateLocation,selectedTimeLocation,setFormStateIncidentDesc,incidentDescription,selectClaimType } from '../createClaimSlice'
import { selectCurrentTraveller } from "../../../auth/authSlice"
import Umbrellaico from '../../../../img/Umbrella.png'
import Traveller from '../../../../img/traveller.png'
import Schedule from '../../../../img/Schedule.png'
import { ArrowBackIcon } from '@chakra-ui/icons'

const StepForm4 = () => {
  const dispatch = useDispatch()
  const descIncident = useSelector(incidentDescription)
  const selectClaim = useSelector(selectClaimType)
  const timeLocation = useSelector(selectedTimeLocation)
  const selectedTraveller = useSelector(selectCurrentTraveller)
  const current = useSelector(selectCurrentStep)
  const [isActive, setActive] = useState(false);


  const handleDesc = (e) => {
    const text = e.target.value
    const data = {
        step: current,
        incidentDesc:text
        }
        dispatch(setFormStateIncidentDesc(data))
    if (text !== "") {
      setActive(true)
    } else {
      setActive(false)
    }
  }

  function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  const formatter = new Intl.DateTimeFormat('en-us', {month: 'long'});

  return formatter.format(date);
  }

  
  const handleBackStep = (e) => {
    e.preventDefault()
    const data = {
        step: current-1,
        timeLocation
        }
     dispatch(setFormStateLocation(data))
  }
    const handleNext = (e) => {
      e.preventDefault()
      const data = {
        step: current + 1,
        incidentDesc:descIncident
        }
        dispatch(setFormStateIncidentDesc(data))
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
          <Heading as="h4" style={{fontSize:'18px'}} fontSize="sm" color="#065BAA" textAlign={'center'}> Describe Incident </Heading>
        </Box>
      </Box>
      <Box border="1px" borderColor={'#ebebeb'} borderTop={'none'} pt="10px" pl="16px" >
          <Box w={{base:"100%", md:"365px"}} pb="20px">
          <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'} mt="14px"> 
            <Textarea placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={descIncident} onChange={handleDesc} h="48px" />
            <FormLabel fontSize="12" pt="1.5" className={ isActive ? "Active" : ""}  fontFamily={'Mulish'} style={{fontSize:'14px'}}>Incident Describe</FormLabel>
            {/* It is important that the Label comes after the Control due to css selectors */}
          </FormControl>
        </Box>
        <Box display={'flex'} justifyContent="center" flexDirection={'column'} alignItems="flex-start">
            <Text as="b" fontSize="sm" color="#231F20"  fontFamily={'Mulish'} style={{fontSize:'18px'}}>How did it happen ? </Text>
            <Text as="p" fontSize="sm" color="#231F20"  mt="2" mb="25px" fontFamily={'Mulish'} style={{ fontSize: '14px' }} pb="5px">Describe the incident & the subsequent diagnosis as specific as you can. </Text>
          </Box>
       <Box bg="white" pt="20px" pb="60px" pl="2px">
          <Box bg="white" w={{base:"100%", md:"365px"}} borderTopRightRadius={'5px'} borderTopLeftRadius={'5px'} border="1px solid" borderColor={'#ebebeb'}>
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
                  <Text as="p" fontSize={'sm'} style={{ fontSize: "16px" }} fontFamily="Mulish" lineHeight={'15px'}>{selectClaim}</Text>
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
              <Center>
                <Divider  width={'95%'}/>
              </Center>
              <Box display="flex" justifyContent={'flex-start'} alignItems={'center'} p={3}>
                <Image src={Schedule} alt="cover insurance" />
                <Box display="flex" justifyContent={'flex-start'} flexDirection={'column'} p={1}>
                  <Heading variant="custom" size="sm" pb="1px">
                    Date & Location
                  </Heading>
                  <Text as="p" fontSize={'sm'} style={{ fontSize: "16px" }} fontFamily="Mulish" lineHeight={'15px'}>{timeLocation?.expirationDate?.day}{' '}{getMonthName(timeLocation?.expirationDate?.month)}{' '}{timeLocation?.expirationDate?.year}{',in '}<span> </span>{ ' '}{ timeLocation?.country}</Text>
                </Box>
              </Box>
            </Box>
          </Box>
       </Box>
       </Box>
      <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} p="9px" borderRadius={'5px'} border="1px" borderColor={'#ebebeb'}>
        <Button isDisabled={descIncident === "" ? true : false} variant={'ClaimBtn'} style={{textTransform:'uppercase',fontSize:'14px'}} fontFamily="arial" fontWeight={'700'} onClick={handleNext}>Describe Incident</Button>
      </Box>
    </Stack>
  )
 }
export default StepForm4