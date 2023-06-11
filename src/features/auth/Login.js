import React,{ useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box,Center } from '@chakra-ui/react'
import { useDispatch,useSelector } from 'react-redux'
import { saveToken,setAuth,resetPassword,userResetPassword,setCredentials,UserRoles,selectCurrentUser,selectCurrentToken,userLoginCurrent,tokenLoginCurrent } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import { useForgotPassQuery,useSendEmailConfirmMutation } from './forgotApiSlice'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { Link } from "react-router-dom"
import { AiFillEyeInvisible,AiFillEye } from "react-icons/ai";
import usePersist from '../hook/usePersist' 
import PulseLoader from 'react-spinners/PulseLoader'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Heading,
  Button,
  Text,
  AbsoluteCenter,
  InputGroup,
  InputRightElement,
  Checkbox,
  IconButton,
  useToast
} from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import Logo from '../../img/logo.jpeg'
import { Stack, HStack, VStack } from '@chakra-ui/react'
import { isAuthenticate } from "../../features/auth/authSlice"
import { MdWarning } from 'react-icons/md'

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


const Login = () => {
  const userRef = useRef()
  const errRef = useRef()
  const toast = useToast()
  const [persist, setPersist] = usePersist()
  const usersCurrent = useSelector(userLoginCurrent)
  const [user, setUser] = useState('bayu')
  const [pwd, setPwd] = useState('abcd1234')
  const [errMsg, setErrMsg] = useState(false)
  const navigate = useNavigate()
  const [formReset, setFormReset] = useState(false)
  const [login, { isLoading,isSuccess:loginSuccess }] = useLoginMutation()
  const isAuthenticated = useSelector(isAuthenticate);
  const [sendEmailConfirm] = useSendEmailConfirmMutation()
  const isAuth = JSON.parse(localStorage.getItem('persist')) && JSON.parse(localStorage.getItem("persist")).token
  const prevAuth = usePrevious(isAuth)
    const dispatch = useDispatch()
    const [input, setInput] = useState('')

    const handleUserChange = (e) => setUser(e.target.value)
    const handlePwdChange = (e) => setPwd(e.target.value)
    const [fields, setFields] = useState({
    username: "",
    password:"",
    rememberMe:true
    })
    const [fieldsReset, setFieldsReset] = useState({
    username: "",
    })
    const [trigger, setTriger] = useState(false)
    const { data: emailuser, isError, isSuccess, isLoading:loading } = useForgotPassQuery(fieldsReset?.username, {
      skip : trigger === false
    })  
    const [show, setShow] = useState(false)
    const checkAccount = useSelector(userResetPassword)
    const handleClick = () => setShow(!show)
    dispatch(resetPassword(emailuser))
    const setFieldChange = (e) => {
        
        setFields({...fields,[e.target.name]:e.target.value})
    }

  const setFieldResetChange = (e) => {
      
      setFieldsReset({...fieldsReset,[e.target.name]:e.target.value})
  }
  useEffect(() => {
    if (isSuccess && checkAccount !==null) {
       navigate('/forgot-password')
    }
  }, [checkAccount, isSuccess, navigate])
  
  const waitForToken = () => {
    return new Promise((resolve) => {
      const checkToken = () => {
        const token = localStorage.getItem('persist') && localStorage.getItem('persist').token;

        if (token) {
          clearInterval(interval);
          resolve(token);
        }
      };

      const interval = setInterval(checkToken, 500); // Check every 500 milliseconds
      checkToken(); // Check immediately
    });
  };

  const handleRedirect = React.useCallback (() => {
    const token =  waitForToken();
    if (token !== null) {
    dispatch(saveToken(true));
    navigate('/create-quota/search') 
    }
  },[dispatch,navigate]);

  React.useEffect(() => {
    if (loginSuccess) {
        handleRedirect()
   }
  }, [loginSuccess, handleRedirect]);
  
  React.useEffect(() => {
    if (isAuthenticated) {
        navigate('/create-quota/search') 
   }
  }, [navigate,isAuthenticated]);

  const handlelogin = async (e) => {
    try {
            const userData = await login({ username:fields?.username, password:fields?.password,rememberMe:fields?.rememberMe }).unwrap()
            dispatch(setCredentials({...userData}))
            // navigate('/create-quota/search')
            const id = 'test-toast'
            if(!toast.isActive(id)){
              toast({
                          title: `Login Success`,
                          status:"success",
                          position: 'top-right',
                          duration:3000,
                          isClosable: true,
                          variant:"solid",
                        })
            }
    } catch (err) {
      console.log('eerrr',err?.data)
      if (err?.data?.resetKey) {
              navigate(`/reset-password?key=${err?.data?.resetKey}`)
              
            // errRef.current.focus();
      }
      else if (err?.data.message) {
        toast({
                                id:err?.data.message,
                                title: `${err?.data.message}`,
                                status:"error",
                                position: 'top-right',
                                duration:3000,
                                isClosable: true,
                                variant:"solid"
                              })
      }
      else {
        if (!err?.originalStatus) {
                navigate('/')
                const id = `errorres`
                if (!toast.isActive(id)) {
                  toast({
                                id,
                                title: `No Server Response`,
                                status:"error",
                                position: 'top-right',
                                duration:3000,
                                isClosable: true,
                                variant:"solid"
                              })
                }
                  // isLoading: true until timeout occurs
                  // setErrMsg('No Server Response');
              } else if (err.originalStatus === 400) {
                  // setErrMsg('Missing Username or Password');
                  navigate('/')
                  toast({
                                title: `Missing Username or Password`,
                                status:"error",
                                position: 'top-right',
                                duration:3000,
                                isClosable: true,
                                variant:"solid"
                              })
              } else if (err.originalStatus === 401) {
                navigate('/')
                  setErrMsg('Unauthorized');
                  toast({
                                title: `Unauthorized`,
                                status:"error",
                                position: 'top-right',
                                duration:3000,
                                isClosable: true,
                                variant:"solid"
                              })
              } else {
                navigate('/')
                  setErrMsg('Login Failed');
                  toast({
                                title: `Login Failed`,
                                status:"error",
                                position: 'top-right',
                                duration:3000,
                                isClosable: true,
                                variant:"solid"
                              })
              }
            }
        }

      
  }
  
  const handleForgotPass = async (e) => {
    e.preventDefault()
   setFormReset(!formReset)
  }
  const handleReset = (e) => {
    e.preventDefault()
    setTriger(true)
  }
  const handleRememberMe = (e) =>{
      setFields({
        ...fields,
        rememberMe:e.target.checked
      })
      setPersist({
        token:null,
        isPersist: e.target.checked
      })
  }
  
  const content = isLoading ? (
                   <Center h='50vh' color='#065BAA'>
                       <PulseLoader color={"#065BAA"} />
                   </Center>
  )
                   : (
        <section className="login-page">
           <Box color='black:500'>
            <VStack
                    spacing={4}
                    align='stretch'
                    >
            <AbsoluteCenter axis='both' width="400px">
            <Box bg="white" minH="300" p="5" boxShadow='md' rounded='md' width={{ base: '100%' }}>   
                <Box mt="15px">
                  <Image src={'https://claim.amanyaman.com/images/logo.svg'} alt='Logo Aman' objectFit="cover" ml={'auto'} mr={'auto'}/>
                </Box>
                <Stack spacing={2} display="flex" flexDirection="row" justifyContent="center" mt="35px" h="50">
                  <Heading variant="primary" as="h4" size="md">Sales App</Heading>
                </Stack>
                {
                  formReset ? (
                    <Box width="auto" minH="300px" mt="2" spacing="2">
                      {
                        isError ? (
                            <Box mb={'3'} bg={'#ffeccc'} border={'1px'} borderColor={'#ffa000'} width={{ base: "100%" }} height={'55px'} p={'2'} display="flex" justifyContent={'flex-start'} alignItems={'center'}>
                              <Box bg="#FFA00">
                                  <MdWarning size={'20px'} color="#FFA000"/>
                              </Box>
                              <Text as={'p'} fontSize='xs' color={'black.200'} p={'3'}>
                                    User not found
                              </Text>
                            </Box>
                        ): (
                            <Box mb={'3'} bg={'#ffeccc'} border={'1px'} borderColor={'#ffa000'} width={{ base: "100%" }} height={'55px'} p={'2'} display="flex" justifyContent={'flex-start'} alignItems={'center'}>
                                <Box bg="#FFA00">
                                    <MdWarning size={'20px'} color="#FFA000"/>
                                </Box>
                                <Text as={'p'} fontSize='xs' color={'black.200'} p={'3'}>
                                      Please Fill Email and Password to reset password
                                </Text>
                            </Box>
                        )
                      }
                      
                    <Stack direction={['column']} spacing='10px'>    
                    <FormControl variant="floating" id="first-name" isRequired >
                        <Input variant="custom" placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="username" value={fieldsReset?.username} onChange={setFieldResetChange} h="48px"/>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Enter Username</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
                    </FormControl>
                    <FormControl variant="floating" id="pwd" isRequired display={'none'}>
                        <InputGroup>
                          <Input variant={'custom'} type={show ? 'text' : 'password'} placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="password" value={fieldsReset?.password} onChange={setFieldResetChange} h="48px" />
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
                    {/* <Link to="/forgot-password"> */}
                      {
                          formReset ? (
                            <>
                              
                                <Box display={'flex'} justifyContent={'flex-end'} >
                                  <Text fontSize={'sm'} as="u" color={'#065BAA'} onClick={ handleForgotPass} fontFamily="Mulish" fontWeight={'700'} cursor={'pointer'}>Back to login ?</Text>
                                 </Box>
                            </>
                          ): (
                        <Box display={'flex'} justifyContent={'flex-end'}>
                           <Text fontSize={'sm'} as="u" color={'#065BAA'} fontFamily="Mulish" fontWeight={'700'} onClick={ handleForgotPass} cursor={'pointer'}>Forgot Password ?</Text>
                        </Box>
                        )
                      }
                      
                    {/* </Link> */}
                      <Box onClick={handleRememberMe} display={'none'}>
                        <Checkbox defaultChecked color={'#231F20'} onClick={handleRememberMe} checked={persist?.isPersist} id="persist">
                           <Text fontSize={'sm'} onClick={handleRememberMe}>Remember Me </Text>
                        </Checkbox>
                      </Box>
                      <Button bg='#065BAA' onClick={handleReset} h="48px" isLoading={loading}>
                         <Text as="b" fontSize={'sm'} fontFamily="arial" fontWeight={'700'} style={{fontSize:"14px", textTransform:'uppercase'}}>Reset</Text>
                      </Button>
                    </Stack>
                </Box>
                  ) : (
                      <Box width="auto" minH="300px" mt="2" spacing="2">
                    <Stack direction={['column']} spacing='10px'>    
                    <FormControl variant="floating" id="first-name" isRequired >
                        <Input variant="custom" placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="username" value={fields?.username} onChange={setFieldChange} h="48px"/>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Enter Username</FormLabel>
                        {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
                    </FormControl>
                    <FormControl variant="floating" id="pwd" isRequired >
                        <InputGroup>
                          <Input variant="custom" type={show ? 'text' : 'password'} placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="password" value={fields?.password} bg={fields?.password !=='' ? '#e8f0fe' : '#ebebeb'} onChange={setFieldChange} h="48px" />
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
                    {/* <Link to="/forgot-password"> */}
                      <Box display={'flex'} justifyContent={'flex-end'}>
                        <Text fontSize={'sm'} as="u" color={'#065BAA'} fontFamily="Mulish" fontWeight={'700'} onClick={ handleForgotPass} cursor={'pointer'}>Forgot Password ?</Text>
                      </Box>
                    {/* </Link> */}
                      <Box onClick={handleRememberMe}>
                        <Checkbox defaultChecked color={'#231F20'} onClick={handleRememberMe} checked={persist?.isPersist} id="persist">
                           <Text fontSize={'sm'} onClick={handleRememberMe}>Remember Me </Text>
                        </Checkbox>
                      </Box>
                      
                                <Button bg='#065BAA' onClick={handlelogin} h="48px">
                                  <Text as="b" fontSize={'sm'} fontFamily="arial" fontWeight={'700'} style={{fontSize:"14px", textTransform:'uppercase'}}>Next</Text>
                                </Button>
                    </Stack>
                </Box>
                  )
                }
                
            </Box>
            </AbsoluteCenter>
            </VStack>
          </Box>
        </section>
    )

    return content
}
export default Login