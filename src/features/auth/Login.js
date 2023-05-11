import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { useDispatch,useSelector } from 'react-redux'
import { setCredentials,UserRoles,selectCurrentUser,selectCurrentToken } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { Link } from "react-router-dom"
import { AiFillEyeInvisible,AiFillEye } from "react-icons/ai";

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

const Login = () => {
    const userRef = useRef()
    const errRef = useRef()
    const toast = useToast()
    const role = useSelector(UserRoles)
    const username = useSelector(selectCurrentUser)
    const pass = useSelector(selectCurrentToken)
    const [user, setUser] = useState('bayu')
    const [pwd, setPwd] = useState('abcd1234')
    const [errMsg, setErrMsg] = useState(false)
    const navigate = useNavigate()

    const [login, { isLoading }] = useLoginMutation()
    const dispatch = useDispatch()
    const [input, setInput] = useState('')

    const handleUserChange = (e) => setUser(e.target.value)
    const handlePwdChange = (e) => setPwd(e.target.value)
    const [fields, setFields] = useState({
    username: "",
    password:""
    })
    const isErrorUser = user === ''
    const isErrorPwd = pwd === ''
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    // useEffect(() => {
    //     if (user && pwd !== '') {
    //         navigate('/claim/list')
    //     }
    // }, [user, pwd])
  const setFieldChange = (e) => {
      
      setFields({...fields,[e.target.name]:e.target.value})
  }
  console.log('fields', fields?.username)
  const handlelogin = async (e) => {
      let userroles = role?.filter((user) => user.username === fields?.username)
      // console.log('user roles', userroles)
      // console.log('user roles fields', fields)
         if (fields?.username === userroles[0]?.username && fields?.password === userroles[0]?.password ) {
          console.log('ss', {username:userroles[0].username,password:userroles[0].password,role:userroles[0].role})
            dispatch(setCredentials({username:userroles[0].username,password:userroles[0].password,role:userroles[0].role}))
            navigate('/create-quota/search')
            toast({
                  title: `Login Success`,
                  status:"success",
                  position: 'top-right',
                  duration:3000,
                  isClosable: true,
                  variant:"solid",
                })
          } else {
            setErrMsg(true);
            toast({
                  title: `Login Failed`,
                  status:"error",
                  position: 'top-right',
                  duration:3000,
                  isClosable: true,
                  variant:"solid"
                })
            
      }
    // try {
    //         const userData = await login({ username:fields?.username, password:fields?.password }).unwrap()
    //         // dispatch(setCredentials({ ...userData, user }))
    //         console.log('user data', userData)
    //     } catch (err) {
    //         if (!err?.originalStatus) {
    //             // isLoading: true until timeout occurs
    //             setErrMsg('No Server Response');
    //         } else if (err.originalStatus === 400) {
    //             setErrMsg('Missing Username or Password');
    //         } else if (err.originalStatus === 401) {
    //             setErrMsg('Unauthorized');
    //         } else {
    //             setErrMsg('Login Failed');
    //         }
    //         errRef.current.focus();
    //     }

      
    }
    const content = isLoading ? <h1>Loading...</h1> : (
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
                <Box as={'section'}>
                  {
                    errMsg && <Heading variant={'custom'} as="h6" size="xs">*Invalid username or password</Heading>
                  }
                </Box>
                <Box width="auto" minH="300px" mt="2" spacing="2">
                    <Stack direction={['column']} spacing='10px'>    
                    <FormControl variant="floating" id="first-name" isRequired >
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="username" value={fields?.username} onChange={setFieldChange} h="48px"/>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Enter Username</FormLabel>
                        {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>}
                    </FormControl>
                    <FormControl variant="floating" id="pwd" isRequired >
                        <InputGroup>
                          <Input type={show ? 'text' : 'password'} placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} name="password" value={fields?.password} onChange={setFieldChange} h="48px" />
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
                    <Link to="/forgot-password">
                      <Box display={'flex'} justifyContent={'flex-end'}>
                        <Text fontSize={'sm'} as="u" color={'#065BAA'} fontFamily="Mulish" fontWeight={'700'}>Forgot Password ?</Text>
                      </Box>
                    </Link>
                      <Box>
                        <Checkbox defaultChecked color={'#231F20'}>
                           <Text fontSize={'sm'}>Remember Me </Text>
                        </Checkbox>
                      </Box>
                      <Button bg='#065BAA' onClick={handlelogin} h="48px">
                         <Text as="b" fontSize={'sm'} fontFamily="arial" fontWeight={'700'} style={{fontSize:"14px", textTransform:'uppercase'}}>Next</Text>
                      </Button>
                    </Stack>
                </Box>
            </Box>
            </AbsoluteCenter>
            </VStack>
          </Box>
        </section>
    )

    return content
}
export default Login