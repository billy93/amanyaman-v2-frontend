import React, { useState } from 'react'
import { NavLink,Navigate, useNavigate,Link as Links } from "react-router-dom";
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
Select,
Divider,
Textarea,
Center,
Breadcrumb,
BreadcrumbItem,
BreadcrumbLink,
RadioGroup,
Radio,
} from '@chakra-ui/react'
import { useSelector } from "react-redux"
import { useDispatch } from 'react-redux'
import {useCreateAgentMutation,useGetRoleQuery,useUpdateAgentMutation} from './travelApiSlice'
import {setListAgent,listAgent,formAgent,setFormAgent,listDetailAgent} from './travelAgentSlice'
import { differenceInCalendarDays } from 'date-fns';
import { ChevronRightIcon } from '@chakra-ui/icons'
import { MdAdd } from 'react-icons/md'
console.log('formAgent', formAgent)
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

const CreateUser = () => {
  const dispatch = useDispatch()
  const listProducts = useSelector(listAgent)
  const detail = useSelector(listDetailAgent)
  const formuser = useSelector(formAgent)
  const hiddenInputIdtty = React.useRef(null)
  const navigate = useNavigate()
  const [fields, setFields] = React.useState(null)
  const [trigger, setTrigger] = React.useState(false)
  const [selectFill,setSelectFille] = React.useState(false)
  const [createAgent] = useCreateAgentMutation({
   skip:trigger === false 
  })
  const [updateAgent] = useUpdateAgentMutation()
    const toast = useToast()
    
  const onSelectAllowCredit = (selected) => {
      const formstate = {
          ...formuser,
          allowCreditPayment:selected
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
        const datas = {
            travelAgentName:formuser?.travelAgentName,    
            travelAgentEmail:formuser?.travelAgentEmail,    
            travelAgentAddress:formuser?.travelAgentAddress,  
            travelAgentPhone:formuser?.travelAgentPhone,  
            custcode:formuser?.custcode,   
            custid:formuser?.custid,   
            promoInvoiceRecipents:formuser?.promoInvoiceRecipents,   
            allowCreditPayment:formuser?.allowCreditPayment,   
            city:formuser?.city
        }
      
      try {
        let data = await !formuser?.id ? createAgent(datas) : updateAgent({...datas, id:formuser?.id}) 
         dispatch(setListAgent([...listProducts, datas]));
        toast({
                  title: `${formuser?.login !=='' ? 'Edit User Success' : 'Created User Success'}`,
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
      navigate('/master-data/create-agent')
    }
  
  const handleData = (e) => {
    const forms = {
      ...formuser,
      [e.target.name]: e.target.value 
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
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="travelAgentName" value={formuser !==null ? formuser.travelAgentName : null } onChange={handleData} h="48px"/>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Travel Agent Name</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box display="flex" gap="5px" m="auto" width={{base:"100%",md:"540px"}}>
            <Box width={{base:"100%",md:"240px"}} >  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="travelAgentEmail" value={formuser !==null ? formuser?.travelAgentEmail : null} onChange={handleData} h="48px"/>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Travel Agent Email</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box width={{base:"100%",md:"240px"}} >  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="travelAgentAddress" value={formuser !==null ? formuser?.travelAgentAddress : null} onChange={handleData} h="48px"/>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">travel Agent Address</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="travelAgentPhone" value={formuser !==null ? formuser?.travelAgentPhone : null} onChange={handleData} h="48px"/>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Travel Agent Phone</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="custcode" value={formuser !==null ? formuser?.custcode : null} onChange={handleData} h="48px"/>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Cust Code</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="custid" value={formuser !==null ? formuser?.custid : null } onChange={handleData} h="48px"/>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Cust Id</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="cgroup" value={formuser !==null ? formuser?.cgroup : null} onChange={handleData} h="48px"/>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">CGroup</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="promoInvoiceRecipents" value={formuser !==null ? formuser?.promoInvoiceRecipents : null} onChange={handleData} h="48px"/>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">promo Invoice Recipents</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto" mt="15px">  
           <RadioGroup defaultValue={formuser !==null ? formuser?.allowCreditPayment : null} onChange={onSelectAllowCredit}>
             <Stack spacing={4} direction='column'>
                 <Radio value={'true'}><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Allow Credit Payment</Text></Radio>
              </Stack>
            </RadioGroup>
          </Box>
         <Box width={{base:"100%",md:"540px"}} m="auto">
             <FormControl variant="floating" isRequired fontFamily={'Mulish'} mt="14px" id="float-label"> 
                    <Box className='floating-form'>
                      <Box className='floating-label'>
                        <Select className="floating-select" placeholder='' defaultValue={formuser !==null ? formuser?.city : null} name="city" h="48px" onChange={handleData}>  
                         <option value={'jakarta barat'}>{'Jakarta Barat'}</option>
                         <option value={'jakarta timur'}>{'Jakarta Timur'}</option>
                        </Select>
                        <span className="highlight"></span>
                        <FormLabel fontSize="12" pt="1.5" style={{ transform: formuser !==null && formuser?.city ? "translate(0, -19px) scale(0.75)": "",color: formuser !== null && formuser?.city ?"#065baa" :"", fontSize:"14px" }} fontFamily={'Mulish'}>City</FormLabel>
                       </Box>
                    </Box>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
         </Box>
       </Box>
      <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} p="9px" borderRadius={'5px'} border="1px" borderColor={'#ebebeb'}>
          <Button isDisabled={formuser?.travelAgentName  ==='' || formuser?.travelAgentEmail === '' || formuser?.travelAgentPhone ==='' || formuser?.custid ==='' || formuser?.promoInvoiceRecipents ===''
          || formuser?.custcode ==='' || formuser?.city ==='' || formuser?.allowCreditPayment ==='false' || formuser?.cgroup ===''
            ? true : false} variant={'ClaimBtn'} style={{ textTransform: 'uppercase', fontSize: '14px' }} fontFamily="arial" fontWeight={'700'} onClick={handleNext}>Add</Button>
      </Box>
      </Box>
    </Stack>
  )
 }
export default CreateUser