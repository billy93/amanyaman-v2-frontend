import React from "react";
import { Flex, Spacer, Box,ButtonGroup,Heading,Button } from '@chakra-ui/react'
import Policy from './policy/policy'

function Main() {
  return (
    <>
    <Box display="flex" justifyContent="center" flexDirection="column">
    <Flex minWidth='max-content' alignItems='center' gap='2'>
    <Box p='2'>
        <Heading size='md'>Amanyaman App</Heading>
    </Box>
    <Spacer />
    <ButtonGroup gap='2'>
        <Button colorScheme='teal'>Sign Up</Button>
        <Button colorScheme='teal'>Log in</Button>
    </ButtonGroup>
    {/* <Policy/> */}
    </Flex>
    </Box>
    </>
  )
}

export default Main;
