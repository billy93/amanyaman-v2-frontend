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
import { useDispatch } from 'react-redux'
import {useCreateUserMutation,useGetRoleQuery,useUpdateUserMutation} from './userApiSlice'
import {setListUser,listUsers,listRoleUsers,setRoleUser,formUser,setFormUser} from './masterUserSlice'
import { differenceInCalendarDays } from 'date-fns';
import { ChevronRightIcon } from '@chakra-ui/icons'
import { MdAdd } from 'react-icons/md'
import { useGetTravelAgentQuery } from "../travelAgent/travelApiSlice"

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
  const listProducts = useSelector(listUsers)
  const listRoles = useSelector(listRoleUsers)
  const formuser = useSelector(formUser)
  const hiddenInputIdtty = React.useRef(null)
  const navigate = useNavigate()
  const [fields, setFields] = React.useState(null)
  const [trigger, setTrigger] = React.useState(false)
  const { data: rolesData, isLoading, isError, isSuccess } = useGetRoleQuery()
  const prevListRoles = usePrevious(rolesData)
  const [selectFill, setSelectFille] = React.useState(false)
   const {
        data: listAgent,
    } = useGetTravelAgentQuery({page:0,size:999}, { refetchOnMountOrArgChange: true })
  const [createUser] = useCreateUserMutation({
   skip:trigger === false 
  })
  const [updateUser] = useUpdateUserMutation()
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
    
  
    const handleNext = async (e) => {
      e.preventDefault()
        const datas = {
          login:formuser?.login,
          firstName:formuser?.firstName,
          lastName:formuser?.lastName,
          email:formuser?.email,
          authorities: [`${formuser?.authorities}`],
          travelAgent: {
            id:formUser?.travelAgent
          }
        }
      
      try {
        let data = await createUser(datas)
         dispatch(setListUser([...listProducts, datas]));
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
      navigate('/master-data/master-user')
    }
  
  const handleData = (e) => {
    const forms = {
      ...formuser,
      [e.target.name]: e.target.value 
    }
    dispatch(setFormUser(forms))
  }

  React.useEffect(() => {
    if (JSON.stringify(prevListRoles) !== JSON.stringify(rolesData)) {
      dispatch(setRoleUser(rolesData))
    }
  }, [rolesData, prevListRoles, dispatch])
  
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
                            {
                              'Create User'
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
              <FormLabel fontSize="14" pt="1.5" style={{ transform: "translate(-12px, -37px) scale(0.75)", color: "#231F20", fontSize: "20px", fontWeight: "bold" }} fontFamily={'Mulish'}>{ 'Add User' }</FormLabel>
                <Text as="p" fontSize={'sm'} fontFamily={'Mulish'} style={{fontSize:'12px'}}></Text>
                {/* <Button onClick={handleUploadClick}>Upload</Button> */}
              </FormControl>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">      
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="login" value={formuser?.login} onChange={handleData} h="48px" variant={'custom'}/>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Username</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box display="flex" gap="5px" m="auto" width={{base:"100%",md:"540px"}}>
            <Box width={{base:"100%",md:"240px"}} >  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="firstName" value={formuser?.firstName} onChange={handleData} h="48px" variant={'custom'}/>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">FistName</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          <Box width={{base:"100%",md:"240px"}} >  
          <FormControl variant="floating" id="lastname-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="lastName" value={formuser?.lastName} onChange={handleData} h="48px" variant={'custom'} bg={formuser !==null && formuser?.lastName !=='' ? '#e8f0fe' : '#ebebeb'} />
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">LastName</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">  
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="email" value={formuser?.email} onChange={handleData} h="48px" variant={'custom'}/>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Email</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
          </FormControl>
          </Box>
         <Box width={{base:"100%",md:"540px"}} m="auto">
             <FormControl variant="floating" isRequired fontFamily={'Mulish'} mt="14px" id="float-label"> 
                    <Box className='floating-form'>
                      <Box className='floating-label'>
                        <Select style={{fontFamily:"Mulish", fontWeight:"normal"}} bg={formuser !==null && formuser?.authorities?.length !==0 ? '#e8f0fe' : '#ebebeb'} placeholder=''  name="authorities" h="48px" onChange={handleData}>  
                         {
                          formuser?.authorities?.length ===0 &&(
                           <option value={''} >{''}</option>
                         )
                         }
                        {
                          listRoles?.map((role, i) => {
                            return (
                              <option value={role.name} key={i} fontFamily={'Mulish'} fontSize={'12px'}>{role.name}</option>
                            )
                          })
                        }
                        </Select>
                        <span className="highlight"></span>
                        <FormLabel  pt="1.5" style={{ transform: formuser !==null && formuser?.authorities?.length !==0 ? "translate(0, -10px) scale(0.75)": "translate(0, 4px) scale(0.75)",color: formuser !== null && formuser?.authorities?.length ===0 ?"#231F20" :"#065baa", fontSize:"14px"}} fontFamily={'Mulish'}>Role</FormLabel>
                       </Box>
                    </Box>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
         </Box>
         <Box width={{base:"100%",md:"540px"}} m="auto">
             <FormControl variant="floating" fontFamily={'Mulish'} mt="14px" id="float-label"> 
                    <Box className='floating-form'>
                      <Box className='floating-label'>
                        <Select bg={formuser !==null && formuser?.travelAgent !=='' ? '#e8f0fe' : '#ebebeb'} placeholder=''  name="travelAgent" h="48px" onChange={handleData}>  
                         {
                          formuser?.travelAgent ==='' &&(
                           <option value={''} >{''}</option>
                         )
                         }
                        {
                          listAgent?.map((role, i) => {
                            return (
                              <option value={role.id} key={i} fontFamily={'Mulish'} fontSize={'12px'}>{role.travelAgentName}</option>
                            )
                          })
                        }
                        </Select>
                        <span className="highlight"></span>
                        <FormLabel  pt="1.5" style={{ transform: formuser !==null && formuser?.travelAgent !=='' ? "translate(0, -10px) scale(0.75)": "translate(0, 4px) scale(0.75)",color: formuser !== null && formuser?.travelAgent ==='' ?"#231F20" :"#065baa", fontSize:"14px"}} fontFamily={'Mulish'}>Travel Agent</FormLabel>
                       </Box>
                    </Box>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
         </Box>
       </Box>
      <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} p="9px" borderRadius={'5px'} border="1px" borderColor={'#ebebeb'}>
          <Button isDisabled={formuser?.authorities.length ===0 || formuser?.login ==='' || formuser?.firstName ==='' || formuser?.email ===''
          || formuser?.lastName ===''
            ? true : false} variant={'ClaimBtn'} style={{ textTransform: 'uppercase', fontSize: '14px' }} fontFamily="arial" fontWeight={'700'} onClick={handleNext}>Add</Button>
      </Box>
      </Box>
    </Stack>
  )
 }
export default CreateUser