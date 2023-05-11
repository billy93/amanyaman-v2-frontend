import { Link } from "react-router-dom"
import { Button, ButtonGroup,Box,Text } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
// import Logo from '../img/logo.jpeg'
import { Stack, Heading,AbsoluteCenter } from '@chakra-ui/react'
import {AiOutlineMail} from 'react-icons/ai'
const Public = () => {

    const content = (
        <section className="login-page">
           <Box color='black:500'>  
           <AbsoluteCenter axis='both' width={{base:"100%", xs:"100%",md:"400px"}}>
            <Box left="0" right="0" bottom="0" bg="white" h="auto" p="1em" boxShadow='md' rounded='md' width={{ base: '100%',md:"400px" }} >
              <Image src={'https://claim.amanyaman.com/images/logo.svg'} alt='Logo Aman' objectFit="cover" mb="2" mt="2.2em" ml={'auto'} mr={'auto'} />
                <Stack spacing={2} display="flex" flexDirection="column" justifyContent="center" mt="4em" h="50px" alignItems={'center'}>
                  <Heading variant="primary" as="div" size="lg">Lupa Kata Sandi?</Heading>
                  <Box display={'flex'} justifyContent={'center'} alignItems={'center'} textAlign={'center'} w={{base:"100%", md:"315px"}}>
                    <Text as="p" size={'sm'} style={{fontSize:'14px'}} fontFamily="Mulish">
                    Jangan khawatir! Pilih detil kontak yang Anda inginkan untuk mengatur ulang kata sandi Anda.
                    </Text>
                  </Box>
                </Stack>
            <Box pt="3" display="flex" justifyContent="flex-end" flexDirection="column" h={{base:"auto",md:"130px"}} >
            <ButtonGroup gap={{base:"5", md:"3"}} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
             {/* <Link to="/login-traveller" style={{border: "1px solid #065BAA",
              borderRadius: "5px"}} > */}
              <Button style={{border: "1px solid #065BAA",
              borderRadius: "5px"}} bg="#ebebeb" width="350px" h="78px" _hover={{
                bg:"#ebebebbd",
                border:"2px solid #065BAA"
              }}
              >
                <AiOutlineMail size={'2em'} color="#065BAA"/> <Text as="p" size="sm" style={{fontSize:"16px"}} color="#065BAA">***oe@gmail.com</Text>
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
            </Box>
            </AbsoluteCenter>
          </Box>
        </section>

    )
    return content
}
export default Public