import React, { useState } from 'react'
import { NavLink,Navigate, useNavigate, useParams } from "react-router-dom";
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
Select as SelectDef,
FormLabel,
useToast,
InputGroup,
InputRightElement,
Divider,
Textarea,
useTheme,
useColorMode,
useColorModeValue,
Center,
Container,
useMultiStyleConfig,
Breadcrumb,
BreadcrumbItem,
BreadcrumbLink,
} from '@chakra-ui/react'
import { useSelector } from "react-redux"
import { useDispatch } from 'react-redux'
import {useCreateUserMutation,useGetRoleQuery,useUpdateUserMutation,useGetUserQuery} from './userApiSlice'
import {setListUser,listUsers,listRoleUsers,setRoleUser,formUser,setFormUser,selectAgentList,setFormSelectAgent} from './masterUserSlice'
import { differenceInCalendarDays } from 'date-fns';
import { ChevronRightIcon } from '@chakra-ui/icons'
import { MdAdd } from 'react-icons/md'
import { useGetTravelAgentQuery } from "../travelAgent/travelApiSlice"
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

const CreateUser = () => {
  const dispatch = useDispatch()
  const {id} = useParams()
  const listProducts = useSelector(listUsers)
  const listRoles = useSelector(listRoleUsers)
  const formuser = useSelector(formUser)
  const selectListAgent = useSelector(selectAgentList)
  const hiddenInputIdtty = React.useRef(null)
  const navigate = useNavigate()
  const [fields, setFields] = React.useState(null)
  const [trigger, setTrigger] = React.useState(false)
  const { data: rolesData} = useGetRoleQuery()
  const prevListRoles = usePrevious(rolesData)
  const [selectFill, setSelectFille] = React.useState(false)
  const { th } = useMultiStyleConfig("Table", {});
  const theme = useTheme();
  const outlineColor = useColorModeValue(
    theme.colors.blue[500],
    theme.colors.blue[300]
  );
  const {
        data: listAgent,
    } = useGetTravelAgentQuery({page:0,size:999}, { refetchOnMountOrArgChange: true })
  const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUserQuery({count:5}, { refetchOnMountOrArgChange: true })
  const [createUser] = useCreateUserMutation({
   skip:trigger === false 
  })
  React.useMemo(() => {
    if (listAgent) {
      let city = listAgent?.map((obj,i) => ({ ...obj, 'label': obj.travelAgentName,'value':obj.id, idx:i }))
        dispatch(setFormSelectAgent(city))
    }
  }, [listAgent])

  React.useMemo(() => {
    if (rolesData) {
      let city = rolesData?.map((obj,i) => ({ ...obj, 'label': obj.name }))
        dispatch(setRoleUser(city))
    }
  }, [rolesData])

  React.useMemo(() => {
      const dataUserDetail = users?.filter((user,i) => user.id === parseInt(id))
      if (dataUserDetail) {
          const editUser = {
                id:dataUserDetail !==null ? dataUserDetail[0]?.id : null,
                login:dataUserDetail !==null ? dataUserDetail[0]?.login : null,
                firstName:dataUserDetail !==null ? dataUserDetail[0]?.firstName : null,
                lastName:dataUserDetail !==null ? dataUserDetail[0]?.lastName : null,
                email:dataUserDetail !==null ? dataUserDetail[0]?.email : null,
                authorities: dataUserDetail !== null ? [{ 'label': dataUserDetail[0]?.authorities[0], 'name': dataUserDetail[0]?.authorities[0]}] : null,
                travelAgent:dataUserDetail !==null ? [{'value' : dataUserDetail[0]?.travelAgent?.id, 'label':dataUserDetail[0]?.travelAgent?.travelAgentName}] : null
          }
         
        dispatch(setFormUser(editUser))
      }
  }, users, dispatch, id)
    
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
    
  const getdefaultSelect = (id) => {
    let value 
    
      return value
    }
    const handleNext = async (e) => {
      e.preventDefault()
      const datas = {
          id:formuser?.id,
          login:formuser?.login,
          firstName:formuser?.firstName,
          lastName:formuser?.lastName,
          email:formuser?.email,
          authorities:[`${formuser?.authorities[0]?.label}`],
          travelAgent:{
            id: formuser && formuser?.travelAgent[0].id
          }
        }
      
      try {
        let data = await updateUser({...datas, id:formuser?.id})
         dispatch(setListUser([...listProducts, datas]));
        toast({
                  title: `Edit User Success `,
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

  // React.useEffect(() => {
  //   if (JSON.stringify(prevListRoles) !== JSON.stringify(rolesData)) {
  //     dispatch(setRoleUser(rolesData))
  //   }
  // }, [rolesData, prevListRoles, dispatch])

  function handleSelect(data) {
    console.log('datas', data)
         const forms = {
          ...formuser,
          travelAgent:[{
            id: data.id,
            label: data.label
          }]
        }
    dispatch(setFormUser(forms))
  }

  function handleSelectRoles(data) {
        console.log('data', data)
         const forms = {
          ...formuser,
          authorities: 
           [{...data}]
          }
    dispatch(setFormUser(forms))
  }
  const test = [
    {
      id:'1',
      label:"GOLDEN RAMA",
    },
    {
      id:'4',
      label:"TEST GOLDEN RAMA 2",
    }
  ]
  console.log('formuser', formuser)
  console.log('selectListAgent', selectListAgent)
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
                            
                             Edit User 
                            
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
              <FormLabel fontSize="14" pt="1.5" style={{ transform: "translate(-12px, -37px) scale(0.75)", color: "#231F20", fontSize: "20px", fontWeight: "bold" }} fontFamily={'Mulish'}>{'Edit User' }</FormLabel>
                <Text as="p" fontSize={'sm'} fontFamily={'Mulish'} style={{fontSize:'12px'}}></Text>
                {/* <Button onClick={handleUploadClick}>Upload</Button> */}
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
          <FormControl variant="floating" id="first-name" isRequired mt="14px">
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="lastName" value={formuser?.lastName} onChange={handleData} h="48px" variant={'custom'}/>
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
             <FormControl variant="floating" isRequired fontFamily={'Mulish'} mt="14px"> 
                    <Box className='floating-form'>
                      <Box className='react-select-container'>
                        <Select
                            isMulti={false}
                            name="colors"
                            onChange={handleSelectRoles}
                            value={formuser?.authorities}
                            classNamePrefix="chakra-react-select"
                            options={listRoles}
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
                        <span className="highlight"></span>
                        <FormLabel  pt="1.5" style={{ transform: formuser !==null && formuser?.authorities !=='' ? "translate(0, -10px) scale(0.75)": "translate(0, 4px) scale(0.75)",color: formuser !== null && formuser?.authorities ==='' ?"#231F20" :"#065baa", fontSize:"14px", fontWeight:"600" }} fontFamily={'Mulish'}>Role</FormLabel>
                      
                       </Box>
                    </Box>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
          </Box>
          <Box width={{base:"100%",md:"540px"}} m="auto">
             <FormControl variant="floating" isRequired fontFamily={'Mulish'} mt="14px" > 
                    <Box className='floating-form'>
                      <Box className='floating-label'>
                        <Select
                            isMulti={false}
                            name="colors"
                            onChange={handleSelect}
                            value={formuser?.travelAgent}
                            classNamePrefix="chakra-react-select"
                            options={selectListAgent}
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
                        <span className="highlight"></span>
                        <FormLabel  pt="1.5" style={{ transform: formuser !==null && formuser?.travelAgent !=='' ? "translate(0, -10px) scale(0.75)": "translate(0, 4px) scale(0.75)",color: formuser !== null && formuser?.travelAgent ==='' ?"#231F20" :"#065baa", fontSize:"14px", fontWeight:"600" }} fontFamily={'Mulish'}>Travel Agent</FormLabel>
                       </Box>
                    </Box>
                    {/* It is important that the Label comes after the Control due to css selectors */}
                </FormControl>
         </Box>
       </Box>
      <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} p="9px" borderRadius={'5px'} border="1px" borderColor={'#ebebeb'}>
          <Button isDisabled={formuser?.authorities?.length ===0 || formuser?.login ==='' || formuser?.firstName ==='' || formuser?.email ===''
          || formuser?.lastName ===''
            ? true : false} variant={'ClaimBtn'} style={{ textTransform: 'uppercase', fontSize: '14px' }} fontFamily="arial" fontWeight={'700'} onClick={handleNext}>Add</Button>
      </Box>
      </Box>
    </Stack>
  )
 }
export default CreateUser