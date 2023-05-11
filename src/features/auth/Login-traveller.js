import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { Link } from "react-router-dom"
import { MdWarning } from 'react-icons/md'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Heading,
  Button,
  Text,
  AbsoluteCenter,
} from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import Logo from '../../img/logo.jpeg'
import { Stack, HStack, VStack } from '@chakra-ui/react'

const LoginTraveller = () => {
    const userRef = useRef()
    const errRef = useRef()
    const [insuredName, setInsuredName] = useState('Rama Perwira')
    const [policyNumber, setPolicyNumber] = useState('1010152523000017A19L0')
    const [pasportNumber, setPasportNumber] = useState('1113313')
    const [errMsg, setErrMsg] = useState(false)
    const navigate = useNavigate()

    const [login, { isLoading }] = useLoginMutation()
    const dispatch = useDispatch()
    const [input, setInput] = useState('')

    const handleInsuredNameChange = (e) => setInsuredName(e.target.value)
    const handlePolicyChange = (e) => setPolicyNumber(e.target.value)
    const handlePasportChange = (e) => setPasportNumber(e.target.value)

    const isErrorInsured = insuredName === ''
    const isErrorPolicy = policyNumber === ''
    const isErrorPasport = pasportNumber === ''
    
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    // useEffect(() => {
    //     if (user && pwd !== '') {
    //         navigate('/claim/list')
    //     }
    // }, [user, pwd])
    
    const handlelogin = (e) => {
         if (insuredName && policyNumber !== '' && pasportNumber !=='') {
            dispatch(setCredentials({insuredName,policyNumber,pasportNumber}))
            navigate('/claim/list')
         } else {
           setErrMsg(true);
      }
      
    }
    const content = isLoading ? <h1>Loading...</h1> : (
        <section className="login-page">
           <Box color='black:500' position={'relative'} h="100vh">
            <VStack spacing={4} align='stretch'>
            <AbsoluteCenter axis='both' width="400px">
            <Box bg="white" minH="400" pl="25px" pr="25px" boxShadow='md' rounded='md' width={{ base: '100%' }}>     
                <Box pt="1em" display={'flex'}>
                  <Image src={'https://claim.amanyaman.com/images/logo.svg'} alt='Logo Aman' objectFit="cover" ml={'auto'} mr={'auto'}/>
                </Box>
                <Stack spacing={2} display="flex" flexDirection="row" justifyContent="center" mt="4" h="50">
                  <Heading variant="primary" as="h4" size="md">Traveller Log In</Heading>
                </Stack>
                <Box as={'section'} >
                  {
                    errMsg && <Heading variant={'custom'} as="h6" size="xs">*Invalid insured name or policy number or pasport number</Heading>
                  }
                </Box>
                <Box width="auto" minH="400px" mt="2" spacing="2">
                    <Stack direction={['column']} spacing='10px'>    
                    <FormControl variant="floating" id="insured-name" isRequired >
                        <Input placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={insuredName} onChange={handleInsuredNameChange} h="48px"/>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                        <FormLabel fontSize="12" pt="1.5">Enter Insured Name</FormLabel>
                        {isErrorInsured ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>}
                    </FormControl>
                    <FormControl variant="floating" id="policy" isRequired >
                          <Input type={'text'} placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={policyNumber} onChange={handlePolicyChange} h="48px" />
                          <FormLabel fontSize="12" pt="1.5" >Enter Policy Number</FormLabel>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                    </FormControl>
                    <FormControl variant="floating" id="passport" isRequired >
                          <Input type={'text'} placeholder=" " _placeholder={{ opacity: 1, color: 'gray.500' }} value={pasportNumber} onChange={handlePasportChange} h="48px" />
                          <FormLabel fontSize="12" pt="1.5" >Enter Passport Number</FormLabel>
                        {/* It is important that the Label comes after the Control due to css selectors */}
                    </FormControl>
                    <Box>
                      <Box mb={'3'} bg={'#ffeccc'} border={'1px'} borderColor={'#ffa000'} height={'88px'} p={'5px'} display="flex" justifyContent={'center'} alignItems={'center'}>
                          <Box bg="#FFA00" m={'2'}>
                              <MdWarning size={'20px'} color="#FFA000"/>
                          </Box>
                          <Text as={'p'} fontSize='xs' color={'#231F20'} p={'4px'} style={{fontSize:"14px"}} fontFamily="Mulish" >
                                  Input insured name, policy number and passport number as in the issued policy certificate.
                          </Text>
                      </Box>
                    </Box>
                      <Button bg='#065BAA' onClick={handlelogin} h="48px">
                         <Heading as="b" fontSize={'sm'} fontFamily="arial" fontWeight={'700'} style={{fontSize:"14px", textTransform:'uppercase'}}>Next</Heading>
                      </Button>
                    </Stack>
                    <Box h="100px" width="auto" mt="5" display={'flex'} justifyContent={'center'} alignItems={'center'}>
                     <ArrowBackIcon boxSize={4} size="sm" w={5} h={5} color="#065BAA"/>
                      <Link to="/">
                        <Heading fontSize='sm' as="b" color="#065BAA" style={{fontSize:'16px'}} fontFamily="Mulish" fontWeight={'700'}>
                            Go Back
                        </Heading>
                      </Link>
                    </Box>
                </Box>
            </Box>
            </AbsoluteCenter>
            </VStack>
          </Box>
        </section>
    )

    return content
}
export default LoginTraveller