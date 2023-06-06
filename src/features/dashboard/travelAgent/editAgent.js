import React, { useState } from 'react'
import { NavLink,Navigate, useNavigate,Link as Links, useParams } from "react-router-dom";
import {
Box,
Stack,
Text,
Link,
Heading,
Button,
Image,
FormControl,
Input,
FormLabel,
useToast,
InputGroup,
InputRightElement,
Divider,
Textarea,
Center,
Breadcrumb,
BreadcrumbItem,
BreadcrumbLink,
RadioGroup,
Radio,
useRadioGroup,
UseRadioGroupReturn,
HStack,
useRadio
} from '@chakra-ui/react'
import { useSelector } from "react-redux"
import { useDispatch } from 'react-redux'
import {useCreateAgentMutation,useGetRoleQuery,useUpdateAgentMutation,useGetTravelAgentQuery,useGetCitiesQuery} from './travelApiSlice'
import {setListAgent,listAgent,formAgent,setFormAgent,listDetailAgent,setDetailAgent,setEditAgent,editAgentVal,setListCity,getlistcity} from './travelAgentSlice'
import { differenceInCalendarDays } from 'date-fns';
import { ChevronRightIcon } from '@chakra-ui/icons'
import { MdAdd } from 'react-icons/md'
import { Select } from 'chakra-react-select'

function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = React.useRef();
  // Store current value in ref
  React.useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
function CustomRadio(props) {
  const dispatch = useDispatch()
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const detail = useSelector(editAgentVal)
  const input = getInputProps();
  const checkbox = getCheckboxProps();
  const [a, setA] = React.useState(false);
  const handleSelect = React.useCallback(() => {
    if (props.isChecked && input.onChange) {
     /* eslint-disable */ 
      (input.onChange)("");
    }
    const formstate = {
          ...detail,
          allowCreditPayment: props.value
    }
    dispatch(setEditAgent(formstate));
  }, [input.onChange, props.isChecked]);
  
  return (
    <Box as="label">
      {/* <Radio defaultChecked={props.isChecked} /> */}
      <input
        {...input}
        type={input.type}
        onClick={handleSelect}
        onKeyUp={(e) => {
          if (e.key !== " ") return;
          if (props.isChecked) {
            e.preventDefault();
            handleSelect();
            setA(!a);
          }
        }}
      />
      <Box {...checkbox} _checked={{ color: "#231F20",fontsize:"14px", fontFamily:'Mulish' }} display={'flex'} alignItems={'center'}>
        <Box
          border="1px solid #ebebeb"
          pl="5px"
          bg="white"
          w={"15px"}
          h={"15px"}
          borderRadius="full"
          style={{ background: props.isChecked === true ? "#065BAA" : "white" }}
        ></Box>
        {props.children}
      </Box>
    </Box>
  );
}

const CreateUser = () => {
  const {id} = useParams()
  const dispatch = useDispatch()
  const listProducts = useSelector(listAgent)
  const detail = useSelector(editAgentVal)
  const formuser = useSelector(formAgent)
  const listCity = useSelector(getlistcity)
  const hiddenInputIdtty = React.useRef(null)
  const navigate = useNavigate()
  const [fields, setFields] = React.useState(null)
  const [trigger, setTrigger] = React.useState(false)
  const [selectFill, setSelectFille] = React.useState(false)
  const [isChek, setIsChek] = React.useState('allowCreditPayment')
  const list = ['allowCreditPayment'];
  
  React.useEffect(() => {
    if (detail?.allowCreditPayment ===false) {
        setIsChek(null)
    } else {
      setIsChek('allowCreditPayment')
    }
  }, [detail?.allowCreditPayment, isChek])
  
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "test",
    defaultValue:`${detail?.allowCreditPayment}`,
    onChange: console.log
  });

  const group = getRootProps();
  const { data:cities} = useGetCitiesQuery({page:0,size:999}, { refetchOnMountOrArgChange: true })
  const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTravelAgentQuery({count:5}, { refetchOnMountOrArgChange: true })
  const [createAgent,{isSuccess:successCreateAgent}] = useCreateAgentMutation({
   skip:trigger === false 
  })
  const [updateAgent] = useUpdateAgentMutation()
  const toast = useToast()
  React.useMemo(() => {
    if (cities) {
      let city = cities.map((obj) => ({ ...obj, 'label': obj.name }))
        dispatch(setListCity(city))
    }
  }, [cities])
  
React.useMemo(() => {
      const detail = users?.filter((user) => user.id === parseInt(id))
      // const detail = newDetail.map((agent)=>({...agent,'label':agent.name}))
    if (detail) {
        const datas = {
            id:detail !==null ? detail[0]?.id : null,    
            travelAgentName:detail !==null ? detail[0]?.travelAgentName : null,    
            travelAgentEmail:detail !==null ? detail[0]?.travelAgentEmail : null,    
            travelAgentAddress:detail !==null ? detail[0]?.travelAgentAddress : null,  
            commission:detail !==null ? detail[0]?.commission : null,
            paymentType:detail !==null ? detail[0]?.paymentType : null,
            travelAgentPhone:detail !==null ? detail[0]?.travelAgentPhone : null,  
            custcode:detail !==null ? detail[0]?.custcode : null,   
            apiPassword:detail !==null ? detail[0]?.apiPassword : null,   
            custid:detail !==null ? detail[0]?.custid : null,   
            cgroup:detail !==null ? detail[0]?.cgroup : null,   
            legalName:detail !==null ? detail[0]?.legalName : null,   
            proformaInvoiceRecipients:detail !==null ? detail[0]?.proformaInvoiceRecipients : null,   
            allowCreditPayment:detail !==null && detail[0]?.allowCreditPayment ===false ? '' :'allowCreditPayment' ,   
            city:detail !==null ? {...detail[0]?.city,'label':detail[0]?.city?.name} : null
        }
        dispatch(setEditAgent(datas))
        dispatch(setDetailAgent(datas))
      }
}, users, dispatch, id)
  
  const onSelectAllowCredit = (e) => {
    e.preventDefault()
    const cek = e.currentTarget.value === 'true' ? true: false;
    setIsChek(cek)
      const formstate = {
          ...formuser,
          allowCreditPayment: !formuser?.allowCreditPayment
    }
    dispatch(setFormAgent(formstate))
  }
  const handleUploadIdentity = (e) => {
        hiddenInputIdtty.current.click()
  }
    
const handleidentityCard = (e, i) => {
    e.preventDefault()
    if (e.target.files) {
     
    //   dispatch(setuploadDoc(data))
    }
};
    
  
    const handleNext = async (e) => {
      e.preventDefault()  
      const constData = {
        ...detail,
        allowCreditPayment:detail?.allowCreditPayment ==='allowCreditPayment' ? true : false
      }
      try {
        let data = await updateAgent(constData) 
        dispatch(setListAgent([...listProducts, constData]));
        if (successCreateAgent) {
          dispatch(setEditAgent(null))
        }
        toast({
                  title: `Edit Travel Agent Success`,
                  status:"success",
                  position: 'top-right',
                  duration:3000,
                  isClosable: true,
                  variant:"solid",
      })
        
      } catch (err) {
        toast({
                  title: `${err?.originalStatus}`,
                  status:"error",
                  position: 'top-right',
                  duration:3000,
                  isClosable: true,
                  variant:"solid",
      })
      }
      setFields(null)
      navigate('/master-data/travel-agent')
    }
  
  const handleData = (e) => {
    const forms = {
      ...detail,
      [e.target.name]: e.target.value 
    }
    dispatch(setEditAgent(forms))
  }

  const handleDataSelect = (e) => {
    const forms = {
      ...formuser,
      city: {
        id:e.target.value
      } 
    }
    dispatch(setFormAgent(forms))
  }

//   React.useEffect(() => {
//     if (JSON.stringify(prevListRoles) !== JSON.stringify(rolesData)) {
//       dispatch(setRoleUser(rolesData))
//     }
//   }, [rolesData, prevListRoles, dispatch])
    const handleRedirect = (on) => {
        // e.preventDefault()
        navigate('/master-data/travel-agent')
    }
  
  function handleSelect(data) {
        console.log('d', data)
         const forms = {
          ...detail,
          city: {
            ...data
          } 
        }
    dispatch(setEditAgent(forms))
  }
  console.log('', formuser?.allowCreditPayment)
  return (
    <Stack mt={{base:"1em", md:"5em"}}>
      <Box p="12px" display="flex" justifyContent={'space-between'} alignItems="center">
        <Box as='button' onClick={'handleBackStep'} display="flex"textAlign="left" >
         <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
                    <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink as={Links} to="/master-data/travel-agent">
                                <Text as="b" ml="4" fontSize="sm" color="#065BAA"  _hover={{
                                    borderBottom: "#065BAA",
                                    border:"1 px solid"
                                }}>
                                    Travel Agent
                                </Text>
                            </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <BreadcrumbLink as={Links} to='#' style={{ pointerEvents: 'none'}}>
                            <Text as={'b'} fontSize={'sm'} color="#231F20"
                           >
                            {
                              detail !==null ? 'Edit Agent' : 'Create Agent'
                            }  
                            </Text>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    </Breadcrumb>
        </Box>
      </Box>
      <Box border="1px" borderColor={'#ebebeb'} borderTop={'none'}>
        <Box>
            <Box width={{base:"100%",md:"540px"}} m="auto">
            <FormControl variant="floating" fontFamily={'Mulish'} id="float-label" mt="30px"> 
                <Box display={'flex'} pt="1em">
                    <Box >    
                        <Button bg="#ebebeb" borderRadius={'50%'} variant={'base'} w={{ md:"88px"}} h={{md:"88px"}} onClick={handleUploadIdentity} border={'2px'} borderStyle={'dashed'} borderColor={'#ebebeb'}>
                          <MdAdd size={'1em'} color="#065BAA"/> 
                        </Button>
                    </Box>
                    <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} alignItems={'flex-start'} pl="5px" pt="10px">
                        <Text as="b" size="sm" fontFamily={'Mulish'} style={{fontSize:'14px'}} color="#065BAA">Choose a file</Text>
                        <Text as="p" size="sm" fontFamily={'Mulish'} style={{fontSize:'12px'}}>Acceptable formats: jpeg & png only. Max. file size is 500kb and min. size 70kb</Text>
                    </Box>
                
                </Box>
                    <Input type="file" name={"identityCard"} onChange={(e) =>handleidentityCard(e,'File Identity')} style={{ display: "none" }} ref={hiddenInputIdtty}  />
              <FormLabel fontSize="14" pt="1.5" style={{ transform: "translate(-12px, -37px) scale(0.75)", color: "#231F20", fontSize: "20px", fontWeight: "bold" }} fontFamily={'Mulish'}>{ detail !==null  ? 'Edit Agent' :'Create Agent' }</FormLabel>
                <Text as="p" fontSize={'sm'} fontFamily={'Mulish'} style={{fontSize:'12px'}}></Text>
                {/* <Button onClick={handleUploadClick}>Upload</Button> */}
              </FormControl>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">      
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="travelAgentName" value={detail !==null ? detail?.travelAgentName : null } onChange={handleData} h="48px" variant="custom" />
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Travel Agent Name</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box display="flex" gap="5px" m="auto" width={{base:"100%",md:"540px"}}>
            <Box width={{base:"100%",md:"240px"}} >  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="travelAgentEmail" value={detail !==null ? detail?.travelAgentEmail : null} onChange={handleData} h="48px" variant="custom" />
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Travel Agent Email</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box width={{base:"100%",md:"240px"}} >  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="travelAgentAddress" value={detail !==null ? detail?.travelAgentAddress : null} onChange={handleData} h="48px" variant="custom" />
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">travel Agent Address</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          </Box>
          <Box display="flex" gap="5px" m="auto" width={{base:"100%",md:"540px"}}>
            <Box width={{base:"100%",md:"240px"}} >  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="commission" value={detail !==null ? detail?.commission : null} onChange={handleData} h="48px" variant="custom" />
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Commison</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box width={{base:"100%",md:"240px"}} >  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="paymentType" value={detail !==null ? detail?.paymentType : null} onChange={handleData} h="48px" variant="custom" />
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Payment type</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="travelAgentPhone" value={detail !==null ? detail?.travelAgentPhone : null} onChange={handleData} h="48px" variant="custom" />
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Travel Agent Phone</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="custcode" value={detail !==null ? detail?.custcode : null} onChange={handleData} h="48px" variant="custom" />
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Cust Code</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="apiPassword" value={detail !==null ? detail?.apiPassword : null} onChange={handleData} h="48px" variant="custom" />
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Api password</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="custid" value={detail !==null ? detail?.custid : null } onChange={handleData} h="48px" variant="custom" />
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Cust Id</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="cgroup" value={detail !==null ? detail?.cgroup : null} onChange={handleData} h="48px" variant="custom" />
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">CGroup</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="legalName" value={detail !==null ? detail?.legalName : null} onChange={handleData} h="48px" variant="custom" />
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Legal Name</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="proformaInvoiceRecipients" value={detail !==null ? detail?.proformaInvoiceRecipients : null} onChange={handleData} h="48px" variant="custom" />
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Proforma Invoice Recipients </FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto" mt="15px" >  
             <Stack spacing={4} direction='column'>
              {/* <RadioGroup defaultValue={`${detail?.allowCreditPayment}`} onChange={onSelectAllowCredit} >
                <Stack spacing={4} direction='row'>
                  <Radio value={detail?.allowCreditPayment ? 'true' : 'false'}>
                    Allow Credit Payment
                  </Radio>
                </Stack>
              </RadioGroup> */}
              {/* <input type='radio' name="allowCreditPayment" value={detail?.allowCreditPayment ===true ? 'true' : 'false'} checked={detail?.allowCreditPayment ===true ? 'true' : 'false'} onClick={(e) => onSelectAllowCredit(e)}/> */}
                 {/* <Radio onChange={onSelectAllowCredit} value={detail?.allowCreditPayment} isChecked={detail?.allowCreditPayment ===1 ? true : false} ><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Allow Credit Payment</Text></Radio> */}
            <HStack {...group}>
              {list.map((item) => (
                <CustomRadio key={item} {...getRadioProps({ value: item })}>
                  <Text as="p" fontsize="12px" style={{color: "#231F20",fontSize:"14px", fontFamily:'Mulish',paddingLeft:"5px" }}>
                  {item}
                  </Text>
                </CustomRadio>
              ))}
            </HStack>  
            </Stack>
          </Box>
         <Box width={{base:"100%",md:"540px"}} m="auto" mt="1em" mb="1em">
                                <FormControl variant="floating" fontFamily={'Mulish'} isRequired h="48px" >  
                                <Select
                                      isMulti={false}
                                      name="colors"
                                      onChange={handleSelect}
                                      value={detail?.city}
                                      isSearchable={false}
                                      classNamePrefix="chakra-react-select"
                                      options={listCity}
                                      placeholder="Select some colors..."
                                      closeMenuOnSelect={true}
                                      chakraStyles={{
                                        dropdownIndicator: (prev, { selectProps: { menuIsOpen } }) => ({
                                          ...prev,
                                          "> svg": {
                                            transitionDuration: "normal",
                                            transform: `rotate(${menuIsOpen ? -180 : 0}deg)`
                                          }
                                        })
                                      }}
                                    />
                                {/* <Select
                                    size="lg"
                                    isMulti={false}
                                    variant="outline"
                                    onChange={handleSelect}
                                    value={detail?.city}
                                    isSearchable={false}
                                    styles={{
                                    menuPortal: (provided) => ({ ...provided})
                                    }}
                                    options={listCity}
                                    /> */}
                                    <FormLabel fontSize="12" pt="1.5" fontFamily={'Mulish'} style={{ transform: `${detail?.city}` ? 'translate(-1px, -10px) scale(0.75)' : 'translate(1px, 4px) scale(0.75)', fontSize:"14px",color:`${detail?.city}` ? '#065baa' : '#231F20'  }}>Select City</FormLabel>
                                </FormControl>
                            </Box>
       </Box>
       
      <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} p="9px" borderRadius={'5px'} border="1px" borderColor={'#ebebeb'}>
          <Button isDisabled={detail?.travelAgentName  ==='' || detail?.travelAgentEmail === '' || detail?.travelAgentPhone ==='' || detail?.custid ==='' || detail?.proformaInvoiceRecipients ==='' || detail?.apiPassword ==='' || detail?.commission ==='' || detail?.legalName ==='' || detail?.paymentType ===''
          || detail?.custcode ==='' || detail?.city ==='' || detail?.allowCreditPayment ==='false' || detail?.cgroup ===''
            ? true : false} variant={'ClaimBtn'} style={{ textTransform: 'uppercase', fontSize: '14px' }} fontFamily="arial" fontWeight={'700'} onClick={handleNext}>Add</Button>
      </Box>
      </Box>
    </Stack>
  )
 }
export default CreateUser