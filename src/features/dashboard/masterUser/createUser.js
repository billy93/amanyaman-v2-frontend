import React, { useState } from 'react'
import { NavLink,Navigate, useNavigate } from "react-router-dom";
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
} from '@chakra-ui/react'
import { useSelector } from "react-redux"
import {useDispatch} from 'react-redux'
import {setListUser,listUsers} from './masterUserSlice'
import { differenceInCalendarDays } from 'date-fns';
import { ChevronRightIcon } from '@chakra-ui/icons'
import { MdAdd } from 'react-icons/md'

const CreateUser = () => {
  const dispatch = useDispatch()
  const listProducts = useSelector(listUsers)
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
     
    //   dispatch(setuploadDoc(data))
    }
};
    
  
    const handleNext = (e) => {
      e.preventDefault()
        const data = {
          id:fields?.id,
          username:fields?.username,
          fullname:`${fields?.firstName} ${fields?.lastName}`,
          email:fields?.email,
          role:fields?.role,
          area:fields?.area,
      }
      dispatch(setListUser([...listProducts,data ]))
      toast({
                  title: `Created User Success`,
                  status:"success",
                  position: 'top-right',
                  duration:3000,
                  isClosable: true,
                  variant:"solid",
      })
      setFields(null)
      navigate('/master-user')
    }
  
  const handleData = (e) => {
     let idx = listProducts?.length
    setFields({
      ...fields,
      id:idx+1,
      [e.target.name]: e.target.value 
    })
  }
  
  return (
    <Stack mt={{base:"1em", md:"5em"}}>
      <Box p="12px" display="flex" justifyContent={'space-between'} alignItems="center">
        <Box as='button' onClick={'handleBackStep'} display="flex"textAlign="left" >
         <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
                    <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink as={NavLink} to='/master-data/master-user'>
                                <Text as="b" ml="4" fontSize="sm" color="#065BAA"  _hover={{
                                    borderBottom: "#065BAA",
                                    border:"1 px solid"
                                }}>
                                    Users
                                </Text>
                            </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <BreadcrumbLink as={NavLink} to='#' style={{ pointerEvents: 'none'}}>
                            <Text as={'b'} fontSize={'sm'} color="#231F20"
                           >
                              Create User
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
                <FormLabel fontSize="14" pt="1.5" style={{ transform:  "translate(-12px, -37px) scale(0.75)",color: "#231F20" , fontSize:"20px", fontWeight:"bold" }} fontFamily={'Mulish'}>Add User</FormLabel>
                <Text as="p" fontSize={'sm'} fontFamily={'Mulish'} style={{fontSize:'12px'}}></Text>
                {/* <Button onClick={handleUploadClick}>Upload</Button> */}
              </FormControl>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="username" value={fields?.username} onChange={handleData} h="48px"/>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Username</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box display="flex" gap="5px" m="auto" width={{base:"100%",md:"540px"}}>
            <Box width={{base:"100%",md:"240px"}} >  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="firstName" value={fields?.firstName} onChange={handleData} h="48px"/>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">FistName</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box width={{base:"100%",md:"240px"}} >  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="lastName" value={fields?.lastName} onChange={handleData} h="48px"/>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">LastName</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="email" value={fields?.email} onChange={handleData} h="48px"/>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Email</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
         <Box width={{base:"100%",md:"540px"}} m="auto">
             <FormControl variant="floating" isRequired fontFamily={'Mulish'} mt="14px" id="float-label"> 
                    <Box className='floating-form'>
                      <Box className='floating-label'>
                        <Select className="floating-select" placeholder='' value={fields?.role} name="role" h="48px" onChange={handleData}>  
                          <option value="">Role</option>
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </Select>
                        <span className="highlight"></span>
                        <FormLabel fontSize="12" pt="1.5" style={{ transform: fields?.role ? "translate(0, -19px) scale(0.75)": "",color: fields?.role ?"#065baa" :"", fontSize:"14px" }} fontFamily={'Mulish'}>Role</FormLabel>
                       </Box>
                    </Box>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
         </Box>
         <Box width={{base:"100%",md:"540px"}} m="auto">
             <FormControl variant="floating" isRequired fontFamily={'Mulish'} mt="14px" id="float-label"> 
                    <Box className='floating-form'>
                      <Box className='floating-label'>
                        <Select className="floating-select" placeholder='' value={fields?.area} name="area" h="48px" onChange={handleData}>  
                          <option value="">Area</option>
                          <option value="area1">Area1</option>
                          <option value="area2">Area2</option>
                        </Select>
                        <span className="highlight"></span>
                        <FormLabel fontSize="12" pt="1.5" style={{ transform: fields?.area ? "translate(0, -19px) scale(0.75)": "",color: fields?.area ?"#065baa" :"", fontSize:"14px" }} fontFamily={'Mulish'}>Area</FormLabel>
                       </Box>
                    </Box>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
         </Box>
       </Box>
      <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} p="9px" borderRadius={'5px'} border="1px" borderColor={'#ebebeb'}>
          <Button isDisabled={!fields?.area || !fields?.role || !fields?.username || !fields?.firstName || !fields?.email
          || !fields?.lastName 
            ? true : false} variant={'ClaimBtn'} style={{ textTransform: 'uppercase', fontSize: '14px' }} fontFamily="arial" fontWeight={'700'} onClick={handleNext}>Add</Button>
      </Box>
      </Box>
    </Stack>
  )
 }
export default CreateUser