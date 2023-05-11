import { Link } from "react-router-dom"
import { Button, ButtonGroup,Box,Text } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import Logo from '../img/logo.jpeg'
import { Stack, Heading,AbsoluteCenter } from '@chakra-ui/react'

const Public = () => {

    const content = (
        <section className="login-page">
           <Box color='black:500'>  
           <AbsoluteCenter axis='both' width={{base:"100%", xs:"100%",md:"400px"}}>
            <Box left="0" right="0" bottom="0" bg="white" h="400px" p="4" boxShadow='md' rounded='md' width={{ base: '100%' }} >
              <Image src={'https://claim.amanyaman.com/images/logo.svg'} alt='Logo Aman' objectFit="cover" mb="2" mt="2.2em" ml={'auto'} mr={'auto'} />
                <Stack spacing={2} display="flex" flexDirection="row" justifyContent="center" mt="7" h="50px" alignItems={'center'}>
                  <Heading variant="primary" as="div" size="lg">Claim App</Heading>
                </Stack>
            <Box pt="3" display="flex" justifyContent="flex-end" flexDirection="column" h={{base:"auto",md:"145px"}} >
            <ButtonGroup gap={{base:"5", md:"3"}} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
             <Link to="/login-traveller" style={{border: "1px solid #065BAA",
              borderRadius: "5px"}} >
              <Button variant="base" width="350px" h="48px">
                    {/* <Text as="b" color={'#065BAA'} size="sm">
                      TRAVELFAIR LOGIN
                    </Text> */}
                      TRAVELFAIR LOGIN
              </Button>
             </Link>
             <Link to="/login-user" style={{margon:0,border: "1px solid #065BAA",
              borderRadius: "5px"}}>
              <Button variant="base" width="350px" h="48px">
                    OTHERS LOGIN
              </Button>
             </Link>
            </ButtonGroup>
            </Box>
            </Box>
            </AbsoluteCenter>
          </Box>
        </section>

    )
    return content
}
export default Public