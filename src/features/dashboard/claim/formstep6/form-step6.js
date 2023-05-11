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
Divider,
Input,
FormLabel,
FormControl,
IconButton
} from '@chakra-ui/react'
import { useSelector } from "react-redux"
import {useDispatch} from 'react-redux'
import {selectClaimType, setFormState,selectCurrentStep,setFormStateTraveller,selectedTraveller,setFormStateExpenses,expenses, defaultForm,listDoc,setuploadDoc } from '../createClaimSlice'
import { selectCurrentTraveller } from "../../../auth/authSlice"
import Umbrellaico from '../../../../img/Umbrella.png'
import { ArrowBackIcon } from '@chakra-ui/icons'
// import ProvideFormComponent from './generateForm'
import Traveller from '../../../../img/traveller.png'
import { MdAdd } from 'react-icons/md'

const StepForm6 = () => {
  const dispatch = useDispatch()
  const expensesState = useSelector(expenses)
  const form = useSelector(defaultForm)
  const selectTraveller = useSelector(selectedTraveller)
  const selected = useSelector(selectClaimType)
  const current = useSelector(selectCurrentStep)
  const expensesData = useSelector(expenses)
  const uploadDoc = useSelector(listDoc)
  const hiddenInput = React.useRef(null)
  const hiddenInputIdtty = React.useRef(null)
  const hiddenInputKitas = React.useRef(null)
  const hiddenInputPasport = React.useRef(null)
  const hiddenInputBoarding = React.useRef(null)
  const hiddenInputC = React.useRef(null)
  const hiddenInputPoliceStatement = React.useRef(null)
  const hiddenInputCCStatemen = React.useRef(null)
  const hiddenInputUnpaid = React.useRef(null)
  const [dfiles,setDFiles] = React.useState({policyCerificate:null,identityCard:null,kitas:"",pasport:"",creditCard:"",policeStatement:"",unpaidBilling:""})
  let desc
  const handleFileChange = (e, i) => {
    e.preventDefault()
    if (e.target.files) {
      const data = {
        step: current,
        document: [ ...uploadDoc, {label:i,file:e.target.files[0]}]
      }
      dispatch(setuploadDoc(data))
    }
  };
  const handleFileCC = (e, i) => {
    e.preventDefault()
    if (e.target.files) {
      const data = {
        step: current,
        document: [ ...uploadDoc, {label:i,file:e.target.files[0]}]
      }
      dispatch(setuploadDoc(data))
    }
  };
  
    const handleFileUnpaid = (e,i) => {
      e.stopPropagation()
      if (e.target.files) {   
        const data = {
          step: current,
          document: [ ...uploadDoc, {label:i,file:e.target.files[0]}]
        }
        dispatch(setuploadDoc(data))
      }
  };
  const handleFilePoliceStatement = (e, i) => {
    e.preventDefault()
    if (e.target.files) {
        const data = {
        step: current,
        document: [ ...uploadDoc, {label:i,file:e.target.files[0]}]
      }
      dispatch(setuploadDoc(data))
      }
  };
  const handleFileCCStatement = (e, i) => {
    e.preventDefault()
    if (e.target.files) {
        const data = {
        step: current,
        document: [ ...uploadDoc, {label:i,file:e.target.files[0]}]
      }
      dispatch(setuploadDoc(data))
      }
  };
    
  const handleFileBoardingPass = (e, i) => {
    e.preventDefault()
    if (e.target.files) {
        const data = {
        step: current,
        document: [ ...uploadDoc, {label:i,file:e.target.files[0]}]
      }
      dispatch(setuploadDoc(data))
      }
  };
    
  const handleidentityCard = (e, i) => {
    e.preventDefault()
    if (e.target.files) {
      const data = {
        step: current,
        document: [ ...uploadDoc, {label:i,file:e.target.files[0]}]
      }
      dispatch(setuploadDoc(data))
    }
  };
    
  const handleiKitas = (e, i) => {
    e.preventDefault()
    if (e.target.files) {
      const data = {
        step: current,
        document: [ ...uploadDoc, {label:i,file:e.target.files[0]}]
      }
      dispatch(setuploadDoc(data))
    }
  };
  const handlePasport = (e, i) => {
    e.preventDefault()
    if (e.target.files) {
      const data = {
        step: current,
        document: [ ...uploadDoc, {label:i,file:e.target.files[0]}]
      }
      dispatch(setuploadDoc(data))
    }
  };
    
    const handleUpload = (e) => {
      hiddenInput.current.click()
  }
    const handleUploadUnpaid = (e) => {
      e.preventDefault()
      hiddenInputUnpaid.current.click()
  }
    const handleUploadPoliceStatement = (e) => {
      hiddenInputPoliceStatement.current.click()
  }
    const handleUploadCCStatement = (e) => {
      hiddenInputCCStatemen.current.click()
  }
    const handleUploadCC = (e) => {
      hiddenInputC.current.click()
  }
    const handleUploadBoardingPass = (e) => {
      hiddenInputBoarding.current.click()
  }
    const handleUploadIdentity = (e) => {
      hiddenInputIdtty.current.click()
  }
    const handleUploadKitas = (e) => {
      hiddenInputKitas.current.click()
  }
    const handleUploadPasport = (e) => {
      hiddenInputPasport.current.click()
  }
  const handleBackStep = (e) => {
    e.preventDefault()
    const data = {
        step: current - 1,
        expensesData:expensesData
        }
        dispatch(setFormStateExpenses(data))
     dispatch(setFormState(data))
  }
    const handleNext = (e) => {
      e.preventDefault()
      const data = {
         step:current +1,
         document:uploadDoc
       }
        dispatch(setuploadDoc(data))
    }
  const getFileDisplay = (key) => {
    let filesD = null
    filesD = uploadDoc.find((item) => (
        item.label ===key 
    ))
    // console.log('ffff', filesD)
    return filesD !==undefined && filesD.file !== null ? `${filesD?.file?.name} ${filesD?.file?.type}` :""
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
          <Heading as="h4" style={{fontSize:'18px'}} fontSize="sm" color="#065BAA" textAlign={'center'}>Upload Documentation </Heading>
        </Box>
      </Box>
      <Box>
        <Box p="1em" display={'flex'} flexDirection={'column'} border="1px" borderColor={'#ebebeb'} borderTop={'none'}>
          <Box display={'flex'} justifyContent="center" flexDirection={'column'} alignItems="flex-start">
            <Text as="b" fontSize="sm" color="#231F20"  fontFamily={'Mulish'} style={{fontSize:'18px'}}>Prepare your documents </Text>
            <Text as="p" fontSize="sm" color="#231F20"  mt="2" mb="25px" fontFamily={'Mulish'} style={{ fontSize: '14px' }} pb="5px">Here are the information you will need to complete your claim. Upload at least 1 file to continue.
             </Text>
          </Box>
            <Box mt="25px" mb="10px" >
              <FormControl variant="floating" isRequired fontFamily={'Mulish'} id="float-label" mt="30px"> 
                <Button bg="white" variant={'base'} w={{base:"100%", md:"363px"}} onClick={handleUpload} h="48px" border={'2px'} borderStyle={'dashed'} borderColor={'#ebebeb'}>
                  <MdAdd size={'1em'} color="#065BAA"/> Upload your file
                </Button>
                    <Input type="file" name={"policyCertificate"} onChange={(e)=>handleFileChange(e,'Policy Certificate')} style={{ display: "none" }} ref={hiddenInput}  />
                <FormLabel fontSize="14" pt="1.5" style={{ transform:  "translate(-12px, -37px) scale(0.75)",color: "#231F20" , fontSize:"16px", fontWeight:"bold" }} fontFamily={'Mulish'}>Policy Certificate</FormLabel>
                <Text as="p" fontSize={'sm'} fontFamily={'Mulish'} style={{fontSize:'12px'}}>{getFileDisplay('Policy Certificate')}</Text>
                {/* <Button onClick={handleUploadClick}>Upload</Button> */}
              </FormControl>
              <FormControl variant="floating" fontFamily={'Mulish'} id="float-label" mt="30px"> 
                <Button bg="white" variant={'base'} w={{base:"100%", md:"363px"}} onClick={handleUploadIdentity} h="48px" border={'2px'} borderStyle={'dashed'} borderColor={'#ebebeb'}>
                  <MdAdd size={'1em'} color="#065BAA"/> Upload your file
                </Button>
                    <Input type="file" name={"identityCard"} onChange={(e) =>handleidentityCard(e,'File Identity')} style={{ display: "none" }} ref={hiddenInputIdtty}  />
                <FormLabel fontSize="14" pt="1.5" style={{ transform:  "translate(-12px, -37px) scale(0.75)",color: "#231F20" , fontSize:"16px", fontWeight:"bold" }} fontFamily={'Mulish'}>Identity Card</FormLabel>
                <Text as="p" fontSize={'sm'} fontFamily={'Mulish'} style={{fontSize:'12px'}}>{getFileDisplay('File Identity')}</Text>
                {/* <Button onClick={handleUploadClick}>Upload</Button> */}
              </FormControl>
              <FormControl variant="floating"  fontFamily={'Mulish'} id="float-label" mt="30px"> 
                <Button bg="white" variant={'base'} w={{base:"100%", md:"363px"}} onClick={handleUploadKitas} h="48px" border={'2px'} borderStyle={'dashed'} borderColor={'#ebebeb'}>
                  <MdAdd size={'1em'} color="#065BAA"/> Upload your file
                </Button>
                    <Input type="file" name={"kitas"} onChange={(e)=>handleiKitas(e,'Kitas')} style={{ display: "none" }} ref={hiddenInputKitas}  />
                <FormLabel fontSize="14" pt="1.5" style={{ transform:  "translate(-12px, -37px) scale(0.75)",color: "#231F20" , fontSize:"16px", fontWeight:"bold" }} fontFamily={'Mulish'}>KITAS</FormLabel>
                <Text as="p" fontSize={'sm'} fontFamily={'Mulish'} style={{fontSize:'12px'}}>{getFileDisplay('Kitas')}</Text>
                {/* <Button onClick={handleUploadClick}>Upload</Button> */}
              </FormControl>
              <FormControl variant="floating" fontFamily={'Mulish'} id="float-label" mt="30px"> 
                <Button bg="white" variant={'base'} w={{base:"100%", md:"363px"}} onClick={handleUploadPasport} h="48px" border={'2px'} borderStyle={'dashed'} borderColor={'#ebebeb'}>
                  <MdAdd size={'1em'} color="#065BAA"/> Upload your file
                </Button>
                    <Input type="file" name={"pasport"} onChange={(e)=>handlePasport(e,'Pasport')} style={{ display: "none" }} ref={hiddenInputPasport}  />
                <FormLabel fontSize="14" pt="1.5" style={{ transform:  "translate(-12px, -37px) scale(0.75)",color: "#231F20" , fontSize:"16px", fontWeight:"bold" }} fontFamily={'Mulish'}>Pasport</FormLabel>
                <Text as="p" fontSize={'sm'} fontFamily={'Mulish'} style={{fontSize:'12px'}}>{getFileDisplay('Pasport')}</Text>
                {/* <Button onClick={handleUploadClick}>Upload</Button> */}
              </FormControl>
              <FormControl variant="floating" fontFamily={'Mulish'} id="float-label" mt="30px"> 
                <Button bg="white" variant={'base'} w={{base:"100%", md:"363px"}} onClick={handleUploadBoardingPass} h="48px" border={'2px'} borderStyle={'dashed'} borderColor={'#ebebeb'}>
                  <MdAdd size={'1em'} color="#065BAA"/> Upload your file
                </Button>
                    <Input type="file" name={"boardingPass"} onChange={(e)=>handleFileBoardingPass(e,'Boarding Pass')} style={{ display: "none" }} ref={hiddenInputBoarding}  />
                <FormLabel fontSize="14" pt="1.5" style={{ transform:  "translate(-12px, -37px) scale(0.75)",color: "#231F20" , fontSize:"16px", fontWeight:"bold" }} fontFamily={'Mulish'}>Boarding Pass</FormLabel>
                <Text as="p" fontSize={'sm'} fontFamily={'Mulish'} style={{fontSize:'12px'}}>{getFileDisplay('Boarding Pass')}</Text>
                {/* <Button onClick={handleUploadClick}>Upload</Button> */}
              </FormControl>
              <FormControl variant="floating" fontFamily={'Mulish'} id="float-label" mt="30px"> 
                <Button bg="white" variant={'base'} w={{base:"100%", md:"363px"}} onClick={handleUploadCC} h="48px" border={'2px'} borderStyle={'dashed'} borderColor={'#ebebeb'}>
                  <MdAdd size={'1em'} color="#065BAA"/> Upload your file
                </Button>
                    <Input type="file" name={"creditCard"} onChange={(e)=>handleFileCC(e,'Credit Card')} style={{ display: "none" }} ref={hiddenInputC}  />
                <FormLabel fontSize="14" pt="1.5" style={{ transform:  "translate(-12px, -37px) scale(0.75)",color: "#231F20" , fontSize:"16px", fontWeight:"bold" }} fontFamily={'Mulish'}>Credit Card</FormLabel>
                <Text as="p" fontSize={'sm'} fontFamily={'Mulish'} style={{fontSize:'12px'}}>{getFileDisplay('Credit Card')}</Text>
                {/* <Button onClick={handleUploadClick}>Upload</Button> */}
              </FormControl>
              <FormControl variant="floating" fontFamily={'Mulish'} id="float-label" mt="30px"> 
                <Button bg="white" variant={'base'} w={{base:"100%", md:"363px"}} onClick={handleUploadCCStatement} h="48px" border={'2px'} borderStyle={'dashed'} borderColor={'#ebebeb'}>
                  <MdAdd size={'1em'} color="#065BAA"/> Upload your file
                </Button>
                    <Input type="file" name={"creditCardStatement"} onChange={(e)=>handleFileCCStatement(e,'Credit Card Statement')} style={{ display: "none" }} ref={hiddenInputCCStatemen}  />
                <FormLabel fontSize="14" pt="1.5" style={{ transform:  "translate(-12px, -37px) scale(0.75)",color: "#231F20" , fontSize:"16px", fontWeight:"bold" }} fontFamily={'Mulish'}>Credit Card’s Bank Statement</FormLabel>
                <Text as="p" fontSize={'sm'}fontFamily={'Mulish'} style={{fontSize:'12px'}}>{getFileDisplay('Credit Card Statement')}</Text>
                {/* <Button onClick={handleUploadClick}>Upload</Button> */}
              </FormControl>
              <FormControl variant="floating"  fontFamily={'Mulish'} id="float-label" mt="30px"> 
                <Button bg="white" variant={'base'} w={{base:"100%", md:"363px"}} onClick={handleUploadPoliceStatement} h="48px" border={'2px'} borderStyle={'dashed'} borderColor={'#ebebeb'}>
                  <MdAdd size={'1em'} color="#065BAA"/> Upload your file
                </Button>
                    <Input type="file" name={"policeStatement"} onChange={(e)=>handleFilePoliceStatement(e,'Police Statement')} style={{ display: "none" }} ref={hiddenInputPoliceStatement}  />
                <FormLabel fontSize="14" pt="1.5" style={{ transform:  "translate(-12px, -37px) scale(0.75)",color: "#231F20" , fontSize:"16px", fontWeight:"bold" }} fontFamily={'Mulish'}>Police/Hospital Statement</FormLabel>
                <Text as="p" fontSize={'sm'} fontFamily={'Mulish'} style={{fontSize:'12px'}}>{getFileDisplay('Police Statement')}</Text>
                {/* <Button onClick={handleUploadClick}>Upload</Button> */}
              </FormControl>
              <FormControl variant="floating" fontFamily={'Mulish'} id="float-label" mt="30px"> 
                <Button bg="white" variant={'base'} w={{base:"100%", md:"363px"}} onClick={handleUploadUnpaid} h="48px" border={'2px'} borderStyle={'dashed'} borderColor={'#ebebeb'}>
                  <MdAdd size={'1em'} color="#065BAA"/> Upload your file
                </Button>
                    <Input type="file" name={"unpaid"} onChange={(e)=>handleFileUnpaid(e,'Unpaid Statement')} style={{ display: "none" }} ref={hiddenInputUnpaid}  />
                <FormLabel fontSize="14" pt="1.5" style={{ transform:  "translate(-12px, -37px) scale(0.75)",color: "#231F20" , fontSize:"16px", fontWeight:"bold" }} fontFamily={'Mulish'}>Unpaid Billing Statement (Credit Card Protection only)</FormLabel>
                <Text as="p" fontSize={'sm'} fontFamily={'Mulish'} style={{fontSize:'12px'}}>{getFileDisplay('Unpaid Statement')}</Text>
                {/* <Button onClick={handleUploadClick}>Upload</Button> */}
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
                    <Text as="p" fontSize={'sm'} style={{ fontSize: "16px" }} fontFamily="Mulish" lineHeight={'15px'}>{ 'Mr. '}{ selectTraveller}</Text>
                </Box>
              </Box>
            </Box>
          </Box>
       </Box>
        </Box>
      <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} p="9px" borderRadius={'5px'} border="1px" borderColor={'#ebebeb'}>
        <Button variant={'ClaimBtn'} style={{textTransform:'uppercase',fontSize:'14px'}} fontFamily="arial" fontWeight={'700'} onClick={handleNext}>FILL IN FINANCIAL DETAILS</Button>
      </Box>
      </Box>
    </Stack>
  )
 }
export default StepForm6