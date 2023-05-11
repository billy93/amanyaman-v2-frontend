import React, { useState } from 'react'
import {
Box,
Stack,
Text,
Heading,
RadioGroup,
Radio,
Button,
Image,
Center,
Divider
} from '@chakra-ui/react'
import { useSelector } from "react-redux"
import {useDispatch} from 'react-redux'
import {selectClaimType, setFormState,selectCurrentStep,setFormStateTraveller,selectedTraveller,setFormStateExpenses,expenses, defaultForm } from '../createClaimSlice'
import { selectCurrentTraveller } from "../../../auth/authSlice"
import Umbrellaico from '../../../../img/Umbrella.png'
import { ArrowBackIcon } from '@chakra-ui/icons'
import ProvideFormComponent from './generateForm'
import Traveller from '../../../../img/traveller.png'
import { fields } from "./data";
import { getInputs } from './getInputs'

const StepForm5 = () => {
  const dispatch = useDispatch()
  const expensesState = useSelector(expenses)
  const form = useSelector(defaultForm)
  const selectTraveller = useSelector(selectedTraveller)
  const selected = useSelector(selectClaimType)
  const current = useSelector(selectCurrentStep)
  const [collectValue, setCollectVallu] = useState([])
  
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
        expensesData:collectValue
        }
        dispatch(setFormStateExpenses(data))
    }
  console.log('exp', selectTraveller)
  console.log('colle', collectValue)
  const getFormValue = (data) =>{
    setCollectVallu(data)
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
          <Heading as="h4" style={{fontSize:'18px'}} fontSize="sm" color="#065BAA" textAlign={'center'}>Provide Expenses </Heading>
        </Box>
      </Box>
      <Box >
        <Box p="1em" display={'flex'} flexDirection={'column'} border="1px" borderColor={'#ebebeb'} borderTop={'none'}>
          <Box display={'flex'} justifyContent="center" flexDirection={'column'} alignItems="flex-start">
            <Text as="b" fontSize="sm" color="#231F20"  fontFamily={'Mulish'} style={{fontSize:'18px'}}>Submit your receipts </Text>
            <Text as="p" fontSize="sm" color="#231F20"  mt="2" mb="25px" fontFamily={'Mulish'} style={{ fontSize: '14px' }} pb="5px">Specify each bill/receipt that details the services you have received in your trip. If your claim doesn’t have any receipts, skip this step. </Text>
          </Box>
          <form>  
            <ProvideFormComponent
              getFormValue={getFormValue}
              expensesState={expensesState}
          />
          </form>
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
                    <Text as="p" fontSize={'sm'} style={{ fontSize: "16px" }} fontFamily="Mulish" lineHeight={'15px'}>{ 'Mr. '}{ selectTraveller}</Text>
                </Box>
              </Box>
            </Box>
          </Box>
       </Box>
        </Box>
      <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} p="9px" borderRadius={'5px'} border="1px" borderColor={'#ebebeb'}>
        <Button isDisabled={selectTraveller ==="" ? true : false} variant={'ClaimBtn'} style={{textTransform:'uppercase',fontSize:'14px'}} fontFamily="arial" fontWeight={'700'} onClick={handleNext}>provide
          time & location</Button>
      </Box>
      </Box>
    </Stack>
  )
 }
export default StepForm5