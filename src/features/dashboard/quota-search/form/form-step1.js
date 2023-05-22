import React, { useState } from 'react'
import { useSelector,useDispatch} from 'react-redux'
import {selectManualInput,setFormStateCoverageType,setFormStateTravellerType,setFormStateTotalPass,setFormStateDestinationCountry,setFormStateStartDate,setFormEndDate} from '../quotaSearchSlice'
import { Flex,InputRightElement,InputGroup,Heading,Input,Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator, Box,Button, FormControl,FormLabel} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import { SlCalender } from 'react-icons/sl'

const Form1 = ({label,hasCompletedAllSteps,activeStep,reset,prevStep,nextStep,isLastStep}) => {
    const initState = useSelector(selectManualInput)
    const dispatch = useDispatch()
    const [isActive, setActive] = useState(false)
    const [isActives, setActives] = useState(false)
    // console.log('compre', hasCompletedAllSteps)
    // const [ManualInput, setManualInput] = React.useState({
    //    coverageType:"",
    //    travellerType:"",
    //    amount:"",
    //    destinationCountry:"",
    //    startDate:"",
    //    endDate:"",
    // })
    
    const handleTypeTrip = (type) => {
        dispatch(setFormStateCoverageType(type))
    }
    const handleTravellerType = (type) => {
        dispatch(setFormStateTravellerType(type))
    }
    const handleTotalPass = (e) => {
        let number  = e.target.value
        dispatch(setFormStateTotalPass(number))
    }
    function handleSelect(data) {
        // const data = data
        const d = data
        dispatch(setFormStateDestinationCountry({
            country: d
        }))
    }
    function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  const formatter = new Intl.DateTimeFormat('en-us', {month: 'long'});

  return formatter.format(date);
  }

  const formatInputValue = () => {
    if (!initState?.startDate) return '';
    return `${initState?.startDate?.day} ${getMonthName(initState?.startDate?.month)} ${initState?.startDate?.year}`;
  };
  const formatInputValues = () => {
    if (!initState?.endDate) return '';
    return `${initState?.endDate?.day} ${getMonthName(initState?.endDate?.month)} ${initState?.endDate?.year}`;
  };
    // console.log('manual cover', ManualInput)
    const renderCustomInput = ({ ref }) => (
    <>
    <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'}>
      <InputGroup id="float-labels">
        <Input readOnly ref={ref} placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={initState?.startDate ? `${initState?.startDate?.day} ${getMonthName(initState?.startDate?.month)} ${initState?.startDate?.year}` : ''} h="48px" />
        <InputRightElement children={<SlCalender color='green.500' />} />
         <FormLabel fontSize="12" pt="1.5" className={ isActive || initState?.startDate ? "Active" : ""} fontFamily={'Mulish'}>Start Date</FormLabel>
      </InputGroup>
         {/* It is important that the Label comes after the Control due to css selectors */}
    </FormControl>
    </>
    )
    const renderCustomInputs = ({ ref }) => (
    <>
    <FormControl variant="floating" id="first-name" isRequired  fontFamily={'Mulish'}>
      <InputGroup id="float-labels2">
        <Input readOnly ref={ref} placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={initState?.endDate ? `${initState?.endDate?.day} ${getMonthName(initState?.endDate?.month)} ${initState?.endDate?.year}` : ''} h="48px" />
        <InputRightElement children={<SlCalender color='green.500' />} />
         <FormLabel fontSize="12" pt="1.5" className={ isActives || initState?.endDate ? "Active" : ""} fontFamily={'Mulish'}>End Date</FormLabel>
      </InputGroup>
         {/* It is important that the Label comes after the Control due to css selectors */}
    </FormControl>
    </>
    )
    const selectDate = (date) => {
       
        dispatch(setFormStateStartDate({
            startDate: date
        }))
        if (date !== null) {
        //   setActive(true)
        } else {
        //   setActive(false)
        }
  }
    const selectEndDate = (date) => {
       
        dispatch(setFormEndDate({
            endDate: date
        }))
        if (date !== null) {
          setActives(true)
        } else {
          setActives(false)
        }
    }
    console.log('initState', initState)
    return (
        <Box border={'1px'} borderColor="#ebebeb" >
             <Box  border={'1px'} borderColor="#ebebeb" p="12px" display="flex" justifyContent={'space-between'} alignItems="center">
                    <Box position={'relative'} m="auto">
                    <Heading as="h4" style={{fontSize:'18px'}} fontSize="sm" color="#065BAA" textAlign={'center'}>Time & Location </Heading>
                    </Box>
            </Box>
            <Tabs position="relative" variant="unstyled" >
                    <TabList>
                    <Tab h={{base:"auto", md:"48px"}} width={{base:"100%", md:"251px"}}>Manual Input</Tab>
                    <Tab h={{base:"auto", md:"48px"}} width={{base:"100%", md:"251px"}}>Use Galileo PNR</Tab>
                    </TabList>
                    <TabIndicator
                        mt="-1.5px"
                        height="2px"
                        width={{base:"100%", md:"251px"}}
                        bg="blue.500"
                        borderRadius="1px"
                    />
                    <TabPanels>
                    <TabPanel mt="1em">
                        <Box position={'relative'} w={{ base: "100%" }}>
                            <ul className="slideshow">
                            <li>
                                <span className="img-bg-slide">Image 01</span>
                            </li>
                            <li>
                                <span className="img-bg-slide">Image 02</span>
                            </li>
                            </ul>
                            <Box position={'relative'} zIndex={'1'} w={{base:"100%", md:"566px"}} bg="white" top={{base:"0", md:"-48px"}} p="32px 20px"  boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}>
                                <Box mt="1em" display="flex" justifyContent="flext-start" width={{base:"100%", md:"530px"}} gap="4px">
                                <FormControl variant="floating" id="first-name" isRequired fontFamily={'Mulish'}>    
                                    <Button bg="#ebebeb" w={{base:"100%", md:"259px"}} border={initState?.coverageType ==="Single Trip" ? '2px solid #065BAA' : ''}
                                    h="48px" aria-label='Search database' color={ initState?.coverageType ==="Single Trip" ?  "#065BAA" : "#231F20"}
                                        _hover={{
                                        bg: "#ebebeb",
                                        }}
                                        onClick={() =>handleTypeTrip('Single Trip')}
                                    >Single Trip</Button>
                                    <FormLabel fontSize="12" pt="1.5" fontFamily={'Mulish'} style={{ transform: "translate(-12px, -40px) scale(0.75)", fontSize:"18px",zIndex:"0" }}>Select Coverage Type</FormLabel>
                                </FormControl>
                                <FormControl variant="floating" id="first-name" isRequired fontFamily={'Mulish'}>    
                                    <Button bg="#ebebeb" border={initState?.coverageType ==="Anual Trip" ? '2px solid #065BAA' : ''} w={{base:"100%", md:"259px"}} 
                                    h="48px" aria-label='Search database' color={ initState?.coverageType ==="Anual Trip" ? "#065BAA" : "#231F20"}
                                        _hover={{
                                        bg: "#ebebeb",
                                        }}
                                        onClick={() =>handleTypeTrip('Anual Trip')}
                                    >Anual Trip</Button>
                                    {/* <FormLabel fontSize="12" pt="1.5" fontFamily={'Mulish'} style={{ transform: "translate(-12px, -31px) scale(0.75)", fontSize:"14px" }}>Select Coverage Type</FormLabel> */}
                                </FormControl>
                            </Box>
                            <Box >
                                <FormControl variant="floating" id="first-name" isRequired fontFamily={'Mulish'}>
                                    <FormLabel fontSize="12" pt="1.5" fontFamily={'Mulish'} style={{ transform: "translate(-12px, -40px) scale(0.75)", fontSize:"18px",zIndex:"0" }}>Select Travellers Type</FormLabel>
                                </FormControl>
                                <Box display="flex" justifyContent="flext-start" width={{base:"100%", md:"530px"}} mt="3em" gap="4px">
                                {/* <Box>
                                    <label>Select Travellers Type</label>
                                </Box> */}
                                <FormControl variant="floating" id="first-name" isRequired fontFamily={'Mulish'} >    
                                    <Button bg="#ebebeb"  w={{base:"100%", md:"168px"}}
                                    h="48px" aria-label='Search database' border={initState?.travellerType ==="Individual" ? '2px solid #065BAA' : ''} color={ initState?.travellerType ==="Individual" ? "#065BAA" : "#231F20"}
                                        _hover={{
                                        bg: "#ebebeb",
                                        }}
                                    onClick={() =>handleTravellerType('Individual')}
                                    >Individual(s)</Button>
                                    {/* <FormLabel fontSize="12" pt="1.5" fontFamily={'Mulish'} style={{ transform: "translate(-12px, -31px) scale(0.75)", fontSize:"18px" }}>Select Travellers Type</FormLabel> */}
                                </FormControl>
                                <FormControl variant="floating" id="first-name" isRequired fontFamily={'Mulish'} >    
                                    <Button bg="#ebebeb" w={{base:"100%", md:"168px"}}
                                    h="48px" aria-label='Search database'
                                        _hover={{
                                        bg: "#ebebeb",
                                    }}
                                    border={initState?.travellerType ==="Group" ? '2px solid #065BAA' : ''} color={ initState?.travellerType ==="Group" ? "#065BAA" : "#231F20"}
                                    onClick={() =>handleTravellerType('Group')}
                                    >Group</Button>
                                    {/* <FormLabel fontSize="12" pt="1.5" fontFamily={'Mulish'} style={{ transform: "translate(-12px, -31px) scale(0.75)", fontSize:"14px" }}>Select Coverage Type</FormLabel> */}
                                </FormControl>
                                <FormControl variant="floating" id="first-name" isRequired fontFamily={'Mulish'} >    
                                    <Button bg="#ebebeb" w={{base:"100%", md:"168px"}}
                                    h="48px" aria-label='Search database' border={initState?.travellerType ==="Family" ? '2px solid #065BAA' : ''} color={ initState?.travellerType ==="Family" ? "#065BAA" : "#231F20"}
                                        _hover={{
                                        bg: "#ebebeb",
                                    }}
                                    onClick={() =>handleTravellerType('Family')}
                                    >Family</Button>
                                    {/* <FormLabel fontSize="12" pt="1.5" fontFamily={'Mulish'} style={{ transform: "translate(-12px, -31px) scale(0.75)", fontSize:"14px" }}>Select Coverage Type</FormLabel> */}
                                </FormControl>
                            </Box>
                            </Box>
                            <Box mt="1em" width={{base:"100%", md:"300px"}} position={'relative'}>
                                <FormControl variant="floating" fontFamily={'Mulish'} >    
                                    <Input type="number" w="100%" h="48px" value={initState?.totalPass } bg="#ebebeb" borderRadius="5px" onChange={ handleTotalPass} />
                                    <FormLabel fontSize="12" pt="1.5" fontFamily={'Mulish'} style={{ transform: "translate(16px, 2px) scale(0.75)", fontSize:"18px", background:"#ebebeb",color:"#171923",zIndex:"0" }} >Adult</FormLabel>
                                </FormControl>
                            </Box>
                            <Box mt="3em" w={{base:"100%", md:"520px"}} h={{sm:"48px"}}>
                                <FormControl variant="floating" fontFamily={'Mulish'} isRequired h="48px" >  
                                <Select
                                    size="lg"
                                    isMulti
                                    variant="outline"
                                    onChange={handleSelect}
                                    value={initState?.destinationCountry}
                                    isSearchable={true}
                                    styles={{
                                    menuPortal: (provided) => ({ ...provided})
                                    }}
                                    options={[
                                    {
                                        label: "Japanese",
                                        value: "Japanese",
                                        variant: "outline", // The option variant overrides the global
                                    },
                                    {
                                        label: "Korea",
                                        value: "Korea",
                                    },
                                    {
                                        label: "Singapore",
                                        value: "Singapore",
                                    },
                                    ]}
                                    />
                                    <FormLabel fontSize="12" pt="1.5" fontFamily={'Mulish'} style={{ transform: "translate(-12px, -40px) scale(0.75)", fontSize:"18px",color:"#171923",zIndex:"0" }}>Select Destination Country</FormLabel>
                                </FormControl>
                            </Box>
                            <Box mt="1em" position={'relative'} zIndex={'0'} display={'flex'} justifyContent={'flex-start'} alignItems={'center'} gap="4px" width={{base:"100%", md:"530px"}}>
                                <Box mt="1.5em" h="48px" width={{base:"100%",md:"250px"}}> 
                                <FormControl mt="10px" variant="floating" id="first-name" isRequired fontFamily={'Mulish'}>  
                                <FormLabel fontSize="12" pt="1.5" fontFamily={'Mulish'} style={{ transform: "translate(16px, 2px) scale(0.75)", fontSize:"18px", background:"#ebebeb",color:"#171923" }}>Start Date</FormLabel>
                                    <DatePicker
                                    width="100%"
                                    value={initState?.startDate}
                                    onChange={selectDate}
                                    inputPlaceholder="Select a date" // placeholder
                                    formatInputText={formatInputValue} 
                                    inputClassName="my-custom-inputs" // custom class
                                    renderInput={renderCustomInput} 
                                    wrapperClassName={'calendarClassName'}
                                    shouldHighlightWeekends
                                    />
                                    </FormControl>
                            </Box>
                                <Box width={{base:"100%",md:"250px"}} mt="1.5em" h="48px"> 
                                <FormControl mt="10px" variant="floating" id="first-name" isRequired fontFamily={'Mulish'}>  
                                <FormLabel fontSize="12" pt="1.5" fontFamily={'Mulish'} style={{ transform: "translate(16px, 2px) scale(0.75)", fontSize:"18px", background:"#ebebeb",color:"#171923" }}>End Date</FormLabel>
                                    <DatePicker
                                    value={initState?.endDate}
                                    onChange={selectEndDate}
                                    inputPlaceholder="Select a date" // placeholder
                                    formatInputText={formatInputValues} 
                                    inputClassName="my-custom-inputs" // custom class
                                    renderInput={renderCustomInputs} 
                                    shouldHighlightWeekends
                                    wrapperClassName={'calendarClassName'}
                                    />
                                    </FormControl>
                            </Box>
                                </Box>
                                {hasCompletedAllSteps !==undefined && (
                        <Box>
                        <Heading fontSize="xl" textAlign={"center"}>
                            Woohoo! All steps completed! 🎉
                        </Heading>
                        </Box>
                    )}
                    <Flex width="100%" justify="flex-start" gap={6} mt="2em">
                        {hasCompletedAllSteps !==undefined ? (
                       <></>
                        ) : (
                        <>
                            <Button
                            h="48px"
                            w={{base:"100%", md:"270px"}}
                            isDisabled={activeStep === 0}
                            onClick={prevStep}
                            size="md"
                            variant="ghost"
                            >
                            Prev
                            </Button>
                            <Button size="sm" onClick={nextStep} w={{base:"100%", md:"270px"}} h="48px"
                            isDisabled={initState?.coverageType ==='' || initState?.travellerType ==='' || initState?.destinationCountry?.length ===0 || initState?.startDate === null || initState?.endDate ===null ? true : false}
                                                >
                            {isLastStep ? "Finish" : "Continue"}
                            </Button>
                        </>
                        )}
                    </Flex>
                                    </Box>
                        </Box>
                    </TabPanel>
                    <TabPanel>
                        <p>two!</p>
                    </TabPanel>
                    </TabPanels>
                </Tabs>
        </Box>
    )
}
export default Form1