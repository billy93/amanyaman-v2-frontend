import React from "react"
import { Link,Navigate, useNavigate,useParams } from "react-router-dom"
import { Button, ButtonGroup,Box,Text,Heading, Stack,FormControl,InputRightElement,InputGroup,Input,FormLabel,FormErrorMessage } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import { useSelector, useDispatch } from "react-redux"
import {useResetNewPasswordMutation} from './forgotApiSlice'
// import Logo from '../img/logo.jpeg'
import {userResetPassword} from './authSlice'
import { AbsoluteCenter } from '@chakra-ui/react'
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import {AiOutlineMail,AiFillCheckCircle} from 'react-icons/ai'
const ConfirmationResetPass = () => {
  const {id} = useParams()
  const  [searchParams, setSearchParams] = useSearchParams();
  const userEmail = useSelector(userResetPassword)
  const [trigger, setTrigger] = React.useState(false)
  const navigate = useNavigate()
  const [resetNewPassword, {isLoading, isSuccess,isError}] = useResetNewPasswordMutation()
  const [show, setShow] = React.useState(false)
  const [showNew, setShowNew] = React.useState(false)
  const [error,setError] = React.useState(false)
 const [fields, setFields] = React.useState({
    newPassword: "",
    passwordRetype:"",
 })
    
console.log('searchParams', searchParams.get('key'))
// let params = serializeFormQuery(event.target);
 const setFieldChange = (e) => {
        setFields({...fields,[e.target.name]:e.target.value})
 }
  const handleResetPassword = async(e) => {
      e.preventDefault()
      const user = {
          key: searchParams.get('key'),
          newPassword: fields?.newPassword,
          passwordRetype: fields?.passwordRetype
      }
       try{
         const result = await resetNewPassword(user).unwrap();
          console.log(result)
        } catch(err){
         console.log(err)
          } 
    //   console.log('users', user)
    //   let resp = await resetNewPassword(user)
    //   console.log('res', resp)
  }
 const handleClick = () => setShow(!show)
 const handleClickNew = () => setShowNew(!show)
 
    React.useEffect(() => {
        if (fields?.newPassword !== fields?.passwordRetype) {
         setError(true)
        } else {
            setError(false)
     }
    }, [fields?.newPassword, fields?.passwordRetype])
    console.log('isSuccess', isSuccess)
    React.useEffect(() => {
        if (isSuccess) {
            navigate('/')
        }
    },[isSuccess,navigate])
    const content = (
        <section className="login-page">
           <Box color='black:500'>  
           <AbsoluteCenter axis='both' width={{base:"100%", xs:"100%",md:"400px"}}>
            <Box minH="300"  left="0" right="0" bottom="0" bg="white" h="auto" p="1em" boxShadow='md' rounded='md' width={{ base: '100%',md:"400px" }} >
              <Image src={'https://claim.amanyaman.com/images/logo.svg'} alt='Logo Aman' objectFit="cover" mb="2" mt="2.2em" ml={'auto'} mr={'auto'} />
                {
                    isError ? (
                        <Box mt="4em" h="50px" mb={'4em'} bg={'white'} border={'1px'} borderColor={'red'} width={{base:"100%"}} height={'55px'} p={'2'} display="flex" justifyContent={'flex-start'} alignItems={'center'}>
                        <Box bg="#FFA00">
                            <AiFillCheckCircle size={'20px'} color="red"/>
                        </Box>
                        <Text as={'p'} fontSize='xs' color={'black.200'} p={'3'}>
                              {'Email Failed to sent'}
                        </Text>
                    </Box>
                    ):(
                        <Stack spacing={2} display="flex" flexDirection="row" justifyContent="center" mt="35px" h="50">
                         <Heading variant="primary" as="h4" size="md">Change Password</Heading>
                        </Stack>
                    )
                }
                
                <Box gap="10px" display={'flex'} flexDirection={'column'} mt="3em">
                    <FormControl variant="floating" id="pwd" isRequired >
                        <InputGroup>
                          <Input type={show ? 'text' : 'password'} placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="newPassword" value={fields?.newPassword} onChange={setFieldChange} h="48px" />
                          <FormLabel fontSize="12" pt="1.5" >Enter Password</FormLabel>
                          <Box>
                              <InputRightElement width='4.5rem' h="100%">
                              <Button h='1.75rem' size='sm' onClick={handleClick} bg="none" color={'#065BAA'} border={'none'}
                                _hover={{
                                  border: 'none',
                                   transform: "scale(1.05, 1.05)",
                                    bg: `#054e912b`,

                                    _dark: {
                                      bg: `#054e91`,
                                    },
                              }}
                              >
                                {show ?  <AiFillEye /> : <AiFillEyeInvisible />}
                              </Button>
                            </InputRightElement>
                            </Box>
                        </InputGroup>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                    </FormControl>
                <FormControl variant="floating" id="pwd" isRequired >
                        <InputGroup>
                          <Input type={show ? 'text' : 'password'} placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="passwordRetype" value={fields?.passwordRetype} onChange={setFieldChange} h="48px" />
                          <FormLabel fontSize="12" pt="1.5" >Enter New Password</FormLabel>
                          <Box>
                              <InputRightElement width='4.5rem' h="100%">
                              <Button h='1.75rem' size='sm' onClick={handleClickNew} bg="none" color={'#065BAA'} border={'none'}
                                _hover={{
                                  border: 'none',
                                   transform: "scale(1.05, 1.05)",
                                    bg: `#054e912b`,

                                    _dark: {
                                      bg: `#054e91`,
                                    },
                              }}
                              >
                                {showNew ?  <AiFillEye /> : <AiFillEyeInvisible />}
                              </Button>
                            </InputRightElement>
                            </Box>
                        </InputGroup>
                         {error ===true ? <Text as="p" size={'sm'} color="red" style={{fontSize:"12px"}} fontFamily={'Mulish'} pt="4px">Password not match with new password</Text> : null}
                        {/* It is important that the Label comes after the Control due to css selectors */}
                    </FormControl>
                </Box>
                 <Button isLoading={isLoading} bg='#065BAA' onClick={handleResetPassword} h="48px" w={'100%'} mt="1em" isDisabled={fields?.newPassword !== fields?.passwordRetype ? true : false}>
                    <Text as="b" fontSize={'sm'} fontFamily="arial" fontWeight={'700'} style={{fontSize:"14px", textTransform:'uppercase'}}>Change Password</Text>
                </Button>
            </Box>
            </AbsoluteCenter>
          </Box>
        </section>

    )
    return content
}
export default ConfirmationResetPass