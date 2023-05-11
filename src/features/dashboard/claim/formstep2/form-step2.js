import React from 'react'
import {
Box,
Stack,
Text,
Heading,
RadioGroup,
Radio,
Button,
Image
} from '@chakra-ui/react'
import { useSelector } from "react-redux"
import {useDispatch} from 'react-redux'
import {selectClaimType, setFormState,selectCurrentStep,setFormStateTraveller,selectedTraveller } from '../createClaimSlice'
import { selectCurrentTraveller } from "../../../auth/authSlice"
import Umbrellaico from '../../../../img/Umbrella.png'
import { ArrowBackIcon } from '@chakra-ui/icons'

const StepForm2 = () => {
  const dispatch = useDispatch()
  const traveller = useSelector(selectCurrentTraveller)
  const selectTraveller = useSelector(selectedTraveller)
  const selected = useSelector(selectClaimType)
  const current = useSelector(selectCurrentStep)

  const onSelectTraveller = (selectTraveller) => {
    // setSelectTraveller(e)
    const data = {
        step: current,
        selectTraveller
        }
     dispatch(setFormStateTraveller(data))
  }
  
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
        // console.log('current step', currentstep)
        // e.preventDefault();
      const data = {
        step: current + 1,
        selectTraveller
        }
        dispatch(setFormStateTraveller(data))
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
          <Heading as="h4" style={{fontSize:'18px'}} fontSize="sm" color="#065BAA" textAlign={'center'}>Select Traveller </Heading>
        </Box>
      </Box>
      <Box >
        <Box p="1em" display={'flex'} flexDirection={'column'} border="1px" borderColor={'#ebebeb'} borderTop={'none'}>
          <Box display={'flex'} justifyContent="center" flexDirection={'column'} alignItems="flex-start">
            <Text as="b" fontSize="sm" color="#231F20"  fontFamily={'Mulish'} style={{fontSize:'18px'}}>Who was involved ? </Text>
            <Text as="p" fontSize="sm" color="#231F20"  mt="2" mb="25px" fontFamily={'Mulish'} style={{ fontSize: '14px' }} pb="5px">Select traveller listed in policy number for this claim. </Text>
          </Box>
          <RadioGroup onChange={onSelectTraveller} value={selectTraveller}>
            <Stack direction='row'>
              <Radio value={traveller}>Mr. {traveller }</Radio>
            </Stack>
          </RadioGroup>
          <Box bg="white" h="128px" m={2} w="340px" borderTopRightRadius={'5px'} borderTopLeftRadius={'5px'} border="1px solid" borderColor={'#ebebeb'}>
            <Box bg="#F0F3F8" p="10px" borderTopRightRadius={'5px'} borderTopLeftRadius={'5px'}>
              <Heading size={'sm'} variant="custom">Summary</Heading>
            </Box>
            <Box display="flex" justifyContent={'center'} alignItems={'center'} p={3}>
              <Image src={Umbrellaico} alt="cover insurance" />
              <Box display="flex" justifyContent={'flex-start'} flexDirection={'column'} p={1}>
                <Heading variant="custom" size="sm" pb="5px">
                  Selected Claim
                </Heading>
                <Text as="p" fontSize={'sm'} style={{ fontSize: "16px" }} fontFamily="Mulish" lineHeight={'15px'}>{ selected}</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} p="9px" borderRadius={'5px'} border="1px" borderColor={'#ebebeb'}>
       <Box display={'flex'} justifyContent={'flex-start'}>
          <Text as="p" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"14px"}}>
            Traveller Selected :
          </Text>
          <Text as="b" size={'sm'}fontFamily={'Mulish'} style={{fontSize:"14px"}}>
              {selectTraveller ? `Mr. ${selectTraveller}` : ""}
          </Text>
        </Box>
        <Button isDisabled={selectTraveller ==="" ? true : false} variant={'ClaimBtn'} style={{textTransform:'uppercase',fontSize:'14px'}} fontFamily="arial" fontWeight={'700'} onClick={handleNext}>provide
          time & location</Button>
      </Box>
      </Box>
    </Stack>
  )
 }
export default StepForm2