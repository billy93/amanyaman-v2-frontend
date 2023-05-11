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
Accordion,
AccordionItem,
AccordionButton,
AccordionPanel,
AccordionIcon,
IconButton,
Radio,
RadioGroup
} from '@chakra-ui/react'
import { useSelector } from "react-redux"
import {useDispatch} from 'react-redux'
import {selectClaimType, setFinancialDetails,setFormStateIncidentDesc,setFormState,setuploadDoc,selectCurrentStep,setFormStateLocation,selectedTimeLocation,expenses,incidentDescription,listDoc,financial,setFormStateTraveller,selectedTraveller } from '../createClaimSlice'
import { selectCurrentTraveller } from "../../../auth/authSlice"
import { ArrowBackIcon } from '@chakra-ui/icons'
import {MdCreate} from 'react-icons/md'

const StepForm8 = () => {
  const dispatch = useDispatch()
  const selectTraveller = useSelector(selectedTraveller)
  const locationData = useSelector(selectedTimeLocation)
  const selected = useSelector(selectClaimType)
  const expensesList = useSelector(expenses)
  const incidentDes = useSelector(incidentDescription)
  const listDocs = useSelector(listDoc)
  const selectedTravellers = useSelector(selectCurrentTraveller)
  const current = useSelector(selectCurrentStep)
  const financialDet = useSelector(financial)
  const [selectConfirm,setConfirm] = useState("1")
  const [toggleHide, setToggleHide] = useState(false);
  const [toggleHideDoc, setToggleHideDoc] = useState(false);
  const newArrayExpenses = expensesList.slice(0, 2);
  const newArrayDoc = listDocs.slice(0, 2);
//   const uploadDoc = useSelector(listDocs)
  const [buttonText, setButtonText] = useState("show more");
  const [buttonShowDoc, setButtonShowDoc] = useState("show more");
  
  function handleClick() {
    if (!toggleHide) {
      setButtonText("show less");
    } else {
      setButtonText("show more");
    }
    setToggleHide(!toggleHide);
  }
  function handleClickShow() {
    if (!toggleHideDoc) {
      setButtonShowDoc("show less");
    } else {
      setButtonShowDoc("show more");
    }
    setToggleHideDoc(!toggleHideDoc);
  }
    
  const handleBackStep = (e) => {
    e.preventDefault()
    const data = {
        step: current-1,
        financial: {
          bankName:financialDet.bankName,
          bankNumber:financialDet.bankNumber,
          holder:financialDet.holder
        }
        }
     dispatch(setFinancialDetails(data))
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
  
 function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  const formatter = new Intl.DateTimeFormat('en-us', {month: 'long'});

  return formatter.format(date);
 }
const onSelectClaim = (selected) => {
    const data = {
        step: current,
        selected
    }
    setConfirm(selected)
    // dispatch(setFormState(data))
  }
const handleEditClaimType = (e) =>{
    e.preventDefault();
    const data = {
        step: 1,
        selected
        }
    dispatch(setFormState(data))
}

const handleEditSelectTraveller = (e) => {
      e.preventDefault()
        // console.log('current step', currentstep)
        // e.preventDefault();
      const data = {
        step: 2,
        selectTraveller
        }
        dispatch(setFormStateTraveller(data))
}
    const handleEditDescIncident = (e) => {
      e.preventDefault()
      const data = {
        step: 4,
        incidentDesc:incidentDes
        }
        dispatch(setFormStateIncidentDesc(data))
    }
    const handleEditTimeLoc = (e) => {
      e.preventDefault()
      const data = {
        step: 3,
        timeLocation: {
          expirationDate:{...locationData?.expirationDate},
          time:locationData?.time,
          country:locationData?.country,
          descLocation:locationData?.descLocation
        }
        }
        dispatch(setFormStateLocation(data))
    }
    const handleEditDoc = (e) => {
      e.preventDefault()
      const data = {
         step:6,
         document:listDocs
       }
        dispatch(setuploadDoc(data))
    }
    
//   console.log('list doc', [listDocs])
  return (
    <Stack border={'1px'} borderColor="#ebebeb">
      <Box border={'1px'} borderColor="#ebebeb" p="12px" display="flex" justifyContent={'space-between'} alignItems="center">
        <Box as='button' onClick={handleBackStep} display="flex"textAlign="left" >
          <ArrowBackIcon boxSize={4} size="sm" w={5} h={5} color="#065BAA"/>           
          <Heading fontSize='sm' as="b" color="#065BAA" style={{fontSize:'16px'}} fontFamily="Mulish" fontWeight={'700'}>
            Back
          </Heading>
        </Box>
        <Box position={'relative'} m="auto">
          <Heading as="h4" style={{fontSize:'18px'}} fontSize="sm" color="#065BAA" textAlign={'center'}>Review & Finalize </Heading>
        </Box>
      </Box>
      <Box style={{marginLeft:"1em"}} mt="1em" border="1px" borderColor={'#ebebeb'} borderTop={'none'} borderBottom={'none'} w={{base:"100%", md:"465px"}}>
       <Accordion allowMultiple>
        <AccordionItem>
            <h2>
            <Box as="div">
                <AccordionButton>
                    <AccordionIcon />
                <Box as="span" flex='1' textAlign='left'>
                    <Text as="b" fontSize={'sm'}>
                    {'Selected Claim'}
                    </Text>
                </Box>
                <Box>
                 <IconButton bg="white" icon={<MdCreate size="1em" color="#3182ce"/>} onClick={handleEditClaimType}/>
                 </Box>
            </AccordionButton>
            </Box>
            </h2>
            <Box>     
            <AccordionPanel pb={4}>
                {selected}
            </AccordionPanel>
            </Box>
        </AccordionItem>
        <AccordionItem>
            <Box as="div" flex='1' textAlign='left' display={'flex'} justifyContent={'space-between'} alignItems={'center'} m={'14px'}>
             <Box m="1em">   
                <Text as="b" fontSize={'sm'}>
                {'Traveller'}
                </Text>
                <Text as="p" fontSize={'sm'}>
                     {selectTraveller}
                </Text>
             </Box>
             <Box>
                <IconButton bg="white" icon={<MdCreate size="1em" color="#3182ce" onClick={handleEditSelectTraveller}/>}/>
             </Box>
            </Box>
        </AccordionItem>
        <AccordionItem>
            <Box as="div" flex='1' textAlign='left' display={'flex'} justifyContent={'space-between'} alignItems={'center'} m={'14px'}>
             <Box m="1em">   
                <Text as="b" fontSize={'sm'}>
                {'Date & Location'}
                </Text>
                <Text as="p" fontSize={'sm'}>
                     {`${locationData?.expirationDate?.day} ${getMonthName(locationData?.expirationDate?.month)} ${locationData?.expirationDate?.year}`} {`, in ${locationData?.country}`}
                </Text>
             </Box>
             <Box>
                <IconButton bg="white" icon={<MdCreate size="1em" color="#3182ce"/>} onClick={handleEditTimeLoc}/>
             </Box>
            </Box>
        </AccordionItem>
        <AccordionItem>
            <h2>
            <Box as="div">
                <AccordionButton>
                    <AccordionIcon />
                <Box as="span" flex='1' textAlign='left'>
                    <Text as="b" fontSize={'sm'}>
                    {'Incident Detail'}
                    </Text>
                </Box>
                <Box>
                 <IconButton bg="white" icon={<MdCreate size="1em" color="#3182ce"/>} onClick={handleEditDescIncident}/>
                 </Box>
            </AccordionButton>
            </Box>
            </h2>
            <Box>     
            <AccordionPanel pb={4}>
                {incidentDes}
            </AccordionPanel>
            </Box>
        </AccordionItem>
        </Accordion> 
        <Accordion defaultIndex={[0]} allowMultiple>
            <AccordionItem index={[4]}>
            <h2>
            <Box as="div">
                <AccordionButton>
                    <AccordionIcon />
                <Box as="span" flex='1' textAlign='left'>
                    <Text as="b" fontSize={'sm'}>
                    {'Expenses'}
                    </Text>
                </Box>
                <Box>
                 <IconButton bg="white" icon={<MdCreate size="1em" color="#3182ce"/>}/>
                 </Box>
            </AccordionButton>
            </Box>
            </h2>
            <Box>
            <AccordionPanel pb={4}>
                              {!toggleHide ? 
                     newArrayExpenses.map((item, i) => {
                             return (
                             <Box key={i} display={'flex'} flexDirection={'column'} borderBottom="1px" borderColor={'#ebebeb'} pb="10px">
                                 <Text as="b" size="sm" style={{fontSize:'14px'}} fontFamily="Mulish" >{`Expenses ${i+1}`}</Text>
                                 <Text as="p" size="sm" style={{fontSize:'14px'}} fontFamily="Mulish" >{`${item.incidentDate}`}</Text>
                                 <Text as="p" size="sm" style={{fontSize:'14px'}} fontFamily="Mulish" >{` by ${item.provider}`}</Text>
                                 <Text as="p" size="sm" style={{fontSize:'14px'}} fontFamily="Mulish" >{`IDR ${item.amount}`}</Text>
                             </Box>
                         )
                     })
                                  : 
                     expensesList.map((item, i) => {
                            return (
                            <Box key={i} display={'flex'} flexDirection={'column'} borderBottom="1px" borderColor={'#ebebeb'} pb="10px">
                                <Text as="b" size="sm" style={{fontSize:'14px'}} fontFamily="Mulish" >{`Expenses ${i+1}`}</Text>
                                <Text as="p" size="sm" style={{fontSize:'14px'}} fontFamily="Mulish" >{`${item.incidentDate}`}</Text>
                                <Text as="p" size="sm" style={{fontSize:'14px'}} fontFamily="Mulish" >{` by ${item.provider}`}</Text>
                                <Text as="p" size="sm" style={{fontSize:'14px'}} fontFamily="Mulish" >{`IDR ${item.amount}`}</Text>
                            </Box>
                        )
                    })
                    }
                    {
                        expensesList.length > 2 &&
                         <Button variant="base" size={'xs'} onClick={() => handleClick()}>
                        <Text as="p" fontSize={'sm'} fontFamily={'Mulish'} style={{color:"#065baab5", fontSize:"14px"}}>
                            {buttonText}
                        </Text>
                    </Button>
                    }
                
            </AccordionPanel>
            </Box>
        </AccordionItem>
        </Accordion>
        <Accordion defaultIndex={[0]} allowMultiple>
            <AccordionItem>
            <h2>
            <Box as="div">
                <AccordionButton>
                    <AccordionIcon />
                <Box as="span" flex='1' textAlign='left'>
                    <Text as="b" fontSize={'sm'}>
                    {'Documentations'}
                    </Text>
                </Box>
                <Box>
                 <IconButton bg="white" icon={<MdCreate size="1em" color="#3182ce"/>} onClick={handleEditDoc}/>
                 </Box>
            </AccordionButton>
            </Box>
            </h2>
            <Box>
            <AccordionPanel pb={4}>
                {
                                  !toggleHideDoc ? 
                                      newArrayDoc.map((item, i) => {
                                           return item.file !== null && (
                                              <Box key={i} display={'flex'} flexDirection={'column'} borderBottom="1px" borderColor={'#ebebeb'} pb="10px" mb="10px">
                                                <Text as="b" size="sm" style={{fontSize:'14px'}} fontFamily="Mulish" >{`${item.label}`}</Text>
                                                <Text as="p" size="sm" style={{fontSize:'14px'}} fontFamily="Mulish" >{`${item.file?.name}`}</Text>
                                            </Box>
                                          )
                                    })
                                      : 
                                       listDocs.map((item, i) => {
                                           return item.file !== null && (
                                              <Box key={i} display={'flex'} flexDirection={'column'} borderBottom="1px" borderColor={'#ebebeb'} pb="10px" mb="10px">
                                                <Text as="b" size="sm" style={{fontSize:'14px'}} fontFamily="Mulish" >{`${item.label}`}</Text>
                                                <Text as="p" size="sm" style={{fontSize:'14px'}} fontFamily="Mulish" >{`${item.file?.name}`}</Text>
                                            </Box>
                                          )
                                    })
                              }
                              {
                                  listDocs.length >2 &&
                                    <Button variant={'base'} size={'xs'} onClick={() => handleClickShow()}>
                                        <Text as="p" fontSize={'sm'} fontFamily={'Mulish'} style={{color:"#065baab5", fontSize:"14px"}}>
                                            {buttonShowDoc}
                                        </Text>
                                    </Button>
                              }
            </AccordionPanel>
            </Box>
            <AccordionItem>
            <Box as="div" flex='1' textAlign='left' display={'flex'} justifyContent={'space-between'} alignItems={'center'} m={'14px'}>
             <Box m="1em">   
                <Text as="b" fontSize={'sm'}>
                {'Financial Details'}
                </Text>
                <Text as="p" fontSize={'sm'}>
                     {`${financialDet?.bankName} `}
                </Text>
                <Text as="p" fontSize={'sm'}>
                     {`${financialDet?.bankNumber} `}
                </Text>
                <Text as="p" fontSize={'sm'}>
                     {`${financialDet?.holder} `}
                </Text>
             </Box>
             <Box>
                <IconButton bg="white" icon={<MdCreate size="1em" color="#3182ce"/>} onClick={handleBackStep}/>
             </Box>
            </Box>
        </AccordionItem>
        </AccordionItem>
        </Accordion>
        <Box m="1em">
            <RadioGroup defaultValue={selectConfirm} onChange={onSelectClaim}>
             <Stack spacing={4} direction='column'>
                 <Radio value='1'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>I am the person making this claim.</Text></Radio>
                 <Radio value='2'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>I am completing the claim on behalf of the person making the claim.</Text></Radio>
             </Stack>
        </RadioGroup>
        </Box>
      </Box>
      <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} p="9px" borderRadius={'5px'} border="1px" borderColor={'#ebebeb'}>
        <Button isDisabled={locationData?.expirationDate ===null || locationData?.time ==="" || locationData?.country ==="" || locationData?.descLocation === "" ? true : false} variant={'ClaimBtn'} style={{textTransform:'uppercase',fontSize:'14px'}} fontFamily="arial" fontWeight={'700'} onClick={handleNext}>Submit Claim</Button>
      </Box>
    </Stack>
  )
 }
export default StepForm8