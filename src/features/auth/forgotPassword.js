import React from "react"
import { Link,Navigate, useNavigate } from "react-router-dom"
import { Button, ButtonGroup,Box,Text } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import { useSelector, useDispatch } from "react-redux"
import {useSendEmailConfirmMutation} from './forgotApiSlice'
// import Logo from '../img/logo.jpeg'
import {userResetPassword} from './authSlice'
import { Stack, Heading,AbsoluteCenter } from '@chakra-ui/react'
import {AiOutlineMail,AiFillCheckCircle} from 'react-icons/ai'
const Public = () => {
  const userEmail = useSelector(userResetPassword)
  const [trigger, setTrigger] = React.useState(false)
  const navigate = useNavigate()
  const [sendEmailConfirm, {isLoading, isSuccess,isError}] = useSendEmailConfirmMutation()

  const handleSendEmailConf = async(e) => {
    e.preventDefault()
    // setTrigger(true)
    let res = await sendEmailConfirm({email:userEmail?.email})
  }
    const content = (
        <section className="login-page">
           <Box color='black:500'>  
           <AbsoluteCenter axis='both' width={{base:"100%", xs:"100%",md:"400px"}}>
            <Box left="0" right="0" bottom="0" bg="white" h="auto" p="1em" boxShadow='md' rounded='md' width={{ base: '100%',md:"400px" }} >
              <Image src={'https://claim.amanyaman.com/images/logo.svg'} alt='Logo Aman' objectFit="cover" mb="2" mt="2.2em" ml={'auto'} mr={'auto'} />
                {
                isSuccess ? (
                  <Box mt="4em" mb="4em" h="50px" bg={'white'} border={'1px'} borderColor={'#50b848'} width={{base:"100%"}} height={'55px'} p={'2'} display="flex" justifyContent={'flex-start'} alignItems={'center'}>
                        <Box bg="#FFA00">
                            <AiFillCheckCircle size={'20px'} color="rgb(80 184 72)"/>
                        </Box>
                        <Text as={'p'} fontSize='xs' color={'black.200'} p={'3'}>
                              Email has been sent
                        </Text>
                    </Box>
                ) : isError ?
                     <Box mt="4em" h="50px" mb={'4em'} bg={'white'} border={'1px'} borderColor={'red'} width={{base:"100%"}} height={'55px'} p={'2'} display="flex" justifyContent={'flex-start'} alignItems={'center'}>
                        <Box bg="#FFA00">
                            <AiFillCheckCircle size={'20px'} color="red"/>
                        </Box>
                        <Text as={'p'} fontSize='xs' color={'black.200'} p={'3'}>
                              {'Email Failed to sent'}
                        </Text>
                    </Box>
                    :(
                    <Stack spacing={2} display="flex" flexDirection="column" justifyContent="center" mt="4em" h="50px" alignItems={'center'}>
                      <Heading variant="primary" as="div" size="lg">Lupa Kata Sandi?</Heading>
                      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} textAlign={'center'} w={{base:"100%", md:"315px"}}>
                        <Text as="p" size={'sm'} style={{fontSize:'14px'}} fontFamily="Mulish">
                        Jangan khawatir! Pilih detil kontak yang Anda inginkan untuk mengatur ulang kata sandi Anda.
                        </Text>
                      </Box>
                    </Stack>
                  )
                }
                

              {
               
                !isSuccess ? (
                  <>
                  <Box pt="3" display="flex" justifyContent="flex-end" flexDirection="column" h={{base:"auto",md:"130px"}} >
                  <ButtonGroup gap={{base:"5", md:"3"}} display="flex" flexDirection="column" justifyContent="center" alignItems="center" >
                  {/* <Link to="/login-traveller" style={{border: "1px solid #065BAA",
                    borderRadius: "5px"}} > */}
                    <Button onClick={handleSendEmailConf} style={{border: "1px solid #065BAA",
                    borderRadius: "5px"}} bg="#ebebeb" width="350px" h="78px" _hover={{
                      bg:"#ebebebbd",
                      border:"2px solid #065BAA"
                    }}
                    >
                      <AiOutlineMail size={'2em'} color="#065BAA"/> <Text as="p" size="sm" style={{fontSize:"16px"}} color="#065BAA">{userEmail?.email?.replace(/\B.+@/g, (c, ) => c.split('').slice(3, -2).map(v => '*').join('') + '@')}</Text>
                    </Button>
                  {/* </Link> */}
                  </ButtonGroup>
                  </Box>
                  <Box display={'flex'} justifyContent={'center'} alignItems={'center'} pt="1em" pb="1em">
                  <Text as="p" size="sm" style={{fontSize:"14px"}} >
                      Sudah ingat kata sandi Anda? Cobalah
                  </Text>
                  <Link to="/">    
                  <Text as="b" size="sm" style={{fontSize:"14px"}} color="#065BAA" pl="5px">
                      Masuk akun
                  </Text>
                  </Link>
                    </Box>
                    </>
                ) : (
                    <Link to="/">
                      <Button isLoading={isLoading} style={{
                        border: "1px solid #065BAA",
                        borderRadius: "5px"}} bg="#ebebeb" width="100%" h="48px" _hover={{
                        bg:"#ebebebbd",
                        border:"2px solid #065BAA"
                      }}
                ><Text as="p" size="sm" style={{fontSize:"16px"}} color="#065BAA">Back Login</Text></Button>
                    </Link>
              )
            }
            </Box>
            </AbsoluteCenter>
          </Box>
        </section>

    )
    return content
}
export default Public